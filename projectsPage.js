import {jsonFill} from "/projectAdd.js";

jsonFill("ProjectsPage.json").then(() => {
    // Now that projects are added, select the new elements
    const projectConteinerBox = document.querySelectorAll(".project-continer");
    const projectConteinerImg = document.querySelectorAll(".projectimg");

    projectConteinerBox.forEach((element, index) => {
        element.addEventListener("mouseenter", () => {
            gsap.to(projectConteinerBox[index], {x: 20,ease: "elastic" });
            gsap.to(projectConteinerImg[index], { scale: 1.1, x: -10 });
        });
        element.addEventListener("mouseleave", () => {
            gsap.to(projectConteinerBox[index], {x: 0,ease: "elastic", duration:1 });
            gsap.to(projectConteinerImg[index], { scale: 1, x: 0 });
        });
    });

    console.log("GSAP animations applied to new elements!");
});

function removeElement(element) {
    if (typeof(element) === "string") {
      element = document.querySelector(element);
    }
    return function() {
      element.parentNode.removeChild(element);
    };
  }
  
  const tl = new TimelineMax();
  
  tl.to("#loader", {y:'100%',delay:0.3})
        .call(removeElement("#loader"));
  