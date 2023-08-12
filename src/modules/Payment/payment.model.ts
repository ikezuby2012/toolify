import mongoose, { Schema } from "mongoose";

import toJSON from "../toJSON/toJSON";
import paginate from "../paginate/paginate";
import { IPaymentDoc, IPaymentModel } from "./payment.interface";

const paymentSchema = new mongoose.Schema<IPaymentDoc, IPaymentModel>(
  {
    deliveryOption: {
      type: String,
      required: [true, "delvery option is required"],
    },
    returnOption: {
      type: String,
      required: [true, "return option is required"],
    },
    paymentOption: {
      type: String,
      enum: ["visa", "mastercard", "cash"],
    },
    cardHolderName: String,
    cardNumber: String,
    expiry: String,
    cvv: String,
    location: String,
    country: String,
    startDate: {
      type: String,
      required: [true, "start date is required"],
    },
    endDate: {
      type: String,
      required: [true, "end date is required"],
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "creator id is required"],
    },
  },
  {
    timestamps: true,
  }
);

paymentSchema.pre<IPaymentDoc>(/^find/, function (next) {
  this.populate({
    path: "userId",
  });
  next();
});

// add plugin that converts mongoose to json
paymentSchema.plugin(toJSON);
paymentSchema.plugin(paginate as any);

const Payment = mongoose.model<IPaymentDoc, IPaymentModel>(
  "Payment",
  paymentSchema
);
export default Payment;
