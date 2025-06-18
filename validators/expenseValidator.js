import Joi from 'joi';

export const expenseSchema = Joi.object({
  name:Joi.string().required(),
  amount: Joi.number().required().min(1),
  category: Joi.string().required(),
  date: Joi.date().required(),

});
