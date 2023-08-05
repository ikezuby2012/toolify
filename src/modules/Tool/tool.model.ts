import mongoose, { Schema } from "mongoose";

import toJSON from "../toJSON/toJSON";
import paginate from "../paginate/paginate";
import { IToolDoc, IToolModel } from "./tool.interface";

const toolSchema = new mongoose.Schema<IToolDoc, IToolModel>(
  {
    category: {
      type: String,
      required: [true, "category is required"],
      trim: true,
    },
    title: {
      type: String,
      required: [true, "title is required"],
    },
    description: {
      type: String,
      required: [true, "description is required"],
    },
    make: {
      type: String,
      required: [true, "make is required"],
    },
    model: {
      type: String,
      required: [true, "model is required"],
    },
    equipmentDelivery0rReturn: {
      type: String,
      required: [true, "equipmentDelivery0rReturn is required"],
    },
    paymentPlan: {
      type: { daily: Number, weekly: Number, monthly: Number },
      required: true,
    },
    availableQuantity: {
      type: Number,
      required: [true, "available quantity plan is required"],
    },
    availableLocation: {
      type: String,
      required: [true, "available plan is required"],
    },
    image: String,
    creatorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "creator id is required"],
    },
  },
  {
    timestamps: true,
  }
);

toolSchema.pre<IToolDoc>(/^find/, function (next) {
  this.populate({
    path: "User",
  });
  next();
});

// add plugin that converts mongoose to json
toolSchema.plugin(toJSON);
toolSchema.plugin(paginate as any);

const Tool = mongoose.model<IToolDoc, IToolModel>("Tool", toolSchema);
export default Tool;
