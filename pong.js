import { drawCircle, drawRect, centerCircle, lerp } from "./draw.js"

export class Pong {
    constructor(ctx) {
        this.message = document.querySelector("#message")
        this.p1message = document.querySelector("#player1")
        this.p2message = document.querySelector("#player2")
        this.playing = false
        this.scores = [0,0]
        this.ctx = ctx
        this.ball = { x: 640, y: 350, radius:16 }
        this.speed = { x: -6, y: -3 }
        this.paddles = [
            { x: 1230, y: 350, width: 30, height: 160 }, 
            { x: 20, y: 350, width: 30, height: 160 }
        ]
    }

    resetGame(){
        this.playing =false
        this.scores = [0, 0]
        this.message.innerHTML = "Position two players left and right"
        this.p1message.innerHTML = "P1 not detected"
        this.p2message.innerHTML = "P2 not detected"
    }

    setPlaying(p) {
        this.playing = p
    }

    update(wrists){
        this.paddles[0].y = wrists[0] - 80
        this.paddles[1].y = wrists[1] - 80
        this.drawPaddles()
        this.drawBall()
        centerCircle(this.ctx, "white")
    }

    drawBall() {
        // todo on hit SOUND + increase speed?

        // hit paddle
        if (this.ballHitsPaddle(this.paddles[0])) this.speed.x *= -1
        if (this.ballHitsPaddle(this.paddles[1])) this.speed.x *= -1
        // hit ceiling
        if (this.ball.y - this.ball.radius <= 0) this.speed.y *= -1
        if (this.ball.y + this.ball.radius >= 720) this.speed.y *= -1
        // move ball
        this.ball.x += this.speed.x
        this.ball.y += this.speed.y
        drawCircle(this.ctx, this.ball, this.ball.radius, "white")

        // if there are two players, add the score
        if (this.playing) {
            if (this.ball.x < -30) this.scores[0] = this.scores[0] + 1
            if (this.ball.x > 1290) this.scores[1] = this.scores[1] + 1
        }
        // restart if out of bounds
        if (this.ball.x < -30 || this.ball.x > 1290) {
            this.ball.x = 640
            this.ball.y = 325 + Math.random() * 50
            this.speed.x = (Math.random() > 0.5) ? -6 : 6
            this.speed.y = (Math.random() * 2 + 3)
            // if there are two players show the score
            if(this.playing) {
                this.p1message.innerHTML = `P1 : ${this.scores[0]}`
                this.p2message.innerHTML = `P2 : ${this.scores[1]}`
            }
        }
    }

    // always draw paddles at the last known position
    drawPaddles() {
        drawRect(this.ctx, this.paddles[0], "blue") // x 1240
        drawRect(this.ctx, this.paddles[1], "red") // x 10
    }

    // circle intersects rectangle
    ballHitsPaddle(paddle) {
        let newPos = {x:this.ball.x + this.speed.x, y: this.ball.y + this.speed.y}

        let distX = Math.abs(newPos.x - paddle.x - paddle.width / 2)
        let distY = Math.abs(newPos.y - paddle.y - paddle.height / 2)

        //let distX = Math.abs(this.ball.x - paddle.x - paddle.width / 2)
        //let distY = Math.abs(this.ball.y - paddle.y - paddle.height / 2)

        if (distX > (paddle.width / 2 + this.ball.radius)) { return false }
        if (distY > (paddle.height / 2 + this.ball.radius)) { return false }

        if (distX <= (paddle.width / 2)) { return true }
        if (distY <= (paddle.height / 2)) { return true }

        let dx = distX - paddle.width / 2
        let dy = distY - paddle.height / 2
        return (dx * dx + dy * dy <= (this.ball.radius * this.ball.radius))
    }
}