import { Model, Document, Types } from "mongoose";
import { QueryResult } from "../paginate/paginate";

export interface ICart {
  userId: string | Types.ObjectId;
  tool: Types.ObjectId | string;
  quantity: number;
}

export type UpdateCartBody = Partial<ICart>;

export interface ICartDoc extends ICart, Document {
  _id: string;
}

export interface ICartModel extends Model<ICartDoc> {
  paginate(
    filter: Record<string, any>,
    options: Record<string, any>
  ): Promise<QueryResult>;
}
