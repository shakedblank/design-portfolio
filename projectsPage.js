import {jsonFill} from "/projectAdd.js";

jsonFill("ProjectsPage.json").then(() => {
    // Now that projects are added, select the new elements
    const projectConteinerBox = document.querySelectorAll(".project-continer");
    const projectConteinerImg = document.querySelectorAll(".projectimg");

    projectConteinerBox.forEach((element, index) => {
        element.addEventListener("mouseenter", () => {
            gsap.to(projectConteinerImg[index], { scale: 1.1, x: -10 });
        });
        element.addEventListener("mouseleave", () => {
            gsap.to(projectConteinerImg[index], { scale: 1, x: 0 });
        });
    });

    console.log("GSAP animations applied to new elements!");
});