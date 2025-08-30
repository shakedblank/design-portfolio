import fetch from "node-fetch";

export async function handler(event) {
  if(event.httpMethod !== "POST"){
    return { statusCode: 405, body: JSON.stringify({ error: "Method not allowed" }) };
  }

  try {
    const { repo, branch, path, base64 } = JSON.parse(event.body);
    const token = process.env.GITHUB_TOKEN;

    const fileRes = await fetch(`https://api.github.com/repos/${repo}/contents/${path}?ref=${branch}`, {
      headers: { Authorization: `token ${token}`, Accept: "application/vnd.github.v3+json" }
    });
    const fileData = await fileRes.json();
    const sha = fileData.sha;

    const res = await fetch(`https://api.github.com/repos/${repo}/contents/${path}`, {
      method: "PUT",
      headers: { Authorization: `token ${token}`, Accept: "application/vnd.github.v3+json" },
      body: JSON.stringify({
        message: `Upload image ${path}`,
        content: base64,
        sha,
        branch
      })
    });

    const result = await res.json();
    if(res.ok) return { statusCode: 200, body: JSON.stringify({ success: true, path }) };
    else return { statusCode: 500, body: JSON.stringify({ error: result.message }) };

  } catch(err){
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
}
