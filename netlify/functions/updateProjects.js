const fetch = require("node-fetch");

exports.handler = async function(event) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  try {
    const { repo, branch, path, newJson } = JSON.parse(event.body);

    const token = process.env.GITHUB_TOKEN;
    if (!token) throw new Error("GITHUB_TOKEN not set in Netlify environment variables");

    // Step 1: Check if file exists to get SHA
    let sha;
    const fileRes = await fetch(`https://api.github.com/repos/${repo}/contents/${path}?ref=${branch}`, {
      headers: {
        Authorization: `token ${token}`,
        Accept: "application/vnd.github.v3+json",
      },
    });

    if (fileRes.ok) {
      const fileData = await fileRes.json();
      sha = fileData.sha; // Use SHA if file exists
    }

    // Step 2: Encode new JSON content
    const updatedContent = Buffer.from(JSON.stringify(newJson, null, 2), "utf8").toString("base64");

    // Step 3: Commit to GitHub
    const updateRes = await fetch(`https://api.github.com/repos/${repo}/contents/${path}`, {
      method: "PUT",
      headers: {
        Authorization: `token ${token}`,
        Accept: "application/vnd.github.v3+json",
      },
      body: JSON.stringify({
        message: `Update ${path} via admin panel`,
        content: updatedContent,
        sha: sha, // undefined if file doesn't exist → GitHub creates it
        branch: branch,
      }),
    });

    const updateData = await updateRes.json();
    if (!updateRes.ok) throw new Error(updateData.message);

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, commit: updateData.commit.sha }),
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
