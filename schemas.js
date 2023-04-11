const Joi = require('joi');

module.exports.ratingSchema = joi.object({
    rating: joi.object({
        rating: joi.number().required(),
        comment: joi.string().required()
    }).required()
})