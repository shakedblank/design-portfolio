let projects = [];

async function loadProjects() {
  const res = await fetch("ProjectsPage.json");
  const data = await res.json();
  projects = data.Projects || [];
  renderProjects();
}

function renderProjects() {
  const container = document.getElementById("projectsContainer");
  container.innerHTML = "";

  projects.forEach((proj, index) => {
    const div = document.createElement("div");
    div.classList.add("media-container");

    div.innerHTML = `
      <h3>Project ${proj.num} - <input type="text" value="${proj.innerTitle}" data-field="innerTitle" data-index="${index}"></h3>
      <label>Description: <input type="text" value="${proj.innerP || ''}" data-field="innerP" data-index="${index}"></label><br>
      <label>SecondaryP: <input type="text" value="${proj.seconderyP || ''}" data-field="seconderyP" data-index="${index}"></label><br>
      <label>Target Class: <input type="text" value="${proj.targetClass || ''}" data-field="targetClass" data-index="${index}"></label><br>
      <label>New Page: <input type="text" value="${proj.newPage || ''}" data-field="newPage" data-index="${index}"></label><br>
      <label>Thumbnail: <input type="text" value="${proj.src || ''}" data-field="src" data-index="${index}"></label>
      ${proj.src ? `<img src="${proj.src}" class="image-preview">` : ''}
      <div class="media-fields"></div>
      <button onclick="deleteProject(${index})">Delete Project</button>
    `;

    container.appendChild(div);

    const mediaContainer = div.querySelector(".media-fields");

    // Video field
    if (proj.video1) {
      const videoDiv = document.createElement("div");
      videoDiv.innerHTML = `
        <label>Video URL: <input type="text" value="${proj.video1}" data-field="video1" data-index="${index}"></label>
      `;
      mediaContainer.appendChild(videoDiv);
    }

    // Image fields
    const imageKeys = Object.keys(proj).filter(k => k.startsWith("image") || k.startsWith("smallImage"));
    imageKeys.forEach(key => {
      const imgRow = document.createElement("div");
      imgRow.classList.add("image-row");
      imgRow.innerHTML = `
        <input type="text" value="${proj[key]}" data-field="${key}" data-index="${index}">
        <img src="${proj[key]}" class="image-preview">
        <button type="button">Upload</button>
        <button type="button">Delete</button>
      `;
      mediaContainer.appendChild(imgRow);

      const input = imgRow.querySelector("input");
      const img = imgRow.querySelector("img");
      const uploadBtn = imgRow.querySelectorAll("button")[0];
      const deleteBtn = imgRow.querySelectorAll("button")[1];

      // Update JSON when input changes
      input.addEventListener("input", e => {
        const idx = e.target.dataset.index;
        const field = e.target.dataset.field;
        projects[idx][field] = e.target.value;
        img.src = e.target.value;
      });

      // Upload new image to GitHub
      uploadBtn.addEventListener("click", async () => {
        const fileInput = document.createElement("input");
        fileInput.type = "file";
        fileInput.accept = "image/*";
        fileInput.onchange = async e => {
          const file = e.target.files[0];
          const path = `assets/${file.name}`;
          const reader = new FileReader();
          reader.onload = async function() {
            const base64 = reader.result.split(",")[1];
            try {
              const res = await fetch("/.netlify/functions/uploadImage", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ repo: "shakedblank/design-portfolio", branch: "main", path, base64 })
              });
              const result = await res.json();
              if(result.success){
                input.value = path;
                projects[index][key] = path;
                img.src = path;
                alert("Image uploaded!");
              } else {
                alert("Error: " + result.error);
              }
            } catch(err) { alert(err.message); }
          };
          reader.readAsDataURL(file);
        };
        fileInput.click();
      });

      // Delete image from JSON
      deleteBtn.addEventListener("click", () => {
        if(confirm("Delete this image?")){
          input.value = "";
          projects[index][key] = "";
          img.src = "";
        }
      });
    });
  });

  // Text field change listener
  container.querySelectorAll("input[type=text]").forEach(input => {
    input.addEventListener("input", e => {
      const idx = e.target.dataset.index;
      const field = e.target.dataset.field;
      projects[idx][field] = e.target.value;
    });
  });
}

function addProject() {
  const newProj = {
    num: projects.length,
    innerTitle: "New Project",
    innerP: "",
    seconderyP: "",
    targetClass: "",
    newPage: "project.html",
    src: "",
  };
  projects.push(newProj);
  renderProjects();
}

function deleteProject(index) {
  if(confirm("Delete this project?")){
    projects.splice(index, 1);
    renderProjects();
  }
}

async function saveProjects() {
  try {
    const res = await fetch("/.netlify/functions/updateProjects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        repo: "shakedblank/design-portfolio",
        branch: "main",
        path: "ProjectsPage.json",
        newJson: { Projects: projects }
      })
    });
    const result = await res.json();
    if(result.success) alert("Projects saved! Commit: " + result.commit);
    else alert("Error: " + result.error);
  } catch(err){ alert(err.message); }
}

document.getElementById("addProjectBtn").addEventListener("click", addProject);
document.getElementById("saveBtn").addEventListener("click", saveProjects);

loadProjects();
