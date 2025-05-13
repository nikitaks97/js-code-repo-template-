// Import GitHub Actions core package for reading inputs and setting outputs or failure states
const core = require("@actions/core");

// Import the GitHub package to interact with GitHub's REST API (via Octokit)
const github = require("@actions/github");

// Define an asynchronous function so we can use `await` inside it
async function run() {
  try {
    // Read the "token" input defined in the GitHub Action YAML (usually a GitHub token or PAT)
    const token = core.getInput("token");

    // Read the "title" input — the title for the issue to be created
    const title = core.getInput("title");

    // Read the "body" input — the description or content of the issue
    const body = core.getInput("body");

    // Read the "assignees" input — optional, a list of GitHub usernames separated by newlines
    const assignees = core.getInput("assignees");

    // Initialize Octokit with the provided GitHub token
    const octokit = github.getOctokit(token);

    // Use Octokit to create a new issue in the current repository
    const response = await octokit.rest.issues.create({
      // Use owner and repo from the current GitHub context (e.g., `octocat/Hello-World`)
      ...github.context.repo,

      // Title of the issue (from input)
      title,

      // Body content of the issue (from input)
      body,

      // Convert newline-separated assignees into an array, or leave undefined if not set
      assignees: assignees ? assignees.split("\n") : undefined,
    });

    // Set the created issue data as an output variable (accessible in other steps)
    core.setOutput("issue", response.data);

  } catch (error) {
    // If any error occurs during the process, mark the Action as failed and show the error message
    core.setFailed(error.message);
  }
}

// Call the run function to execute the script
run();
