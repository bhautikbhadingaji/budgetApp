import Joi from 'joi';

/**

 * @param {Joi.Schema} schema 
 */
export const validate = (schema) => {
  return (req, res, next) => {
    const options = {
      abortEarly: false,
      allowUnknown: true,
      stripUnknown: true
    };

    const { error, value } = schema.validate(req.body, options);

    if (error) {
      const errorMessage = error.details[0].message; 
      return res.redirect(`/income/add-income?error=${encodeURIComponent(errorMessage)}`);
    }

    req.body = value;
    next();
  };
};

