import { IPagination, IPaginationResult } from "../types/global";

const calculatePagination = (options: IPagination): IPaginationResult => {
  const page: number = Number(options.page) || 1;
  const limit: number = Number(options.limit) || 10;
  const skip: number = (page - 1) * limit;
  const sortBy: string = options.sortBy || "createdAt";
  const sortOrder: string = options.sortOrder || "desc";

  return {
    page,
    limit,
    skip,
    sortBy,
    sortOrder,
  };
};

export const paginationHelpers = {
  calculatePagination,
};
