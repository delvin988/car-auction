const express = require("express");
const ItemController = require("../controllers/ItemController");
const { authorizationAdmin } = require("../middlewares/authorization");
const router = express.Router();

router.post("/", authorizationAdmin, ItemController.createItem);
router.get("/", authorizationAdmin, ItemController.getAllItem);
router.get("/:id", authorizationAdmin, ItemController.getItemById);
router.put("/:id", authorizationAdmin, ItemController.updateById);
router.delete("/:id", authorizationAdmin, ItemController.deleteById);

module.exports = router;
