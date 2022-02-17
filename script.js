import { drawCircle, drawLine, lerp, initCanvas } from "./draw.js"
import { Pong } from "./pong.js"

const message = document.querySelector("#message")
const p1message = document.querySelector("#player1")
const p2message = document.querySelector("#player2")
const video = document.getElementById("video")
const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")

let poses = []
let wrists = [350,350]
let width = 1280
let height = 720
let poseNet, pong
let noPlayers = 0

function startApp() {
    initWebcam()
    pong = new Pong(ctx)
    // canvas settings
    initCanvas(ctx)

    let options = {
        architecture: 'MobileNetV1', // 'ResNet50' 'MobileNetV1'
        maxPoseDetections: 2 // not working
    }
    // Create a new poseNet method
    poseNet = ml5.poseNet(video, modelLoaded, options)
    poseNet.on('pose', (results) => poses = results)
}

// When the model is loaded
function modelLoaded() {
    message.innerHTML = "Use your left or right hand to move the paddles.<br>Move your head in the circle to reset the scores"
    drawFrame()
}

// Create a webcam capture
function initWebcam() {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true }).then(function (stream) {
            video.srcObject = stream
            video.play()
            /* double check your webcam width / height */
            // let stream_settings = stream.getVideoTracks()[0].getSettings()
            //console.log('Width: ' + stream_settings.width + ' Height: ' + stream_settings.height)
        })
    }
}

// A function to draw the video and poses into the canvas independently of posenet
function drawFrame() {
    drawCamera()
    drawPoses()

    // draw the ball and the paddles
    pong.update(wrists)

    // draw everything max 10x per second
    // setTimeout(() => drawCameraIntoCanvas(), 100)
    window.requestAnimationFrame(drawFrame)
}


function drawCamera(){
    ctx.filter = "contrast(0.5) saturate(0)"
    ctx.drawImage(video, 0, 0, width, height) //16:9
    ctx.filter = "none"
}


function drawPoses() {
    // poses.length kan 4 zijn, zelfs als er maar 1 persoon is...
    // volgorde in poses is niet altijd hetzelfde! - draw only first two
    let posesDetected = Math.min(poses.length, 2)
    let leftDetected = false
    let rightDetected = false
    
    for (let i = 0; i < posesDetected; i += 1) {
        // check if NOSE on left side of screen, or right side of screen
        let pose = poses[i].pose
        let color = "yellow"
        
        if(pose.nose.x < width/2) {
            color = "red"
            rightDetected = true
            drawRightWrist(pose.rightWrist)
        }
        if(pose.nose.x > width/2) {
            color = "blue"
            leftDetected = true
            drawLeftWrist(pose.leftWrist)
        }
        // TODO nose in the center circle means reset
        if(pose.nose.x > 600 && pose.nose.x < 680 && pose.nose.y > 320 && pose.nose.y < 400) {
            pong.resetGame()
        }
        
        drawKeypoints(poses[i], color)
        drawSkeleton(poses[i], color)
    }

    // TODO IF 2 PLAYERS NOT DETECTED AFTER A WHILE, CALL RESET AUTOMATICALLY
    // or just 1 player so you can still play against yourself
    if (leftDetected && rightDetected) {
        pong.setPlaying(true)
        message.innerHTML = "Use your left or right hand to move the paddles.<br>Move your head in the circle to reset the game."
    } else {
        pong.setPlaying(false)
    }

    p1message.innerHTML = (leftDetected) ? "P1 detected" : "P1 not detected"
    p2message.innerHTML = (rightDetected) ? "P2 detected" : "P2 not detected"
}



// draw wrist + paddle in white - remember the canvas is mirrored - todo draw paddles in separate file
function drawRightWrist(wrist) {
    if(wrist.confidence > 0.3) {
        drawCircle(ctx, wrist, 14, "white")
        // lerp towards new position for drawing paddle
        wrists[1] = lerp(wrists[1], wrist.y, 0.1)
        drawLine(ctx, wrist, { x: 20, y: wrists[1] }, "yellow")
    }
}

function drawLeftWrist(wrist) {
    if (wrist.confidence > 0.3) {
        drawCircle(ctx, wrist, 14, "white")
        // lerp towards new position for drawing paddle + draw line from actual wrist to paddle position
        wrists[0] = lerp(wrists[0], wrist.y, 0.1)
        drawLine(ctx, wrist, {x:1230, y:wrists[0]}, "yellow")
    }
}



function drawKeypoints(pose, color) {
    // all the keypoints
    for (let j = 0; j < pose.pose.keypoints.length; j += 1) {
        let keypoint = pose.pose.keypoints[j]
        // Only draw an ellipse is the pose probability is bigger than 0.2
        if (keypoint.score > 0.2) {
            drawCircle(ctx, keypoint.position, 12, color)
        }
    }
}

// A function to draw the skeletons
function drawSkeleton(pose, color) {
    // For every skeleton, loop through all body connections
    // todo probability check?
    for (let j = 0; j < pose.skeleton.length; j += 1) {
        let partA = pose.skeleton[j][0]
        let partB = pose.skeleton[j][1]
        drawLine(ctx, partA.position, partB.position, color)
    }
}

startApp()