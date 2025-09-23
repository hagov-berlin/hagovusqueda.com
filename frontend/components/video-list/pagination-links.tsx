"use client";

import { usePathname } from "next/navigation";
import type { Pagination } from "@/data/types";
import styles from "./pagination-links.module.css";
import Link from "next/link";

function getPageNumbers(currentPage: number, pageCount: number) {
  const nums = [currentPage - 1, currentPage, currentPage + 1].filter(
    (num: number) => 1 <= num && num <= pageCount
  );
  const set = new Set(nums);
  return [...set].sort((a, b) => a - b);
}

function getLinkPath(currentPath: string, page: number) {
  if (/\/\d+$/.test(currentPath)) {
    return currentPath.replace(/\/\d+$/, `/${page}`);
  }
  return `${currentPath}/${page}`;
}

export default function PaginationLinks(props: { pagination: Pagination }) {
  const { currentPage, pageCount } = props.pagination;
  const path = usePathname();

  const pageNumbers = getPageNumbers(currentPage, pageCount);

  return (
    <div className={styles.paginationContainer}>
      {currentPage !== 1 ? <Link href={getLinkPath(path, 1)}>{"<<"}</Link> : null}
      {pageNumbers.map((pageNumber: number) => (
        <Link
          key={pageNumber}
          href={getLinkPath(path, pageNumber)}
          className={pageNumber === currentPage ? styles.currentPage : ""}
        >
          {pageNumber}
        </Link>
      ))}
      {currentPage !== pageCount ? <Link href={getLinkPath(path, pageCount)}>{">>"}</Link> : null}
    </div>
  );
}
