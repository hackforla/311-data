const getPathsAndEndpoints = require("./getPathsAndEndpoints.js");
const getExamplesResponses = require("./getExampleResponses.js");
const generateHandlers = require("./generateHandlers.js");
const chalk = require("chalk");

(async () => {
  console.log(chalk.yellow("Fetching endpoints"));
  await getPathsAndEndpoints().catch((err) =>
    console.log("getPathsAndEndpoints=>" + err)
  );
  console.log(
    chalk.yellow("Fetching example responses. It might take a minute")
  );
  await getExamplesResponses().catch((err) =>
    console.log("getExamplesResponses=>" + err)
  );
  console.log(chalk.yellow("Generating api mock handlers."));
  await generateHandlers().catch((err) =>
    console.log("generateHandlers=>" + err)
  );
  console.log(chalk.yellow("Finished updating responses."));
})();
