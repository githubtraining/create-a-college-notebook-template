const github = require("@actions/github");
const core = require("@actions/core");

async function run() {
  try {
    const mytoken = core.getInput("repo-token");
    const octokit = new github.GitHub(mytoken);
    const context = github.context;
    const today = new Date();
    const date =
      today.getFullYear() +
      "-" +
      (today.getMonth() + 1) +
      "-" +
      today.getDate();

    const newBranch = await octokit.git.createRef({
      owner: context.repo.owner,
      repo: context.repo.repo,
      ref: "refs/heads/CompSci-" + date,
      sha: process.env.GITHUB_SHA
    });

    const createFile = await octokit.repos.createOrUpdateFile({
      owner: context.repo.owner,
      repo: context.repo.repo,
      path: "notes/" + date + ".md",
      message: "file for " + date + " created",
      branch: newBranch.data.ref,
      content: Buffer.from("# My Course Notes").toString("base64")
    });

    const newPull = await octokit.pulls.create({
      owner: context.repo.owner,
      repo: context.repo.repo,
      title: "Comp-Sci 101 " + date,
      body: "Merge me to save your notes",
      base: "master",
      head: newBranch.data.ref
    });
  } catch (error) {
    console.error(error);
    core.setFailed(error.message);
  }
}

run();
