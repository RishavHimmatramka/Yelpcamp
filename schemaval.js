const Basejoi = require("joi");
const sanitizeHTML = require("sanitize-html");
const extension = (joi) => ({
  type: "string",
  base: joi.string(),
  messages: {
    "string.escapeHTML": "{{#label}} must not include HTML!",
  },
  rules: {
    escapeHTML: {
      validate(value, helpers) {
        const clean = sanitizeHTML(value, {
          allowedTags: [],
          allowedAttributes: {},
        });
        if (clean !== value)
          return helpers.error("string.escapeHTML", { value });
        return clean;
      },
    },
  },
});
const joi = Basejoi.extend(extension);

const joicampgroundSchema = joi.object({
  campground: joi
    .object({
      title: joi
        .string()
        .required()
        .pattern(/^[^`"\$]+$/)
        .escapeHTML(),
      price: joi.number().required().min(0),
      // image: joi.string().required(),
      description: joi
        .string()
        .required()
        .pattern(/^[^`"\$]+$/)
        .escapeHTML(),
      location: joi
        .string()
        .required()
        .pattern(/^[^`"\$]+$/)
        .escapeHTML(),
    })
    .required(),
  deleteImages: joi.array(),
});
module.exports.joicampgroundSchema = joicampgroundSchema;
const joireviewSchema = joi.object({
  review: joi
    .object({
      rating: joi.number().required().min(1).max(5),
      body: joi.string().required(),
    })
    .required(),
});
module.exports.joireviewSchema = joireviewSchema;
