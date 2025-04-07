import {projectBox} from "/projectAdd.js";

const projectConteinerBox = document.querySelectorAll(".project-continer");
const projectConteinerImg = document.querySelectorAll(".projectimg");

projectConteinerBox.forEach((element,index)=>{
    
    element.addEventListener("mouseenter", () => {
        gsap.to(projectConteinerImg[index], {scale:1.1,y:-10});
    });
    element.addEventListener("mouseleave", () => {
        gsap.to(projectConteinerImg[index], {scale:1,y:0});
    });

})



const wordSeperator = document.getElementById("word-seperator");
const skills= ["photoshop","illustrator","after\u00A0effects","indesign","css","html","javascript","unity","premier",
];
for(let i=0; i<2;i++){
    const wordGroup = document.createElement("div");
    wordGroup.className= "word-Group"
    wordSeperator.appendChild(wordGroup);

    function addWord(word){
        const wordFromList =  document.createElement("span");
        wordFromList.innerText= word;
        wordGroup.appendChild(wordFromList);
    }
    skills.forEach(addWord);
}
let titleTime=0.2;
let tl = gsap.timeline();
gsap.from(".h1-type", {x:150,ease: "elastic",duration: 1.4})
tl.from(".Sl", {y:150,ease: "back.out(1.7)",duration: titleTime})
.from(".Hl", {y:150,ease: "back.out(1.8)",duration: titleTime})
.from(".Al", {y:150,ease: "back.out(1.9)",duration: titleTime})
.from(".Kl", {y:150,ease: "back.out(2)",duration: titleTime})
.from(".El", {y:150,ease: "back.out(2.1)",duration: titleTime})
.from(".Dl", {y:150,ease: "back.out(2.5)",duration: titleTime})
.to("#text-emphasis-main", {rotate:-7,ease: "bounce.out",duration: titleTime+0.2});

const shaked= document.querySelector("#text-emphasis-main");

shaked.addEventListener("mouseenter", () => {
    gsap.to("#text-emphasis-main", {rotate:7,ease: "bounce.out"});
});
shaked.addEventListener("mouseleave", () => {
    gsap.to("#text-emphasis-main", {rotate:-7,ease: "bounce.out"});
});




fetch('ProjectsPage.json')
  .then(response => response.json())
  .then(data => {
    const projects = data.Projects;
    for (let i = 0; i < 3 && i < projects.length; i++) {
      const project = projects[i];
      projectBox(
        project.num,
        project.src,
        project.innerTitle,
        project.innerP,
        project.newPage,
        project.targetClass
      );
    }
  }).then(() => {
    // Now that projects are added, select the new elements
    const projectConteinerBox = document.querySelectorAll(".project-continer");
    const projectConteinerImg = document.querySelectorAll(".projectimg");

    projectConteinerBox.forEach((element, index) => {
        element.addEventListener("mouseenter", () => {
            gsap.to(projectConteinerImg[index], { scale: 1.1, y: -10 });
        });
        element.addEventListener("mouseleave", () => {
            gsap.to(projectConteinerImg[index], { scale: 1, y: 0 });
        });
    });

    console.log("GSAP animations applied to new elements!");
});