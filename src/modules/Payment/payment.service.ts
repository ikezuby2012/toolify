import mongoose from "mongoose";
import httpStatus from "http-status";
import { IPaymentDoc } from "./payment.interface";
import Payment from "./payment.model";
import { IOptions, QueryResult } from "../paginate/paginate";
import { ApiError } from "../errors";

/**
 * Get document by id
 * @param {mongoose.Types.ObjectId} id
 * @returns {Promise<IPaymentDoc | null>}
 */
export const getPaymentById = async (
  id: mongoose.Types.ObjectId
): Promise<IPaymentDoc | null> => Payment.findById(id);

/**
 * Query for payment
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
export const queryDocs = async (
  filter: Record<string, any>,
  options: IOptions
): Promise<QueryResult> => {
  const doc = await Payment.paginate(filter, options);
  return doc;
};

/**
 * Get Payment created by id
 * @param {mongoose.Types.ObjectId} id
 * @returns {Promise<IPaymentDoc | null>}
 */
export const getPaymentCreatedId = async (
  id: mongoose.Types.ObjectId
): Promise<IPaymentDoc | null> => {
  const payment = (await Payment.find({ userId: id })) as any;
  return payment;
};

/**
 * Delete payment by id
 * @param {mongoose.Types.ObjectId} userId
 * @returns {Promise<IPaymentDoc | null>}
 */
export const deletePaymentById = async (
  id: mongoose.Types.ObjectId
): Promise<IPaymentDoc | null> => {
  const doc = await Payment.findByIdAndDelete(id);
  if (!doc) {
    throw new ApiError(httpStatus.NOT_FOUND, "payment not found");
  }
  return doc;
};
