let projects = [];

async function loadProjects() {
  const res = await fetch("ProjectsPage.json");
  projects = await res.json();
  renderTable();
}

function renderTable() {
  const tbody = document.querySelector("#projectsTable tbody");
  tbody.innerHTML = "";

  projects.forEach((proj, index) => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td><input type="number" value="${proj.num}" data-index="${index}" data-field="num"></td>
      <td><input type="text" value="${proj.innerTitle}" data-index="${index}" data-field="innerTitle"></td>
      <td><input type="text" value="${proj.innerP}" data-index="${index}" data-field="innerP"></td>
      <td><input type="text" value="${proj.src}" data-index="${index}" data-field="src"></td>
      <td><input type="text" value="${proj.newPage}" data-index="${index}" data-field="newPage"></td>
      <td>
        <button onclick="deleteProject(${index})">Delete</button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  // Listen to input changes
  document.querySelectorAll("input").forEach(input => {
    input.addEventListener("input", e => {
      const idx = e.target.dataset.index;
      const field = e.target.dataset.field;
      projects[idx][field] = e.target.value;
    });
  });
}

function addProject() {
  const newProj = {
    num: projects.length + 1,
    innerTitle: "New Project",
    innerP: "Description",
    src: "assets/default.jpg",
    newPage: "project.html",
    targetClass: ""
  };
  projects.push(newProj);
  renderTable();
}

function deleteProject(index) {
  if (confirm("Are you sure you want to delete this project?")) {
    projects.splice(index, 1);
    renderTable();
  }
}

async function saveProjects() {
  const response = await fetch("/.netlify/functions/updateProjects", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      repo: "shakedblank/design-portfolio",
      branch: "main",
      path: "ProjectsPage.json",
      newJson: projects
    }),
  });

  const result = await response.json();
  if (result.success) {
    alert("Projects saved! Commit: " + result.commit);
  } else {
    alert("Error: " + result.error);
  }
}

document.getElementById("addProjectBtn").addEventListener("click", addProject);
document.getElementById("saveBtn").addEventListener("click", saveProjects);

loadProjects();
