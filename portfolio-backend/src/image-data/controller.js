const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

function checkIfImageExists(req, res, next) {
  const fs = require("fs");
  const { imageName } = req.params;
  if (fs.existsSync("./src/images/" + imageName)) {
    next();
  } else {
    res.sendStatus(404);
  }
}

function readImage(req, res, next) {
  const { imageName } = req.params;
  res.sendFile(imageName, { root: "./src/images" });
}

module.exports = {
  readImage: [checkIfImageExists, readImage]
};
