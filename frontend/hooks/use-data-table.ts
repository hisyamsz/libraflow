"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { format } from "date-fns";
import {
  DEFAULT_LIMIT,
  DEFAULT_PAGE,
  DELAY,
} from "@/constants/data-table-constants";
import useDebounce from "./useDebounce";

export default function useDataTable() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const debounce = useDebounce();

  const getParam = (key: string, defaultValue: string | number = "") => {
    return searchParams.get(key) ?? String(defaultValue);
  };

  const currentLimit = Number(getParam("limit", DEFAULT_LIMIT));
  const currentPage = Number(getParam("page", DEFAULT_PAGE));
  const currentSearch = getParam("search", "");
  const currentCategory = getParam("category", "");
  const currentIsOnline = getParam("isOnline", "");
  const currentIsFeatured = getParam("isFeatured", "");
  const currentStartDate = getParam("startDate", "");
  const currentEndDate = getParam("endDate", "");

  const updateQuery = (params: Record<string, string | number>) => {
    const newParams = new URLSearchParams(searchParams.toString());

    Object.entries(params).forEach(([key, value]) => {
      if (value === "" || value === "null") {
        newParams.delete(key);
      } else {
        newParams.set(key, String(value));
      }
    });

    router.push(`?${newParams.toString()}`);
  };

  const setUrl = () => {
    updateQuery({
      limit: currentLimit || DEFAULT_LIMIT,
      page: currentPage || DEFAULT_PAGE,
      search: currentSearch || "",
    });
  };

  const setUrlExplore = () => {
    updateQuery({
      limit: currentLimit || DEFAULT_LIMIT,
      page: currentPage || DEFAULT_PAGE,
      category: currentCategory,
      isOnline: currentIsOnline,
      isFeatured: currentIsFeatured,
    });
  };

  const handleChangePage = (page: number) => {
    updateQuery({ page });
  };

  const handleChangeLimit = (limit: number) => {
    updateQuery({
      limit,
      page: DEFAULT_PAGE,
    });
  };

  const handleChangeCategory = (category: string) => {
    updateQuery({
      category,
      page: DEFAULT_PAGE,
    });
  };

  const handleChangeIsFeatured = (isFeatured: string) => {
    updateQuery({
      isFeatured,
      page: DEFAULT_PAGE,
    });
  };

  const handleSearch = (value: string) => {
    debounce(() => {
      updateQuery({
        search: value,
        page: DEFAULT_PAGE,
      });
    }, DELAY);
  };

  const handleClearSearch = () => {
    updateQuery({
      search: "",
      page: DEFAULT_PAGE,
    });
  };

  const handleChangeStartDate = (date: Date | undefined) => {
    updateQuery({
      startDate: date ? format(date, "yyyy-MM-dd") : "",
      page: DEFAULT_PAGE,
    });
  };

  const handleChangeEndDate = (date: Date | undefined) => {
    updateQuery({
      endDate: date ? format(date, "yyyy-MM-dd") : "",
      page: DEFAULT_PAGE,
    });
  };

  const handleResetDates = () => {
    updateQuery({
      startDate: "",
      endDate: "",
      page: DEFAULT_PAGE,
    });
  };

  return {
    currentLimit,
    currentPage,
    currentSearch,
    currentCategory,
    currentIsOnline,
    currentIsFeatured,
    currentStartDate,
    currentEndDate,

    handleChangeLimit,
    handleChangePage,
    handleSearch,
    handleClearSearch,
    handleChangeCategory,
    handleChangeIsFeatured,
    handleChangeStartDate,
    handleChangeEndDate,
    handleResetDates,

    setUrl,
    setUrlExplore,
  };
}
