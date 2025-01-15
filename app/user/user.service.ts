import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { User } from "app/global/models/user.model";
import { Model } from "mongoose";

@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name) private readonly userModel: Model<User>
    ) {}

    async getUser(key: string, value: any) {
        const user = await this.userModel.findOne({ [key]: value }).exec();
        if(user) {
            return user
        }
        return
    }

}