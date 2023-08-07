import mongoose from "mongoose";
import httpStatus from "http-status";
import { ICartDoc } from "./cart.interface";
import Cart from "./cart.model";
import { IOptions, QueryResult } from "../paginate/paginate";
import { ApiError } from "../errors";

/**
 * Get document by id
 * @param {mongoose.Types.ObjectId} id
 * @returns {Promise<ICartDoc | null>}
 */
export const getCartById = async (
  id: mongoose.Types.ObjectId
): Promise<ICartDoc | null> => Cart.findById(id);

/**
 * Query for carts
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
export const queryDoc = async (
  filter: Record<string, any>,
  options: IOptions
): Promise<QueryResult> => {
  const doc = await Cart.paginate(filter, options);
  return doc;
};

/**
 * Delete doc by id
 * @param {mongoose.Types.ObjectId} userId
 * @returns {Promise<IUserDoc | null>}
 */
export const deleteCartById = async (
  userId: mongoose.Types.ObjectId
): Promise<ICartDoc | null> => {
  const doc = await Cart.findByIdAndDelete(userId);
  if (!doc) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
  return doc;
};
