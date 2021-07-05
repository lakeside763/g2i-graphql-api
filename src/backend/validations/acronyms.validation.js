const joi = require('joi');

exports.acronymValidation = joi.object({
  acronym: joi.string().required(),
  meaning: joi.string().required(),
});
