const github = require('@actions/github');
const core = require('@actions/core');
const { readFileSync } = require('fs');

async function run() {
  try {
    const token = process.env.GITHUB_TOKEN || core.getInput('token', { required: true });
    //TODO we should not only check the content of the readme but also the content of the website listing from https://github.com/asyncapi/website/blob/master/content/docs/tooling.md
    const templatesListContent = getReadmeContent();
    const officialTemplates = await searchOfficialTemplates(token);

    const missingTemplates = officialTemplates.filter(str => !templatesListContent.includes(str));

    if (missingTemplates) core.setFailed(
        `The following templates are not in the README.md: ${missingTemplates}. Make sure missing templates are added to the list in the README of this repository and also to the website to the list of offecial tools: https://github.com/asyncapi/website/blob/master/content/docs/tooling.md`
    );

  } catch (error) {
    core.setFailed(error.message);
  }
}

/**
   * Gets the markdown table from the readme of the Generator
   *
   * @private
   * @return {String}
   */
function getReadmeContent() {
  const readmeContent = readFileSync('../../README.md', 'utf8');
  const startingTag = '<!-- TEMPLATES-LIST:';
  const closingTag = '-->';
  const startOfOpeningTagIndex = readmeContent.indexOf(`${startingTag}START`);
  const endOfOpeningTagIndex = readmeContent.indexOf(closingTag, startOfOpeningTagIndex);
  const endOfClosingTagIndex = readmeContent.indexOf(`${startingTag}END ${closingTag}`);

  if (endOfOpeningTagIndex === -1 || endOfClosingTagIndex === -1) {
    core.setFailed();
    throw new Error(
        `Templates list is missing or someone removed markers that indicate the list. Table with list of templates that is in the README should be wrapped in markers like <!-- TEMPLATES-LIST:START --> and <!-- TEMPLATES-LIST:END -->`
    );
  }

  return readmeContent.slice(endOfOpeningTagIndex + closingTag.length, endOfClosingTagIndex);
}

/**
   * Gets array with list of names of all the official templates
   *
   * @private
   * @param {String} Token to authorize with GitHub
   * @return {Array[String]}
   */
async function searchOfficialTemplates(token) {
  const client = new github.GitHub(token);
  const searchQuery = `
    query { 
        search(query: "topic:asyncapi topic:generator topic:template user:asyncapi", type: REPOSITORY, first:100) {   
          repositoryCount
          nodes {
            ... on Repository {
              name
            }
          }
        }
      }
    `;

  const searchResult = await client.graphql(searchQuery);
  return searchResult.search.nodes.map(obj => obj.name);
}

run();
