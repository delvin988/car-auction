const authorizationAdmin = (req, res, next) => {
  try {
    if (req.user.role !== "Admin") throw { name: "forbidden" };
    next();
  } catch (error) {
    next(error);
  }
};

const authorizationAdminOrBidder = (req, res, next) => {
  try {
    if (req.user.role !== "Bidder") throw { name: "forbiddenforadmin" };
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = { authorizationAdmin, authorizationAdminOrBidder };
