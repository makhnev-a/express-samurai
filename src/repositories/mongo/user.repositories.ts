import {IUser} from "../../interfaces/user.interface";
import {userCollection} from "../../db/mongoDb";
import {ObjectId} from "mongodb";
import {PaginationInterface} from "../../interfaces/pagination.interface";
import {sortGetValues} from "../../utils/sort";

export const userRepositories = {
    async createUser(login: string, password: string, email: string): Promise<IUser | null> {
        try {
            const newUser = {
                login,
                password,
                email,
                createdAt: new Date().toISOString()
            }
            const user = await userCollection.insertOne(newUser)

            return {
                id: new ObjectId(user.insertedId).toString(),
                login: newUser.login,
                email: newUser.email,
                createdAt: newUser.createdAt,
            }
        } catch {
            return null
        }
    },
    async getAllUsers(page: number, pageSize: number, sortBy: string, sortDirection: string, searchEmailTerm: string, searchLoginTerm: string): Promise<PaginationInterface<IUser[]>> {
        const searchLogin = !searchLoginTerm ? "" : searchLoginTerm
        const searchEmail = !searchEmailTerm ? "" : searchEmailTerm
        let searchObj = {}

        if (searchLogin && searchEmail) {
            searchObj = {
                login: {
                    $regex: searchLogin, $options: "-i"
                },
                email: {
                    $regex: searchEmail, $options: "-i"
                }
            }
        } else {
            if (searchLogin) {
                searchObj = {
                    login: {
                        $regex: searchLogin, $options: "-i"
                    },
                }
            } else if (searchEmail) {
                searchObj = {
                    email: {
                        $regex: searchEmail, $options: "-i"
                    },
                }
            }
        }

        const totalCount = await userCollection.countDocuments(searchObj)
        const pagesCount = Math.ceil(totalCount / pageSize)
        const pageSkip = (page - 1) * pageSize
        const sort = sortGetValues(sortBy, sortDirection)

        const users: IUser[] = await userCollection.find(searchObj)
            .skip(pageSkip)
            .limit(pageSize)
            .sort(sort)
            .toArray()
        const mappedUsers: IUser[] = users.map(user => {
            return {
                id: new ObjectId(user._id).toString(),
                login: user.login,
                createdAt: user.createdAt,
                email: user.email
            }
        })

        return {
            pagesCount,
            page,
            pageSize,
            totalCount,
            items: mappedUsers
        }
    },
    async deleteUserById(id: string): Promise<boolean> {
        const result = await userCollection.deleteOne({_id: new ObjectId(id)})

        return result.deletedCount === 1
    }
}