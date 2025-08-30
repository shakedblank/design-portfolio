const fileInput = document.createElement("input");
fileInput.type = "file";
fileInput.accept = "image/*";

fileInput.addEventListener("change", async e => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = async function() {
    const base64 = reader.result.split(",")[1]; // remove data:image/...;base64,
    const filename = file.name; // e.g., u18medal.jpg

    // Call Netlify Function
    const res = await fetch("/.netlify/functions/uploadImage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        repo: "shakedblank/design-portfolio",
        branch: "main",
        filename,
        fileContentBase64: base64
      }),
    });

    const result = await res.json();
    if(result.success){
      project[imgKey] = result.url; // update JSON
      imgInput.value = result.url;
      imgPreview.src = result.url;
    } else {
      alert("Upload failed: " + result.error);
    }
  };
  reader.readAsDataURL(file);
});
