const router = require("express").Router();
const controller = require("./controller");
const methodNotAllowed = require("../errors/methodNotAllowed");

router.route("/about").get(controller.readAbout).all(methodNotAllowed);
router.route("/projects").get(controller.readProjects).all(methodNotAllowed);
router.route("/blog").get(controller.readBlog).all(methodNotAllowed);

module.exports = router;