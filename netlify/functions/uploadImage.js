exports.handler = async function(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: JSON.stringify({ error: "Method not allowed" }) };
  }

  try {
    const token = process.env.GITHUB_TOKEN;
    if (!token) throw new Error("GITHUB_TOKEN missing");

    const { repo, branch, filename, fileContentBase64 } = JSON.parse(event.body);

    const path = `assets/${filename}`;

    const res = await fetch(`https://api.github.com/repos/${repo}/contents/${path}`, {
      method: "PUT",
      headers: { Authorization: `token ${token}`, Accept: "application/vnd.github.v3+json" },
      body: JSON.stringify({
        message: `Upload ${filename} via admin panel`,
        content: fileContentBase64,
        branch,
      }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message);

    return { statusCode: 200, body: JSON.stringify({ success: true, url: `assets/${filename}` }) };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
