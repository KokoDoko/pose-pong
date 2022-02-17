export function initCanvas(ctx) {
    ctx.strokeStyle = 'red'
    ctx.fillStyle = "rgb(255,0,0)"
    ctx.lineWidth = 4
    ctx.translate(canvas.width, 0)  
    ctx.scale(-1, 1)    // todo use FLIP option in PoseNet options / stream options. Then canvas can use normal coordinates
}

export function drawCircle(ctx, position, radius, color){
    if(color) ctx.fillStyle = color
    ctx.beginPath()
    ctx.arc(position.x, position.y, radius, 0, 2 * Math.PI)
    ctx.closePath()
    ctx.fill()
}

export function centerCircle(ctx, color) {
    if (color) ctx.strokeStyle = color
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.arc(640, 360, 130, 0, 2 * Math.PI)
    ctx.closePath()
    ctx.stroke()
}

export function drawLine(ctx, positionA, positionB, color) {
    if (color) ctx.strokeStyle = color
    ctx.lineWidth = 6
    ctx.beginPath()
    ctx.moveTo(positionA.x, positionA.y)
    ctx.lineTo(positionB.x, positionB.y)
    ctx.closePath()
    ctx.stroke()
}

// paddles are white with a colored outline
export function drawRect(ctx, rect, color) {
    ctx.fillStyle = "white"
    if (color) ctx.strokeStyle = color
    ctx.fillRect(rect.x, rect.y, rect.width, rect.height)
    ctx.strokeRect(rect.x, rect.y, rect.width, rect.height)
}

export function lerp(start, end, amount) {
    return start * (1 - amount) + end * amount
}