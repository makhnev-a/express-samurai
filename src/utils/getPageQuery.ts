export const getPageQuery = (query: any) => {
    let page = 1
    let pageSize = 10
    let sortBy = "createdAt"
    let sortDirection = "desc"

    if (+query.pageNumber) {
        page = +query.pageNumber
    }

    if (+query.pageSize) {
        pageSize = +query.pageSize
    }

    if (query.sortBy) {
        sortBy = query.sortBy
    }

    if (query.sortDirection) {
        sortDirection = query.sortDirection
    }

    return {
        page,
        pageSize,
        sortBy,
        sortDirection
    }
}