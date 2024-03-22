const errorHandler = (err, req, res, next) => {
   switch (err.name) {
      case "InvalidToken":
      case "JsonWebTokenError":
         res.status(401).json({ message: "Invalid Token." });
         break;
      case "SequelizeValidationError":
      case "SequelizeUniqueConstraintError":
         res.status(400).json({ message: err.errors[0].message });
         break;
      case "EmailRequired":
         res.status(400).json({ message: "Email is required." });
         break;
      case "forbidden":
         res.status(403).json({ message: "Only admin can do this." });
         break;
      case "forbiddenforadmin":
         res.status(403).json({ message: "Only Bidder can do this." });
         break;
      case "PasswordRequired":
         res.status(400).json({ message: "Password is required." });
         break;
      case "InvalidUser":
         res.status(401).json({ message: "Invalid email/password." });
         break;
      case "InvalidToken":
         res.status(401).json({ message: "Invalid Token." });
         break;
      case "itemDuplicate":
         res.status(401).json({ message: "Item already added." });
         break;
      case "bidNotAvailable":
         res.status(404).json({ message: "No offers were found for this user." });
         break;
      case "highestBidNotAvailable":
         res.status(404).json({ message: "No bids were found for this product." });
         break;
      case "NotFound":
         res.status(404).json({ message: "Item not found." });
         break;
      case "ErrorNotFound":
         res.status(404).json({ message: "Item not Discovered." });
         break;
      default:
         console.log(err);
         res.status(500).json({ message: "Internal Server Error." });
         break;
   }
};

module.exports = errorHandler;
