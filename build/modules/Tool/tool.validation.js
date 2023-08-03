"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNewTool = void 0;
const Joi = require("joi");
const newToolBody = {
    title: Joi.string().required(),
    creatorId: Joi.string().required(),
    description: Joi.string().required(),
    category: Joi.string().required(),
    make: Joi.string().required(),
    model: Joi.string().required(),
    paymentPlan: Joi.array().items(Joi.object({
        daily: Joi.number(),
        weekly: Joi.number(),
        monthly: Joi.number(),
    }).min(1) // At least one of the properties should be present in each object
    ),
    availableLocation: Joi.string().required(),
    availableQuantity: Joi.number().required(),
    equipmentDelivery0rReturn: Joi.string().required(),
    image: Joi.alternatives()
        .try(Joi.string(), Joi.binary().encoding("base64"))
        .optional(),
};
exports.createNewTool = {
    body: Joi.object().keys(newToolBody),
};
