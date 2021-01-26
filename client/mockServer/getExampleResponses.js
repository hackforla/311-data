const chalk = require("chalk");
const fetch = require("node-fetch");
const fs = require("fs");
const path = require("path");
const formatEndpoint = require("./formatEndpoint.js");

const getExamplesForEachEnpoint = () =>
  new Promise(async (resolve, reject) => {
    try {
      var endpoints = require("./endpoints.js");
      var paths = require("./paths.json");
    } catch (err) {
      return reject("Check enpoints.json. It shouldn;t be empty.\n err");
    }

    try {
      var responses = require("./responses.json");
    } catch (err) {
      var responses = {};
    }

    await Promise.all(
      endpoints.map(async (endpoint) => {
        try {
          var [method] = Object.keys(paths[endpoint]);
        } catch (err) {
          throw Error(err);
        }
        if (endpoint !== formatEndpoint(endpoint)) {
          return null;
        }
        return fetch(`https://dev-api.311-data.org${endpoint}`, {
          method: method.toUpperCase(),
        })
          .then((res) => {
            try {
              return res.json();
            } catch (err) {
              console.log(chalk.red(res.text()));
            }
          })
          .then((res) => (responses[`${endpoint}`] = res))
          .catch((err) =>
            console.log(
              chalk.red(`Couldn't fetch response for ${endpoint}. \n ${err}`)
            )
          );
      })
    )
      .then(() => {
        fs.writeFile(
          path.join(__dirname, "./responses.json"),
          `${JSON.stringify(responses)}`,
          (err, file) => {
            if (!err) {
              resolve(
                console.log(chalk.green("Saved responses to ./responses.json"))
              );
            } else {
              console.log(
                chalk.red(
                  `Couldn't save responses to ./responses.json. \n ${err}`
                )
              );
            }
          }
        );
      })
      .catch((err) =>
        reject(
          console.log(
            chalk.red(`Couldn't save responses to ./responses.json. \n ${err}`)
          )
        )
      );
  });

module.exports = getExamplesForEachEnpoint;
