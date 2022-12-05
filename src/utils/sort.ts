export const sortGetValues = (sortBy: string, sortDirection: string) => {
    const obj: any = {}
    obj[sortBy] = sortDirection
    return obj
}