export const getPageQuery = (query: any) => {
    let page = 1
    let pageSize = 10
    let sortBy = "createdAt"
    let sortDirection = "desc"
    let searchNameTerm = null
    let searchLoginTerm = null
    let searchEmailTerm = null

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

    if (query.searchNameTerm) {
        searchNameTerm = query.searchNameTerm
    }

    if (query.searchLoginTerm) {
        searchLoginTerm = query.searchLoginTerm
    }

    if (query.searchEmailTerm) {
        searchEmailTerm = query.searchEmailTerm
    }

    return {
        page,
        pageSize,
        sortBy,
        sortDirection,
        searchNameTerm,
        searchLoginTerm,
        searchEmailTerm
    }
}