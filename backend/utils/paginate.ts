import { Prisma } from "@prisma/client";

interface PaginationOptions<T> {
  page?: number;
  limit?: number;
  where?: Prisma.SelectSubset<T, any>;
  orderBy?: Prisma.Enumerable<any>;
  include?: Prisma.Enumerable<any>;
}

interface PaginatedResult<T> {
  items: T[];
  totalCount: number;
  totalPages: number;
  page: number;
  limit: number;
}

/**
 * Reusable Prisma pagination helper
 * @param model - Prisma model (e.g., prisma.user)
 * @param options - Pagination, filter, include, and sorting options
 */
export const prismaPaginate = async <T>(
  model: any,
  options: PaginationOptions<T> = {}
): Promise<PaginatedResult<T>> => {
  const page = Number(options.page) || 1;
  const limit = Number(options.limit) || 10;
  const skip = (page - 1) * limit;

  const where = options.where || {};
  const orderBy = options.orderBy || { createdAt: "desc" };
  const include = options.include || undefined;

  const [items, totalCount] = await Promise.all([
    model.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      include,
    }),
    model.count({ where }),
  ]);

  return {
    items,
    totalCount,
    totalPages: Math.ceil(totalCount / limit),
    page,
    limit,
  };
};
