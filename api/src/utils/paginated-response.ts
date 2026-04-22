export const paginatedResponse = <T>(
  data: T[],
  query: {
    limit: number
    page: number
  }
) => {
  return {
    page: query.page,
    hasNextPage: data.length > query.limit,
    data: data.slice(0, query.limit)
  }
}
