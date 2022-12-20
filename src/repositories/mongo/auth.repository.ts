import {IUser} from "../../interfaces/user.interface";
import {userCollection} from "../../db/mongoDb";

export const authRepository = {
    async login(login: string, password: string): Promise<boolean> {
        const user: IUser | null = await userCollection.findOne({password, $or: [{login}, {email: login}]})
        return !!user
    }
}