import Joi from 'joi';


export const createWorkReportSchema = Joi.object({
  hoursWorked: Joi.object({
    hours: Joi.number().required().min(1).max(50),      
    minutes: Joi.number().min(0).max(600),              
  }).required(),

  description: Joi.string().required().min(5).max(100),  
  date: Joi.date().required(),
});

export const updateWorkReportSchema = Joi.object({
  hoursWorked: Joi.object({
    hours: Joi.number().required().min(1).max(50),     
    minutes: Joi.number().min(0).max(600),              
  }).required(),

  description: Joi.string().required().min(5).max(100),  
  perHourCharge: Joi.number().min(0),
  date: Joi.date().required(),
});
