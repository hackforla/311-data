/**
 *
 * This script is run in Google Apps Script for handling form submissions from the contact
 * page Google Form.
 * It is not run in this codebase but we are storing a copy here for documentation.
 *
 * This script automates the process of creating GitHub issues upon form submission.
 * It includes the following key functions:
 *
 * Functions:
 * - onFormSubmit: Triggered when the form is submitted. Extracts form
 *   responses and creates a GitHub issue.
 * - setUpTrigger: Sets up the form submit trigger for the Google Form.
 *
 * Usage:
 * - Set up the trigger by running the setUpTrigger function.
 * - This script should be copied and stored in the web app codebase for
 *   reference and documentation purposes.
 *
 * GitHub Issue Creation:
 * - Constructs the title and body of the issue using form responses.
 * - Sends a POST request to the GitHub API to create the issue.
 *
 * Apps Script documenation on Form Service:
 * - https://developers.google.com/apps-script/reference/forms
 */

function onFormSubmit(e) {
  const formResponse = e.response; // Use the FormResponse object
  const itemResponses = formResponse.getItemResponses(); // Get all item responses

  // Extract responses from the form questions
  const fullName = itemResponses[0].getResponse(); // Full Name
  const email = itemResponses[1].getResponse(); // Email
  const neighborhoodAssociation = itemResponses[2].getResponse() || 'Not provided'; // Neighborhood Association
  const message = itemResponses[3].getResponse(); // Message

  // Construct title and body for GitHub issue
  const title = `Feedback from ${fullName} (${email})`;
  const body = `**Full Name:** ${fullName}\n**Email:** ${email}\n**Neighborhood Association:** ${neighborhoodAssociation}\n**Message:**\n${message}`;

  // GitHub API configuration
  const GITHUB_ORG = 'hackforla';
  const GITHUB_REPO = '311-data';
  const GITHUB_TOKEN = PropertiesService.getScriptProperties().getProperty('GITHUB_TOKEN');

  const url = `https://api.github.com/repos/${GITHUB_ORG}/${GITHUB_REPO}/issues`;
  const payload = {
    'title': title,
    'body': body
  };

  const options = {
    'method': 'post',
    'contentType': 'application/json',
    'headers': {
      'Authorization': `token ${GITHUB_TOKEN}`
    },
    'payload': JSON.stringify(payload)
  };

  // Sending the request to create the GitHub issue
  const response = UrlFetchApp.fetch(url, options);
  Logger.log(response.getContentText());
}

function setUpTrigger() {
  const form = FormApp.getActiveForm();
  ScriptApp.newTrigger('onFormSubmit')
           .forForm(form)
           .onFormSubmit()
           .create();
}

