import Joi from 'joi';

export const incomeSchema = Joi.object({
  amount: Joi.number().required().min(1),
  date: Joi.date().required(),
  category: Joi.string().required().allow(''),
 
});
