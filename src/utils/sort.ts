export const sortGetValues = (sortBy: string, sortDirection: string) => {
    const obj: any = {}
    obj[sortBy] = sortDirection ? -1 : 1
    return obj
}