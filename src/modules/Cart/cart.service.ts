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
 * @param {mongoose.Types.ObjectId} DocId
 * @returns {Promise<ICartDoc | null>}
 */
export const deleteCartById = async (
  DocId: mongoose.Types.ObjectId
): Promise<ICartDoc | null> => {
  const doc = await Cart.findByIdAndDelete(DocId);
  if (!doc) {
    throw new ApiError(httpStatus.NOT_FOUND, "Doc not found");
  }
  return doc;
};

/**
 * Get borrowed tools
 * @param {mongoose.Types.ObjectId} id
 * @returns {Promise<ICartDoc | null>}
 */
export const getBorrowedTools = async (
  id: mongoose.Types.ObjectId
): Promise<ICartDoc | null> => {
  const tools = (await Cart.find({ userId: id })) as any;
  return tools;
};
