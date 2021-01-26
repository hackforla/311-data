const chalk = require("chalk");
const fs = require("fs");
const path = require("path");
const formatEndpoint = require("./formatEndpoint.js");

const generatehandlers = () =>
  new Promise((resolve, reject) => {
    try {
      var endpoints = require("./endpoints.js");
      var paths = require("./paths.json");
    } catch (err) {
      return reject(
        new Error(
          chalk.red("Check ./endpoints.json file. it shouldn't be empty.")
        )
      );
    }
    fs.writeFile(
      path.join(__dirname, "./handlers.js"),
      `
      import { rest } from "msw";
      import responses from "./responses.json";
      
      export default 
      ${endpoints.map((endpoint, index) => {
        return `${index === 0 ? "[" : ""}rest.${
          Object.keys(paths[endpoint])[0]
        }("${formatEndpoint(endpoint)}", (req, res, ctx) => {
              return res(ctx.status(200), ctx.json(responses["${endpoint}"]));
            })${index === endpoints.length - 1 ? "]" : ""}`;
      })}
     
  ;`,
      (err, file) => {
        if (!err) {
          resolve(
            console.log(chalk.green("Generated handlers in the ./handlers.js"))
          );
        } else {
          reject(
            console.log(
              chalk.red(
                `Couldn't generate handlers in the ./handlers.js. \n${err}`
              )
            )
          );
        }
      }
    );
  });

module.exports = generatehandlers;
