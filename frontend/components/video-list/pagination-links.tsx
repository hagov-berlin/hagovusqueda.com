"use client";

import { usePathname } from "next/navigation";
import type { Pagination, SearchOptions } from "@/data/types";
import styles from "./pagination-links.module.css";
import Link from "next/link";
import { useSearchContext } from "@/data/context";

function getPageNumbers(currentPage: number, pageCount: number) {
  const nums = [currentPage - 1, currentPage, currentPage + 1].filter(
    (num: number) => 1 <= num && num <= pageCount
  );
  const set = new Set(nums);
  return [...set].sort((a, b) => a - b);
}

function getLinkPath(
  currentPath: string,
  searchOptions: SearchOptions,
  page: number,
  isSearchResultList?: boolean
) {
  if (isSearchResultList) {
    const params: URLSearchParams = new URLSearchParams();
    params.set("q", searchOptions.q);
    params.set("page", page.toString());
    if (searchOptions.showSlug) {
      params.set("show", searchOptions.showSlug.toString());
    }
    return `${currentPath}?${params.toString()}`;
  }
  if (/\/\d+$/.test(currentPath)) {
    return currentPath.replace(/\/\d+$/, `/${page}`);
  }
  return `${currentPath}/${page}`;
}

export default function PaginationLinks(props: {
  pagination: Pagination;
  isSearchResultList?: boolean;
}) {
  const { pagination, isSearchResultList } = props;
  const { currentPage, pageCount } = pagination;
  const { searchOptions } = useSearchContext();
  const path = usePathname();

  const pageNumbers = getPageNumbers(currentPage, pageCount);

  return (
    <div className={styles.paginationContainer}>
      {currentPage !== 1 ? (
        <Link href={getLinkPath(path, searchOptions, 1, isSearchResultList)}>{"<<"}</Link>
      ) : null}
      {pageNumbers.map((pageNumber: number) => (
        <Link
          key={pageNumber}
          href={getLinkPath(path, searchOptions, pageNumber, isSearchResultList)}
          className={pageNumber === currentPage ? styles.currentPage : ""}
        >
          {pageNumber}
        </Link>
      ))}
      {currentPage !== pageCount ? (
        <Link href={getLinkPath(path, searchOptions, pageCount, isSearchResultList)}>{">>"}</Link>
      ) : null}
    </div>
  );
}
