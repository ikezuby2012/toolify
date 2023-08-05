import { Model, Document, Types } from "mongoose";
import { QueryResult } from "../paginate/paginate";

export interface ITool {
  creatorId: string | Types.ObjectId;
  category: string;
  title: string;
  description: string;
  make: string;
  model: string;
  equipmentDelivery0rReturn: string;
  paymentPlan: { daily?: number; weekly?: number; monthly?: number };
  availableQuantity: number;
  availableLocation: string;
  image?: Blob | string;
}

export type UpdateToolBody = Partial<ITool>;

type MakeRequiredExcept<T, K extends keyof T> = {
  [P in keyof T as P extends K ? P : Required<P>]: T[P];
};

export type NewTool = MakeRequiredExcept<ITool, "image">;

export interface IToolDoc extends ITool, Document {
  _id: string;
}

export interface IToolModel extends Model<IToolDoc> {
  paginate(
    filter: Record<string, any>,
    options: Record<string, any>
  ): Promise<QueryResult>;
}
