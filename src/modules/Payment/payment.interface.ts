import { Model, Document, Types } from "mongoose";
import { QueryResult } from "../paginate/paginate";

export interface IPayment {
  deliveryOption: string;
  returnOption: string;
  paymentOption: "visa" | "mastercard" | "cash";
  cardHolderName?: string;
  cardNumber?: string;
  expiry?: string;
  cvv?: string;
  location?: string;
  country?: string;
  startDate: string;
  endDate: string;
  userId?: Types.ObjectId;
}

export interface IPaymentDoc extends IPayment, Document {
  _id: string;
}

export interface IPaymentModel extends Model<IPaymentDoc> {
  paginate(
    filter: Record<string, any>,
    options: Record<string, any>
  ): Promise<QueryResult>;
}
