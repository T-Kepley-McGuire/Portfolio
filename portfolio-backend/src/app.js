const path = require("path");

require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const express = require("express");
const cors = require("cors");

const errorHandler = require("./errors/errorHandler");
const notFound = require("./errors/notFound");

const router = require("./server-data/router");
const imageRouter = require("./image-data/router")
const metaDataRouter = require("./metadata/router");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/public", (req, res, next) => {
    console.log(path.join(__dirname, "public"));
    return next();
})
app.use("/public", express.static(path.join(__dirname, "public")));

app.use("/metadata", metaDataRouter);
app.use("/images", imageRouter);
app.use("/", router);

app.use(notFound);
app.use(errorHandler);

module.exports = app;