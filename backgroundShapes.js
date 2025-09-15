(function () {
  // === CONFIG ===
  const CONFIG = {
    avgSize: 80,                // average size of shapes
    shapeColor: ["#e5a227a7","#e5a22762"],
    numShapes: 6,              // number of shapes
    speed: 1.0,                 // movement speed
    cursorRadius: 100,          // cursor interaction radius
    pushStrength: 0.5,          // how strongly shapes are pushed
    friction: 0.95              // slows shape velocity gradually
  };
  // ==============

  // Canvas setup
  let canvas = document.getElementById("bgCanvas");
  if (!canvas) {
    canvas = document.createElement("canvas");
    canvas.id = "bgCanvas";
    document.body.appendChild(canvas);

    const style = document.createElement("style");
    style.textContent = `
      #bgCanvas {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        z-index: -2;
        pointer-events: none;
      }
    `;
    document.head.appendChild(style);
  }
  const ctx = canvas.getContext("2d");

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener("resize", resize);
  resize();

  // Mouse
  let mouse = { x: -9999, y: -9999 };
  window.addEventListener("mousemove", e => { mouse.x = e.clientX; mouse.y = e.clientY; });
  window.addEventListener("mouseleave", () => { mouse.x = -9999; mouse.y = -9999; });

  const rand = (min, max) => Math.random() * (max - min) + min;

  function drawStar(ctx, x, y, spikes, outerRadius, innerRadius) {
    let rot = Math.PI / 2 * 3;
    let step = Math.PI / spikes;
    ctx.beginPath();
    ctx.moveTo(x, y - outerRadius);
    for (let i = 0; i < spikes; i++) {
      ctx.lineTo(x + Math.cos(rot) * outerRadius, y + Math.sin(rot) * outerRadius);
      rot += step;
      ctx.lineTo(x + Math.cos(rot) * innerRadius, y + Math.sin(rot) * innerRadius);
      rot += step;
    }
    ctx.closePath();
    ctx.fill();
  }

  function drawPolygon(ctx, x, y, sides, radius) {
    let angle = (Math.PI * 2) / sides;
    ctx.beginPath();
    for (let i = 0; i < sides; i++) {
      let px = x + radius * Math.cos(i * angle);
      let py = y + radius * Math.sin(i * angle);
      i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fill();
  }

  class Shape {
    constructor() {
      this.x = rand(0, canvas.width);
      this.y = rand(0, canvas.height);
      this.vx = rand(-0.1, 0.1) * CONFIG.speed;
      this.vy = rand(-0.1, 0.1) * CONFIG.speed;
      this.scale = rand(0.5, 1.5);
      this.scaleSpeed = rand(0.001, 0.003) * CONFIG.speed;
      this.rotation = rand(0, Math.PI * 2);
      this.rotationSpeed = rand(-0.002, 0.002) * CONFIG.speed;

      this.type = Math.random() > 0.5 ? "star" : "polygon";
      this.sides = Math.floor(rand(5, 10));
      this.size = rand(CONFIG.avgSize * 0.5, CONFIG.avgSize * 1.5);

      if (Array.isArray(CONFIG.shapeColor)) {
        this.color = CONFIG.shapeColor[Math.floor(rand(0, CONFIG.shapeColor.length))];
      } else {
        this.color = CONFIG.shapeColor;
      }
    }

    update(shapes) {
      // move
      this.x += this.vx;
      this.y += this.vy;

      // bounce edges
      if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
      if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

      // rotation & scaling
      this.rotation += this.rotationSpeed;
      this.scale += this.scaleSpeed;
      if (this.scale > 1.5 || this.scale < 0.5) this.scaleSpeed *= -1;

      // cursor interaction
      const dx = this.x - mouse.x;
      const dy = this.y - mouse.y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      if(dist < CONFIG.cursorRadius + this.size/2){
        const angle = Math.atan2(dy, dx);
        const force = (CONFIG.cursorRadius - dist)/CONFIG.cursorRadius;
        this.vx += Math.cos(angle) * force * CONFIG.pushStrength;
        this.vy += Math.sin(angle) * force * CONFIG.pushStrength;
      }

      // collision with other shapes
      shapes.forEach(other => {
        if(other === this) return;
        const dx = other.x - this.x;
        const dy = other.y - this.y;
        const distance = Math.sqrt(dx*dx + dy*dy);
        const minDist = (this.size + other.size)/2;
        if(distance < minDist && distance > 0){
          // simple elastic collision push
          const angle = Math.atan2(dy, dx);
          const overlap = minDist - distance;
          const pushX = Math.cos(angle) * overlap * 0.5;
          const pushY = Math.sin(angle) * overlap * 0.5;
          this.x -= pushX; this.y -= pushY;
          other.x += pushX; other.y += pushY;
        }
      });

      // friction
      this.vx *= CONFIG.friction;
      this.vy *= CONFIG.friction;
    }

    draw(ctx){
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      ctx.scale(this.scale, this.scale);
      ctx.fillStyle = this.color;
      if(this.type==="star") drawStar(ctx,0,0,this.sides,this.size,this.size/2);
      else drawPolygon(ctx,0,0,this.sides,this.size);
      ctx.restore();
    }
  }

  const shapes = Array.from({length:CONFIG.numShapes},()=>new Shape());

  function animate(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    shapes.forEach(shape=>{ shape.update(shapes); shape.draw(ctx); });
    requestAnimationFrame(animate);
  }

  animate();
})();
