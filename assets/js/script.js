const canvas = document.querySelector("canvas"),
toolBtns = document.querySelectorAll(".tool"),
fillColor = document.querySelector("#fill-color"),
sizeSlider = document.querySelector("#size-slider"),
colorBtns = document.querySelectorAll(".colors .option"),
colorPicker = document.querySelector("#color-picker"),
clearCanvas = document.querySelector(".clear-canvas"),
saveImg = document.querySelector(".save-img"),
ctx = canvas.getContext("2d");
let prevMousePoint, snapshot,
isDrawing = false,
selectedTool = "brush",
brushSize = 5,
selectedColor = "#000";

const setCanvasBackground = () => {
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = selectedColor;
}

window.addEventListener("load", () => {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight - 7;
    ctx.lineCap = "round";
    setCanvasBackground();
});

const currMousePoint = e => {
    let x = "ontouchstart" in window ? e.touches?.[0].pageX : e.offsetX;
    let y = "ontouchstart" in window ? e.touches?.[0].pageY : e.offsetY;
    return { x, y };
}

const drawRect = position => {
    if(!fillColor.checked) {
        return ctx.strokeRect(position.x, position.y, prevMousePoint.x - position.x, prevMousePoint.y - position.y);
    }
    ctx.fillRect(position.x, position.y, prevMousePoint.x - position.x, prevMousePoint.y - position.y);
}

const drawCircle = position => {
    ctx.beginPath();
    let radius = Math.sqrt(Math.pow((prevMousePoint.x - position.x), 2) + Math.pow((prevMousePoint.y - position.y), 2));
    ctx.arc(prevMousePoint.x, prevMousePoint.y, radius, 0, 2 * Math.PI);
    fillColor.checked ? ctx.fill() : ctx.stroke();
}

const drawTriangle = position => {
    ctx.beginPath();
    ctx.moveTo(prevMousePoint.x, prevMousePoint.y);
    ctx.lineTo(position.x, position.y);
    ctx.lineTo(prevMousePoint.x * 2 - position.x, position.y);
    ctx.closePath();
    fillColor.checked ? ctx.fill() : ctx.stroke();
}

const startDraw = e => {
    isDrawing = true;
    ctx.beginPath();
    prevMousePoint = currMousePoint(e);
    ctx.lineWidth = brushSize;
    ctx.strokeStyle = selectedColor;
    ctx.fillStyle = selectedColor;
    snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
}

const drawing = e => {
    if(!isDrawing) return;
    ctx.putImageData(snapshot, 0, 0);
    let position = currMousePoint(e);

    if(selectedTool === "brush" || selectedTool === "eraser") {
        ctx.strokeStyle = selectedTool === "eraser" ? "#fff" : selectedColor;
        ctx.lineTo(position.x, position.y);
        ctx.stroke();
    } else if(selectedTool === "rect") {
        drawRect(position);
    } else if(selectedTool === "circle") {
        drawCircle(position);
    } else {
        drawTriangle(position);
    } 
}

toolBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelector(".options .active").classList.remove("active");
        btn.classList.add("active");
        selectedTool = btn.id;
    });
});

sizeSlider.addEventListener("change", () => brushSize = sizeSlider.value);

colorBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelector(".colors .selected").classList.remove("selected");
        btn.classList.add("selected");
        selectedColor = window.getComputedStyle(btn).getPropertyValue("background-color");
    });
});

clearCanvas.addEventListener("click", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setCanvasBackground();
});

colorPicker.addEventListener("change", e => {
    colorPicker.parentElement.style.backgroundColor = e.target.value;
    colorPicker.parentElement.click();
});

saveImg.addEventListener("click", () => {
    const link = document.createElement("a");
    link.download = `${Date.now()}.jpg`;
    link.href = canvas.toDataURL();
    link.click();
});

canvas.addEventListener("mousedown", startDraw);
canvas.addEventListener("touchstart", startDraw);
canvas.addEventListener("mousemove", drawing);
canvas.addEventListener("touchmove", drawing);
canvas.addEventListener("mouseup", () => isDrawing = false);
canvas.addEventListener("mouseleave", () => isDrawing = false);
canvas.addEventListener("touchend", () => isDrawing = false);