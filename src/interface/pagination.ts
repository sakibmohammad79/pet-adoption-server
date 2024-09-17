export interface IPaginationOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: string;
}

export interface IPaginationResult {
  page: number;
  limit: number;
  skip: number;
  sortBy: string;
  sortOrder: string;
}
