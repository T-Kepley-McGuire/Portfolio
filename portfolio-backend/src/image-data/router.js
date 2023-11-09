const router = require("express").Router();
const controller = require("./controller");
const methodNotAllowed = require("../errors/methodNotAllowed");

router.route("/:imageName").get(controller.readImage).all(methodNotAllowed);

module.exports = router;