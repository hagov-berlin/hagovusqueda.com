"use client";

import { Fragment } from "react";
import { usePathname } from "next/navigation";
import type { Pagination, SearchOptions } from "@/data/types";
import styles from "./pagination-links.module.css";
import Link from "next/link";
import { useSearchContext } from "@/data/context";

function getPageNumbers(currentPage: number, pageCount: number) {
  const nums = [1, currentPage - 1, currentPage, currentPage + 1, pageCount].filter(
    (num: number) => 1 <= num && num <= pageCount
  );
  const set = new Set(nums);
  return [...set].sort((a, b) => a - b);
}

function getLinkPath(currentPath: string, searchOptions: SearchOptions, page: number) {
  const params: URLSearchParams = new URLSearchParams();
  params.set("page", page.toString());
  if (searchOptions.q) {
    params.set("q", searchOptions.q);
  }
  if (searchOptions.showSlug) {
    params.set("show", searchOptions.showSlug.toString());
  }
  return `${currentPath}?${params.toString()}`;
}

export default function PaginationLinks(props: { pagination: Pagination }) {
  const { pagination } = props;
  const { currentPage, pageCount } = pagination;
  const { searchOptions } = useSearchContext();
  const path = usePathname();

  const pageNumbers = getPageNumbers(currentPage, pageCount);

  return (
    <div className={styles.paginationContainer}>
      {pageNumbers.map((pageNumber: number, index) => {
        const link = (
          <Link
            key={pageNumber}
            href={getLinkPath(path, searchOptions, pageNumber)}
            className={pageNumber === currentPage ? styles.currentPage : ""}
          >
            {pageNumber}
          </Link>
        );
        if (pageNumbers[index + 1] && pageNumbers[index + 1] !== pageNumber + 1) {
          const separator = <span>...</span>;
          return (
            <Fragment key={pageNumber}>
              {link} {separator}
            </Fragment>
          );
        }
        return link;
      })}
    </div>
  );
}
