exports.handler = async function(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: JSON.stringify({ error: "Method not allowed" }) };
  }

  try {
    const { repo, branch, path, newJson } = JSON.parse(event.body);

    const token = process.env.GITHUB_TOKEN;
    if (!token) throw new Error("GITHUB_TOKEN is missing");

    // Step 1: Check if file exists
    let sha;
    const fileRes = await fetch(`https://api.github.com/repos/${repo}/contents/${path}?ref=${branch}`, {
      headers: { Authorization: `token ${token}`, Accept: "application/vnd.github.v3+json" },
    });

    if (fileRes.ok) {
      const fileData = await fileRes.json();
      sha = fileData.sha;
    }

    // Step 2: Encode JSON
    const content = Buffer.from(JSON.stringify(newJson, null, 2), "utf8").toString("base64");

    // Step 3: Commit to GitHub
    const updateRes = await fetch(`https://api.github.com/repos/${repo}/contents/${path}`, {
      method: "PUT",
      headers: { Authorization: `token ${token}`, Accept: "application/vnd.github.v3+json" },
      body: JSON.stringify({
        message: `Update ${path} via admin panel`,
        content,
        sha: sha, // only if file exists
        branch,
      }),
    });

    const updateData = await updateRes.json();

    if (!updateRes.ok) {
      console.error("GitHub API error:", updateData);
      throw new Error(updateData.message || "GitHub update failed");
    }

    return { statusCode: 200, body: JSON.stringify({ success: true, commit: updateData.commit.sha }) };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
