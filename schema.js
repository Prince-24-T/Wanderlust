const Joi = require('joi');
const Review = require('./models/reviews');

module.exports.listingSchema = Joi.object({

    listing: Joi.object({
        title:  Joi.string().required(),
        discription: Joi.string().required(),
        county:Joi.string().required(),
        price: Joi.number().required().min(0),
        location: Joi.string().required(),
        image: Joi.string().allow("" , null)
    }).required()

})
module.exports.reviewSchema =  Joi.object({
    review:Joi.object({

        rating: Joi.number().required(),
        comment: Joi.string().required(),

}).required(),
});