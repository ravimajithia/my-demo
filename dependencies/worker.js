const fs = require("fs");

const options = {
  force: true, // overwrite files
  recursive: true,
};

fs.cpSync("node_modules/@novorender/webgl-api", "build/novorender/webgl-api", options);
fs.cpSync("node_modules/@novorender/measure-api", "build/novorender/measure-api", options);