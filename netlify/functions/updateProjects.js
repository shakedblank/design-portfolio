// /netlify/functions/updateProjects.js
import fetch from "node-fetch";

export async function handler(event, context) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  try {
    const { repo, branch, path, newJson } = JSON.parse(event.body);

    // get token from environment (never expose in frontend!)
    const token = process.env.GITHUB_TOKEN;

    // Step 1: Get current file info (we need the SHA)
    const fileRes = await fetch(
      `https://api.github.com/repos/${repo}/contents/${path}?ref=${branch}`,
      {
        headers: {
          Authorization: `token ${token}`,
          Accept: "application/vnd.github.v3+json",
        },
      }
    );

    const fileData = await fileRes.json();
    if (!fileRes.ok) throw new Error(fileData.message);

    // Step 2: Encode new content in Base64
    const updatedContent = Buffer.from(
      JSON.stringify(newJson, null, 2),
      "utf8"
    ).toString("base64");

    // Step 3: Commit the update
    const updateRes = await fetch(
      `https://api.github.com/repos/${repo}/contents/${path}`,
      {
        method: "PUT",
        headers: {
          Authorization: `token ${token}`,
          Accept: "application/vnd.github.v3+json",
        },
        body: JSON.stringify({
          message: "Update ProjectsPage.json via Netlify Function",
          content: updatedContent,
          sha: fileData.sha,
          branch: branch,
        }),
      }
    );

    const updateData = await updateRes.json();
    if (!updateRes.ok) throw new Error(updateData.message);

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, commit: updateData.commit.sha }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
}
