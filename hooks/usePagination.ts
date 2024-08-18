import { PaginationState } from "@tanstack/react-table";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export const usePagination = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const page = Number(searchParams.get("page")) || 1;
  const perPage = Number(searchParams.get("pageSize")) || 10;

  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: page - 1,
    pageSize: perPage,
  });

  const [initialLoad, setInitialLoad] = useState(true);

  useEffect(() => {
    // Skip pagination during initial load.
    if (initialLoad) {
      setInitialLoad(false);
      return;
    }

    router.push(`/?page=${pageIndex + 1}&pageSize=${pageSize}`, {
      scroll: false,
    });
  }, [pageIndex, pageSize]);

  return { pageIndex, pageSize, setPagination };
};
