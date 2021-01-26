const fetch = require("node-fetch");
const fs = require("fs");
const chalk = require("chalk");
const path = require("path");

const getPathsAndEndpoints = () =>
  new Promise(async (resolve, reject) => {
    await fetch("https://dev-api.311-data.org/openapi.json")
      .then((res) => res.json())
      .then((data) => {
        try {
          const oldPaths = require("./paths.json");
          var paths = { ...oldPaths, ...data.paths };
        } catch (err) {
          var { paths } = data;
        }

        fs.writeFile(
          path.join(__dirname, "./paths.json"),
          `${JSON.stringify(paths)}`,
          (err, file) => {
            if (!err) {
              console.log(chalk.green("Saved paths to ./paths.json"));
            } else {
              throw Error(
                console.log(chalk.red("Couldn't save paths to ./paths.json"))
              );
            }
          }
        );

        const endpoints = Object.keys(paths);

        fs.writeFile(
          path.join(__dirname, "./endpoints.js"),
          `module.exports = ${JSON.stringify(endpoints)}`,
          (err, file) => {
            if (!err) {
              console.log(chalk.green("Saved endpoints to ./endpoints.js"));
              resolve();
            } else {
              throw Error(
                chalk.red("Couldn't save endpoints ./endpoints.json")
              );
            }
          }
        );
      })
      .catch((err) =>
        reject(
          console.log(chalk.red(`Couldn't fetch api endpoints.\n ${err} `))
        )
      );
  });

module.exports = getPathsAndEndpoints;
