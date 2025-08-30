let projects = { Projects: [] };

// Load projects from JSON
async function loadProjects() {
  const res = await fetch("ProjectsPage.json");
  projects = await res.json();
  renderTable();
}

function renderTable() {
  const container = document.getElementById("projectsContainer");
  container.innerHTML = "";
  
  projects.Projects.forEach((project, index) => {
    const div = document.createElement("div");
    div.style.border = "1px solid #ccc";
    div.style.padding = "10px";
    div.style.margin = "10px 0";

    // Basic info
    div.innerHTML = `
      <strong>Project #${index} - Num: ${project.num}</strong><br>
      Title: <input type="text" value="${project.innerTitle || ''}" data-key="innerTitle"><br>
      Description: <input type="text" value="${project.innerP || ''}" data-key="innerP"><br>
      New Page: <input type="text" value="${project.newPage || ''}" data-key="newPage"><br>
    `;

    // Video or Images
    if (project.video1 !== undefined) {
      const videoInput = document.createElement("input");
      videoInput.type = "text";
      videoInput.value = project.video1;
      videoInput.placeholder = "Video URL";
      videoInput.addEventListener("input", e => project.video1 = e.target.value);
      div.appendChild(document.createTextNode("Video URL: "));
      div.appendChild(videoInput);
    } else {
      // image fields
      const images = ["src","image1","image2","smallImage1","smallImage2","smallImage3","smallImage4"];
      images.forEach(imgKey => {
        const imgContainer = document.createElement("div");
        const imgInput = document.createElement("input");
        imgInput.type = "text";
        imgInput.value = project[imgKey] || "";
        imgInput.placeholder = imgKey;
        imgInput.addEventListener("input", e => project[imgKey] = e.target.value);

        const imgPreview = document.createElement("img");
        imgPreview.src = project[imgKey] || "";
        imgPreview.alt = imgKey;

        imgInput.addEventListener("input", e => {
          imgPreview.src = e.target.value;
        });

        const delBtn = document.createElement("button");
        delBtn.textContent = "Delete";
        delBtn.onclick = () => { project[imgKey] = ""; imgInput.value = ""; imgPreview.src = ""; };

        imgContainer.appendChild(imgInput);
        imgContainer.appendChild(delBtn);
        imgContainer.appendChild(imgPreview);
        div.appendChild(imgContainer);
      });
    }

    // Delete project
    const delProjectBtn = document.createElement("button");
    delProjectBtn.textContent = "Delete Project";
    delProjectBtn.onclick = () => {
      projects.Projects.splice(index,1);
      renderTable();
    };
    div.appendChild(delProjectBtn);

    container.appendChild(div);
  });
}

// Add new project
document.getElementById("addProjectBtn").addEventListener("click", () => {
  const isVideo = confirm("Is this a video project? Click OK for Yes, Cancel for No.");
  const nextNum = projects.Projects.length ? Math.max(...projects.Projects.map(p=>p.num)) + 1 : 0;

  let newProject;
  if (isVideo) {
    newProject = { num: nextNum, src: "", innerTitle: "", innerP: "", newPage: "project.html", targetClass: "projects-section", video1: "" };
  } else {
    newProject = { 
      num: nextNum, src: "", innerTitle: "", innerP: "", newPage: "project.html", targetClass: "projects-section",
      image1:"", image2:"", smallImage1:"", smallImage2:"", smallImage3:"", smallImage4:""
    };
  }

  projects.Projects.push(newProject);
  renderTable();
});

// Save to GitHub
document.getElementById("saveBtn").addEventListener("click", async () => {
  try {
    const res = await fetch("/.netlify/functions/updateProjects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        repo: "shakedblank/design-portfolio",
        branch: "main",
        path: "ProjectsPage.json",
        newJson: projects
      }),
    });
    const result = await res.json();
    console.log(result);
    if(result.success) alert("Projects saved successfully! Commit: "+result.commit);
    else alert("Error: "+result.error);
  } catch(err) {
    console.error(err);
    alert("Save failed: "+err.message);
  }
});

loadProjects();
