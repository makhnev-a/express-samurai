export interface PaginationInterface<T> {
    total: number
    page: number
    pageSize: number
    pagesCount: number
    items: T
}