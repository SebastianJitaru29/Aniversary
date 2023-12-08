const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener("resize", function () {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    init();
});

function drawHeart(x, y, size, color) {
    c.fillStyle = color;
    c.beginPath();
    c.moveTo(x, y);
    c.bezierCurveTo(x + size / 2, y - size / 2, x + size, y, x + size / 2, y + size / 2);
    c.lineTo(x, y + size);
    c.lineTo(x - size / 2, y + size / 2);
    c.bezierCurveTo(x - size, y, x - size / 2, y - size / 2, x, y);
    c.fill();
    c.closePath();
}

function creatMountainRange(mountainAmount, height, color) {
    for (let i = 0; i < mountainAmount; i++) {
        const mountainWidth = canvas.width / mountainAmount;
        const heartSize = height * 0.7;
        const x = i * mountainWidth + mountainWidth / 2;
        const y = canvas.height - height + heartSize / 2;
        drawHeart(x, y, heartSize, color);
    }
}

function createHillRange(hillAmount, height, color) {
    for (let i = 0; i < hillAmount; i++) {
        const hillWidth = canvas.width / hillAmount;
        const heartSize = height * 0.7;
        const x = i * hillWidth + hillWidth / 2;
        const y = canvas.height - height + heartSize / 2;
        drawHeart(x, y, heartSize, color);
    }
}

function Star(x, y, radius, color) {
    this.x = x
    this.y = y
    this.radius = radius
    this.color = color
    this.velocity = {
        x: (Math.random() - 0.5) * 8,
        y: 3
    }
    this.friction = 0.8
    this.gravity = 1
}

Star.prototype.draw = function () {
    c.save()
    c.beginPath()
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
    c.fillStyle = this.color
    c.shadowColor = '#E3EAEF'
    c.shadowBlur = 20
    c.fill()
    c.closePath()
    c.restore()
}

Star.prototype.update = function () {
    this.draw()

    if (this.y + this.radius + this.velocity.y > canvas.height - groundHeight) {
        this.velocity.y = -this.velocity.y * this.friction
        this.shatter()
    } else {
        this.velocity.y += this.gravity
    }

    if (this.x + this.radius + this.velocity.x > canvas.width || this.x - this.radius <= 0) {
        this.velocity.x = -this.velocity.x * this.friction
        this.shatter()
    }

    this.x += this.velocity.x
    this.y += this.velocity.y
}

Star.prototype.shatter = function () {
    this.radius -= 3
    for (let i = 0; i < 8; i++) {
        miniStars.push(new MiniStar(this.x, this.y, 2))
    }
}

function MiniStar(x, y, radius, color) {
    Star.call(this, x, y, radius, color)
    this.velocity = {
        x: (Math.random() - 0.5) * 10,
        y: (Math.random() - 0.5) * 30
    }
    this.friction = 0.8
    this.gravity = 0.1
    this.ttl = 100
    this.opacity = 1
}

MiniStar.prototype.draw = function () {
    c.save()
    c.beginPath()
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
    c.fillStyle = `rgba(1,234, 239, ${this.opacity})`
    c.shadowColor = '#E3EAEF'
    c.shadowBlur = 20
    c.fill()
    c.closePath()
    c.restore()
}

MiniStar.prototype.update = function () {
    this.draw()

    if (this.y + this.radius + this.velocity.y > canvas.height - groundHeight) {
        this.velocity.y = -this.velocity.y * this.friction
    } else {
        this.velocity.y += this.gravity
    }

    this.x += this.velocity.x
    this.y += this.velocity.y
    this.ttl -= 1
    this.opacity -= 0.0001 * this.ttl
}

// Implementation
const backgroundGradient = c.createLinearGradient(0, 0, canvas.width, canvas.height);
backgroundGradient.addColorStop(0, '#003366'); // Dark Blue
backgroundGradient.addColorStop(0.5, '#66a3ff'); // Light Blue
backgroundGradient.addColorStop(1, '#b3d9ff'); // Pale Blue

let stars;
let miniStars;
let backgroundStars;
let ticker = 0;
let randomSpawnRate = 75;
const groundHeight = 0.09 * canvas.height;
let inf = 1e9;

function init() {
    stars = [];
    miniStars = [];
    backgroundStars = [];

    for (let i = 0; i < 200; i++) {
        const x = Math.random() * canvas.width
        const y = Math.random() * canvas.height
        const radius = Math.random() * 3
        backgroundStars.push(new Star(x, y, radius, 'white'))
    }
}

// Animation Loop
function animate() {
    c.clearRect(0, 0, canvas.width, canvas.height)
    c.fillStyle = backgroundGradient
    c.fillRect(0, 0, canvas.width, canvas.height)

    backgroundStars.forEach(backgroundStar => {
        backgroundStar.draw()
    })

    creatMountainRange(1, canvas.height * 0.7, '#AA0000'); // Darker Red
    creatMountainRange(2, canvas.height * 0.6, '#880000'); // Slightly Darker Red
    creatMountainRange(3, canvas.height * 0.4, '#550000'); // Even Darker Red





    c.fillStyle = '#182028'
    c.fillRect(0, canvas.height - groundHeight, canvas.width, groundHeight)
    stars.forEach((star, index) => {
        star.update();
        if (star.radius === 0) {
            stars.splice(index, 1)
        }
    });

    miniStars.forEach((miniStar, index) => {
        miniStar.update();
        if (miniStar.ttl === 0) {
            miniStars.splice(index, 1)
        }
    });

    ticker++
    if (ticker >= inf) {
        ticker = 0
    }
    if (ticker % randomSpawnRate === 0) {
        const radius = 9
        const x = Math.max(radius, Math.random() * canvas.width - radius)
        stars.push(new Star(x, -100, 9, '#E3EAEF'))
        randomSpawnRate = Math.floor(Math.random() * (200 - 125 + 1) + 125)
    }

    requestAnimationFrame(animate)
}

init()
animate()
