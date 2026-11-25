const canvas = document.getElementById('canvas');
const colorInput = document.getElementById('color');
const slider = document.getElementById('brush-size');
const modeText = document.getElementById('modeText');

let history = []

let mode = "draw"

canvas.width = 500;
canvas.height = 500;

const ctx = canvas.getContext('2d');

function drawLine(from, to) {
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();
}

let lastClicked = null;
ctx.lineWidth = 5;
ctx.lineCap = 'round';

canvas.addEventListener('mousedown', event => {
    lastClicked = { x: event.offsetX, y: event.offsetY };

    history.push(ctx.getImageData(0, 0, 500, 500))

    if (mode === "stamp") {
        const size = slider.valueAsNumber
        ctx.fillStyle = colorInput.value
        ctx.fillRect(lastClicked.x - size / 2, lastClicked.y - size / 2, size, size)
        lastClicked = null;
        return;
    }

    ctx.lineWidth = slider.valueAsNumber
    if (mode === "draw") {
        ctx.strokeStyle = colorInput.value
    } else if( mode === "erase") {
        ctx.strokeStyle = 'rgb(255, 255, 255)'
    }
    ctx.beginPath();
    ctx.fillStyle = ctx.strokeStyle
	ctx.arc(lastClicked.x, lastClicked.y, ctx.lineWidth / 2, 0, Math.PI * 2)
	ctx.fill()
	ctx.beginPath()
});

canvas.addEventListener('mousemove', event => {
    if (!lastClicked) {
        return;
    }

    const curClicked = { x: event.offsetX, y: event.offsetY }
    drawLine(lastClicked, curClicked);
    lastClicked = curClicked;
});

canvas.addEventListener('mouseup', () => {
    lastClicked = null;
});

canvas.addEventListener('mouseleave', () => {
    lastClicked = null;
});

function clearCanvas() {
    history.push(ctx.getImageData(0, 0, 500, 500))

    ctx.clearRect(0, 0, 500, 500);
}

function undoCanvas() {
    if (history.length === 0) {
        return
    }
    ctx.putImageData(history.pop(), 0, 0)

}

function drawMod() {
    mode = 'draw'
    modeText.textContent = "Mode: Draw"
}

function eraseMod() {
    mode = 'erase'
    modeText.textContent = "Mode: Erase"
}

function stampMod() {
    mode = 'stamp'
    modeText.textContent = "Mode: Stamp"
}
