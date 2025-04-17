const menuTitle = document.getElementById("menu-title");
const menu = document.getElementById("side-menu");

let isDragging = false;  // Flag to check if the menu is being dragged
let offsetX, offsetY;    // Offsets to keep track of mouse position relative to the menu

// When mouse is pressed down, start dragging
menuTitle.addEventListener("mousedown", (event) => {
    isDragging = true;
    offsetX = event.clientX - menu.offsetLeft;  // Calculate the initial offset
    offsetY = event.clientY - menu.offsetTop;
    
    // Prevent text selection while dragging
    event.preventDefault();
});

// During mouse movement, update menu position
document.addEventListener("mousemove", (event) => {
    if (isDragging) {
        menu.style.left = (event.clientX - offsetX) + "px";  // Move the menu based on mouse position
        menu.style.top = (event.clientY - offsetY) + "px";
    }
});

// When mouse button is released, stop dragging
document.addEventListener("mouseup", () => {
    isDragging = false;
});


const popupButton = document.querySelector("#menu-popup");
const sideMenu = document.querySelector("#side-menu");

let isMenuOpen = false;

popupButton.addEventListener("click", () => {
  isMenuOpen = !isMenuOpen;

  gsap.to(sideMenu, {
    top: isMenuOpen ? "50%" : "-20%",
    ease: isMenuOpen ? "bounce.out" : "power1.in"
  });
});
