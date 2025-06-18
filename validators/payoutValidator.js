import Joi from 'joi';

export const payoutSchema = Joi.object({
  amount: Joi.number().required().min(1),
  source: Joi.string().required(),
  date: Joi.date().required(),
  description: Joi.string().optional().allow(''),
});
