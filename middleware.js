const Campground = require("./models/campground");
const Review = require("./models/review");
const { joicampgroundSchema, joireviewSchema } = require("./schemaval");
const ExpressError = require("./utils/ExpressError");
module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    req.flash("error", "You must be signed in first!");
    return res.redirect("/login");
  }
  next();
};
module.exports.storeReturnTo = (req, res, next) => {
  if (req.session.returnTo) {
    res.locals.returnTo = req.session.returnTo;
  }
  next();
};
module.exports.validateCampground = (req, res, next) => {
  const { error } = joicampgroundSchema.validate(req.body);
  if (error) {
    let msg = error.details.map((el) => el.message).join(",");
    console.log(msg);
    if (msg.includes('/^[^`"\\$]+$/')) {
      msg =
        'Text cannot contain backtick(`) , backslash(\\) , double quotes(") or dollar($) symbol.';
    }
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};
module.exports.isAuthor = async (req, res, next) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  if (!campground.author.equals(req.user._id)) {
    req.flash("error", "You do not have permission to do that!");
    res.redirect(`/campgrounds/${id}`);
  }
  next();
};
module.exports.isReviewAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params;
  const review = await Review.findById(reviewId);
  if (!review.author.equals(req.user._id)) {
    req.flash("error", "You do not have permission to do that!");
    res.redirect(`/campgrounds/${id}`);
  }
  next();
};
module.exports.validateReview = (req, res, next) => {
  const { error } = joireviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};
