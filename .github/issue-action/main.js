const github = require("@actions/github");
const core = require("@actions/core");

async function run() {
  try {
    const mytoken = core.getInput("repo-token");
    const octokit = github.GitHub(mytoken);
    const context = github.context;

    const newIssue = await octokit.issues.create({
      owner: context.repo.owner,
      repo: context.repo.repo,
      title: "Comp-Sci 101 " + new Date(),
      body: "# My Course Notes"
    });
  } catch (error) {
    core.debug(error.message);
  }
}

run();
