import { Show } from "@prisma/client";
import prisma from "../db";
import { PageNumberCounters, PageNumberPagination } from "prisma-extension-pagination/dist/types";

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

export function normalizeText(text: string) {
  // TODO: merge this function with the one in the search endpoint
  text = text.replace(/[\\\[\],\.¿\?¡!\-"'%`:$€+\/@²º*\_]/g, "");
  text = text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  return text.replace(/\s+/g, " ").toLocaleLowerCase().trim();
}

export function buildTextRegex(q: string) {
  const normalizedSearchTerm = normalizeText(q);
  const regexString = `\\b${normalizedSearchTerm}\\b`;
  return new RegExp(regexString, "ig");
}

export function getPagination(
  page: number,
  totalCount: number
): PageNumberPagination & PageNumberCounters {
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
