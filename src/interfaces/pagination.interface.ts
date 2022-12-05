export interface PaginationInterface<T> {
    totalCount: number
    page: number
    pageSize: number
    pagesCount: number
    items: T
}