const express = require("express");
const router = express.Router();
const AuthRouter = require("./AuthRouter");
const ItemRouter = require("./ItemRouter");
const authentication = require("../middlewares/authentication");
const PublicRouter = require("./PublicRouter");

//setiap endpoint berbeda nnti buat file router masing-masing

router.use(AuthRouter);
router.use("/pub", PublicRouter);
router.use(authentication);
//apapun dibawah ini kena authentication
router.use("/items", ItemRouter);

module.exports = router;
