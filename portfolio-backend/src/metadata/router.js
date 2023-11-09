const router = require("express").Router();

const methodNotAllowed = require("../errors/methodNotAllowed");

router.route("/").all((req, res) => res.json({ data: "this is the metadata" }));

module.exports = router;