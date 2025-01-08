import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { EventMap } from "app/models/event_map.model";
import { Model } from "mongoose";

@Injectable()
export class RowDataService {
    constructor(
        @InjectModel(EventMap.name) private readonly eventMapModel: Model<EventMap>
    ){}


}