export const getPageQuery = (query: any) => {
    let page = 1
    let pageSize = 10

    if (+query.pageNumber) {
        page = +query.pageNumber
    }

    if (+query.pageSize) {
        pageSize = +query.pageSize
    }

    return {
        page,
        pageSize
    }
}