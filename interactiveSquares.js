// === CONFIGURATION ===
const SECTION_ID = 'about-small'; // Change this to your section's ID
const IMAGE_URL = 'assets/faces.jpg'; // Change this to your image URL
const SQUARE_SIZE = 30; // Change this to adjust square size

// === MAIN SCRIPT ===
(function() {
    const section = document.getElementById(SECTION_ID);
    if (!section) return console.error(`Section with id "${SECTION_ID}" not found.`);

    // Get color from CSS variable --color2
    const sectionStyles = getComputedStyle(section);
    const SQUARE_COLOR = sectionStyles.getPropertyValue('--color2') || 'rgba(255,255,255,0.8)';

    // Create canvas
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '-1'; // canvas behind content
    section.style.position = 'relative';
    section.appendChild(canvas);

    // Squares array
    let squares = [];

    // Initialize squares
    function initSquares() {
        squares = [];
        const cols = Math.ceil(canvas.width / SQUARE_SIZE);
        const rows = Math.ceil(canvas.height / SQUARE_SIZE);
        for (let i = 0; i < cols; i++) {
            for (let j = 0; j < rows; j++) {
                squares.push({
                    x: i * SQUARE_SIZE + SQUARE_SIZE / 2,
                    y: j * SQUARE_SIZE + SQUARE_SIZE / 2,
                    originalX: i * SQUARE_SIZE + SQUARE_SIZE / 2,
                    originalY: j * SQUARE_SIZE + SQUARE_SIZE / 2,
                    size: SQUARE_SIZE,
                    offsetX: 0,
                    offsetY: 0
                });
            }
        }
    }

    // Resize canvas
    function resizeCanvas() {
        canvas.width = section.clientWidth;
        canvas.height = section.clientHeight;
        initSquares();
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // Load background image
    const bgImage = new Image();
    bgImage.src = IMAGE_URL;

    // Track cursor
    const cursor = { x: -1000, y: -1000 };
    section.addEventListener('mousemove', e => {
        const rect = section.getBoundingClientRect();
        cursor.x = e.clientX - rect.left;
        cursor.y = e.clientY - rect.top;
    });
    section.addEventListener('mouseleave', () => {
        cursor.x = -1000;
        cursor.y = -1000;
    });

    // Animate squares
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw image like background-size: cover
        if (bgImage.complete) {
            const canvasRatio = canvas.width / canvas.height;
            const imageRatio = bgImage.width / bgImage.height;
            let drawWidth, drawHeight, drawX, drawY;

            if (canvasRatio > imageRatio) {
                drawWidth = canvas.width;
                drawHeight = canvas.width / imageRatio;
                drawX = 0;
                drawY = (canvas.height - drawHeight) / 2;
            } else {
                drawHeight = canvas.height;
                drawWidth = canvas.height * imageRatio;
                drawX = (canvas.width - drawWidth) / 2;
                drawY = 0;
            }

            ctx.drawImage(bgImage, drawX, drawY, drawWidth, drawHeight);
        }

        squares.forEach(sq => {
            const dx = cursor.x - sq.x;
            const dy = cursor.y - sq.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const repelRadius = 100;

            if (dist < repelRadius) {
                const angle = Math.atan2(dy, dx);
                const force = (repelRadius - dist) / 2;
                sq.offsetX = -Math.cos(angle) * force;
                sq.offsetY = -Math.sin(angle) * force;
            } else {
                sq.offsetX += (0 - sq.offsetX) * 0.05;
                sq.offsetY += (0 - sq.offsetY) * 0.05;
            }

            ctx.fillStyle = SQUARE_COLOR;
            ctx.fillRect(
                sq.x - sq.size / 2 + sq.offsetX,
                sq.y - sq.size / 2 + sq.offsetY,
                sq.size,
                sq.size
            );
        });

        requestAnimationFrame(animate);
    }

    animate();
})();
