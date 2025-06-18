import Joi from 'joi';

export const leaveSchema = Joi.object({
  fromDate: Joi.date().required(),
  toDate: Joi.date().required(),
  reason: Joi.string().required().min(4),
 type: Joi.string().valid('half', 'full').required()
});
