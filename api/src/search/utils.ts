import { Show } from "@prisma/client";
import prisma from "../db";

export async function getShowIds(showSlugs: string[], channelSlug: string) {
  let shows: Show[] = [];
  if (showSlugs.length > 0) {
    shows = await prisma.show.findMany({ where: { slug: { in: showSlugs } } });
  } else if (channelSlug) {
    shows = await prisma.show.findMany({
      where: { channel: { slug: channelSlug } },
    });
  }
  const showIds = shows.map((show) => show.id);
  return showIds;
}

function normalizeText(text: string) {
  // TODO: merge this function with the one in the search endpoint
  text = text.replace(/[\[\],\.¿\?¡!\-"'%`:$€+\/@²º*]/g, "");
  text = text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  return text.replace(/\s+/g, " ").toLocaleLowerCase();
}

export function buildTextRegex(q: string) {
  const normalizedSearchTerm = normalizeText(q);
  const regexString = `\\b${normalizedSearchTerm}\\b`;
  const searchRegex = new RegExp(regexString, "i");
  return function testRegex(textToTest: string) {
    const normalizedTextToTest = normalizeText(textToTest);
    return searchRegex.test(normalizedTextToTest);
  };
}

export function getPagination(page: number, totalCount: number) {
  const amountPerPage = 10;
  const isFirstPage = page === 1;
  const pageCount = totalCount === 0 ? 1 : Math.ceil(totalCount / amountPerPage);
  const isLastPage = pageCount === page;

  return {
    isFirstPage,
    isLastPage,
    currentPage: page,
    previousPage: isFirstPage ? null : page - 1,
    nextPage: isLastPage ? null : page + 1,
    pageCount,
    totalCount,
  };
}
