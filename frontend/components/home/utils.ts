import { HagovSearchParams } from "@/data/types";

export const defaultParams: Omit<HagovSearchParams, "searchTerm"> = {
  show: "hay-algo-ahi",
};

export function urlWithQueryParams(newParams: HagovSearchParams) {
  const params = new URLSearchParams();
  params.set("q", newParams.searchTerm);
  if (newParams.show !== defaultParams.show) {
    params.set("show", newParams.show);
  }
  return `${window.location.pathname}?${params.toString()}`;
}
