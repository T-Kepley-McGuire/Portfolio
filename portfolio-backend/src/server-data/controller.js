const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

function readAndSend(path, res) {
  const fs = require("fs");
  fs.readFile(path, (error, data) => {
    if (error) throw error;

    res.json({ data: data.toString() });
  });
}

function readFolder(path) {
  const fs = require("fs").promises;

  return fs.readdir(path).then((fileNames) => {
    const filePaths = fileNames.map((fileName) => path + fileName);

    const filePromises = filePaths.map(async (filePath) => {
      try {
        const data = await fs.readFile(filePath);
        return data.toString();
      } catch (error) {
        throw error;
      }
    });

    return Promise.all(filePromises);
  });
}

function readAbout(req, res, next) {
  readAndSend("src/articles/about.md", res);
}

function readProjects(req, res, next) {
  readFolder("src/articles/projects/").then((files) => {
    res.json({ data: files });
  });
}

module.exports = {
  readAbout,
  readProjects,
};
