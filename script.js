let game = document.querySelector("#game")
let whoTurn = document.querySelector("#who_turn")
let whoWon = document.querySelector("#who_won")
let xSlider = document.querySelector("#x_slider")
let ySlider = document.querySelector("#y_slider")
let pSlider = document.querySelector("#p_slider")
let cSlider = document.querySelector("#c_slider")
let xValSpan = document.querySelector("#x_val")
let yValSpan = document.querySelector("#y_val")
let pValSpan = document.querySelector("#p_val")
let cValSpan = document.querySelector("#c_val")
let xSmall = document.querySelector("#cols small")
let ySmall = document.querySelector("#rows small")
let pSmall = document.querySelector("#plas small")
let cSmall = document.querySelector("#cons small")
let xVal = xSlider.value
let yVal = ySlider.value
let pVal = pSlider.value
let cVal = cSlider.value
let xDefault = 7
let yDefault = 6
let pDefault = 2
let cDefault = 4
let players = ["red", "yellow", "blue", "green"]
let playersScore = [0, 0, 0, 0]
let turn = 0
let won = false

let fill = getComputedStyle(document.documentElement).getPropertyValue('--board-color')
let radius = "40%"
let mask = `<svg viewBox="0 0 200 200"><defs><mask id="hole"><rect width="100%" height="100%" fill="white"/><circle cx="50%" cy="50%" r="${radius}" fill="black"></mask></defs><rect fill="${fill}" width="100%" height="100%" mask="url(#hole)" class="rect"/></svg>`

let gameArr = []

xSlider.oninput = (e) => {
    xVal = e.target.value
    changeSliderVal(e.target, xVal, xSmall, xValSpan, xDefault)
}
ySlider.oninput = (e) => {
    yVal = e.target.value
    changeSliderVal(e.target, yVal, ySmall, yValSpan, yDefault)
}
pSlider.oninput = (e) => {
    pVal = e.target.value
    changeSliderVal(e.target, pVal, pSmall, pValSpan, pDefault)
}
cSlider.oninput = (e) => {
    cVal = e.target.value
    changeSliderVal(e.target, cVal, cSmall, cValSpan, cDefault)
}

function changeSliderVal(target, val, small, valSpan, defaults) {
    playersScore = [0, 0, 0, 0]
    if (val != defaults) {
        valSpan.textContent = target.value
        small.textContent = ""
    } else {
        valSpan.textContent = target.value
        small.textContent = "(default)"
    }
    buildGame(xVal, yVal)
}

//build game
function buildGame(x, y) {

    //reset values
    won = false
    turn >= pVal ? turn = 0 : turn = turn
        //let playerCapital = players[turn].charAt(0).toUpperCase() + players[turn].slice(1);
        //whoTurn.textContent = `${playerCapital} to move`
    whoTurn.textContent = `Turn`
    let playerColor = getComputedStyle(document.documentElement).getPropertyValue(`--${players[turn]}`)
    let whoTurnBefore = document.querySelector("#who_turn_color")
    whoTurnBefore.style.backgroundColor = playerColor
    game.textContent = ""
    gameArr = []


    //build game array
    for (let i = 0; i < xVal; i++) {
        let col = []
        for (let j = 0; j < yVal; j++) {
            col.push(0)
        }
        gameArr.push(col)
    }

    for (let i = 0; i < x; i++) {

        let row = document.createElement("div")
        row.classList.add("row")

        for (let j = 0; j < y; j++) {
            let col = document.createElement("div")
            col.classList.add("col")
            col.innerHTML = mask
            let rect = col.querySelector(".rect")
            rect.dataset.x = i
            rect.dataset.y = j

            let piece = document.createElement("div")
            piece.classList.add("piece")
            piece.classList.add("none")

            let marker = document.createElement("div")
            marker.classList.add("marker")
            marker.classList.add("none")

            col.append(piece)
            col.append(marker)
            row.append(col)
        }

        game.append(row)
    }

    changeScoreboard()
}

changeScoreboard = () => {
    let scoreboard = document.querySelector("#scoreboard")
    scoreboard.innerHTML = ''
    for (let i = 0; i < pVal; i++) {
        let cont = document.createElement("div")
        cont.classList.add('scoreboard_title_container')
        let color = document.createElement("div")
        color.classList.add('scoreboard_color')
        color.style.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue(`--${players[i]}`)
        let title = document.createElement("h2")
        let playerCapital = players[i].charAt(0).toUpperCase() + players[i].slice(1)
        title.textContent = `${playerCapital} = ${playersScore[i]}`
        title.classList.add("scoreboard_title")
        cont.append(color)
        cont.append(title)
        scoreboard.append(cont)
    }
}

//build first
buildGame(xDefault, yDefault)
changeFav("#ffffff")

//when click on restart
document.querySelector("#restart").addEventListener("click", () => {
    turn != pVal - 1 ? turn++ : turn = 0
    buildGame(xVal, yVal)
})

//when click on fall checkbox
document.querySelector("#fall").addEventListener("click", () => {

    //get content of :root to check if fall is checked or not
    let fall = document.querySelector("#fall_wrapper .checkmark")
    let fallValue = window.getComputedStyle(fall, ':after').getPropertyValue("content")

    //change values of :root to display block or none of :after indicators
    if (fallValue == '"false"') {
        document.documentElement.style.setProperty("--display-fall", "none");
        document.documentElement.style.setProperty("--display-no-fall", "block");
    } else {
        document.documentElement.style.setProperty("--display-fall", "block");
        document.documentElement.style.setProperty("--display-no-fall", "none");
    }
    buildGame(xVal, yVal)
})

//play move when clicked on game
game.addEventListener('click', (e) => {
    e = e || window.event
    var target = e.target
    playMove(target.dataset.x, target.dataset.y)
}, false);

function playMove(x, y) {
    if (won) return

    let fall = document.querySelector("#fall_wrapper .checkmark")
    let fallValue = window.getComputedStyle(fall, ':after').getPropertyValue("content")
    let piece, piecePos

    if (x != undefined) {

        if (fallValue == '"false"') {

            piece = document.querySelector(`#game .row:nth-child(${+x + 1}) .col:nth-child(${+y + 1}) .piece`)

            //if already a piece there, return
            if (!piece.classList.contains("none")) return


            piece.classList.remove("none")
            gameArr[x][y] = turn + 1
            piece.classList.add(players[turn])

            piece.style.transform = `translateY(-${1000}%)`
            anime({
                targets: piece,
                translateY: 0,
                duration: 0,
            })

        }
        if (fallValue == '"true"') {
            for (let i = yVal - 1; i >= 0; i--) {

                //if move not possible in this row, return
                for (let k = 1; k < pVal + 1; k++) {
                    if (gameArr[x][0] == k) {
                        return
                    }
                }

                //check for lower piece in row
                if (gameArr[x][i] == 0) {

                    piece = document.querySelector(`#game .row:nth-child(${+x + 1}) .col:nth-child(${i + 1}) .piece`)
                    piecePos = i
                    piece.classList.remove("none")
                    gameArr[x][i] = turn + 1
                    piece.classList.add(players[turn])

                    break
                }
            }

            piece.style.transform = `translateY(-${piecePos * 100 + 200}%)`
            anime({
                targets: piece,
                translateY: 0,
                duration: piecePos * 200 + 700,
                easing: 'easeOutBounce',
            })
        }



        //next turn
        turn != pVal - 1 ? turn++ : turn = 0

        //change fav before next turn
        changeFav(getComputedStyle(document.documentElement).getPropertyValue(`--${players[turn]}`))

        //change player to move h2
        whoTurn.textContent = `Turn`
        let playerColor = getComputedStyle(document.documentElement).getPropertyValue(`--${players[turn]}`)
        let whoTurnBefore = document.querySelector("#who_turn_color")
        whoTurnBefore.style.backgroundColor = playerColor


        checkPosition();
    }
}

function checkPosition() {

    //check for draw
    let drawCount = 0
    for (let i = 0; i < xVal; i++) {
        if (gameArr[i][0] != 0) {
            drawCount++
            if (drawCount == xVal) {
                youDraw()
            }
        }
    }

    //check for vertical 4 in a row
    for (let i = 0; i < xVal; i++) {
        for (let j = 0; j < yVal - cVal + 1; j++) {
            for (let k = 1; k < pVal + 1; k++) {
                let pn = 0
                for (let l = 0; l < cVal; l++) {
                    if (gameArr[i][j + l] == k) {
                        pn++
                        if (pn == cVal) {
                            youWon("vertical", i + 1, j + 1)
                        }
                    }
                }
            }
        }
    }

    //check for horizontal 4 in a row
    for (let i = 0; i < xVal - cVal + 1; i++) {
        for (let j = 0; j < yVal; j++) {
            for (let k = 1; k < pVal + 1; k++) {
                let pn = 0
                for (let l = 0; l < cVal; l++) {
                    if (gameArr[i + l][j] == k) {
                        pn++
                        if (pn == cVal) {
                            youWon("horizontal", i + 1, j + 1)
                        }
                    }
                }
            }
        }
    }

    //check for diagonal 4 in a row1
    for (let i = 0; i < xVal - cVal + 1; i++) {
        for (let j = 0; j < yVal - cVal + 1; j++) {
            for (let k = 1; k < pVal + 1; k++) {
                let pn = 0
                for (let l = 0; l < cVal; l++) {
                    if (gameArr[i + l][j + l] == k) {
                        pn++
                        if (pn == cVal) {
                            youWon("diagonal1", i + 1, j + 1)
                        }
                    }
                }
            }
        }
    }

    //check for diagonal 4 in a row2
    for (let i = 0; i < xVal - cVal + 1; i++) {
        for (let j = cVal - 1; j < yVal; j++) {
            for (let k = 1; k < pVal + 1; k++) {
                let pn = 0
                for (let l = 0; l < cVal; l++) {
                    if (gameArr[i + l][j - l] == k) {
                        pn++
                        if (pn == cVal) {
                            youWon("diagonal2", i + 1, j + 1)
                        }
                    }
                }
            }
        }
    }
}

function youWon(direction, a, b) {

    won = true

    let prevTurn
    turn != 0 ? prevTurn = turn - 1 : prevTurn = pVal - 1
    playersScore[prevTurn] += 1
    changeScoreboard()
        //let playerCapital = players[prevTurn].charAt(0).toUpperCase() + players[prevTurn].slice(1)
        //whoTurn.textContent = `${playerCapital} wins!`
    whoTurn.textContent = `Wins!`
    let playerColor = getComputedStyle(document.documentElement).getPropertyValue(`--${players[prevTurn]}`)
    let whoTurnBefore = document.querySelector("#who_turn_color")
    whoTurnBefore.style.backgroundColor = playerColor

    if (direction == "vertical") {
        for (let i = 0; i < cVal; i++) {
            document.querySelector(`#game .row:nth-child(${a}) .col:nth-child(${b + i}) .marker`).classList.remove("none")
        }
    }
    if (direction == "horizontal") {
        for (let i = 0; i < cVal; i++) {
            document.querySelector(`#game .row:nth-child(${a + i}) .col:nth-child(${b}) .marker`).classList.remove("none")
        }
    }
    if (direction == "diagonal1") {
        for (let i = 0; i < cVal; i++) {
            document.querySelector(`#game .row:nth-child(${a + i}) .col:nth-child(${b + i}) .marker`).classList.remove("none")
        }
    }
    if (direction == "diagonal2") {
        for (let i = 0; i < cVal; i++) {
            document.querySelector(`#game .row:nth-child(${a + i}) .col:nth-child(${b - i}) .marker`).classList.remove("none")
        }
    }
    turn != pVal - 1 ? turn++ : turn = 0
}

function youDraw() {
    whoTurn.textContent = `draw`
    let whoTurnBefore = document.querySelector("#who_turn_color")
    whoTurnBefore.style.backgroundColor = fill
}


//make favicon
function changeFav(col) {
    let canvas = document.createElement('canvas')
    canvas.width = 240
    canvas.height = 240
    let ctx = canvas.getContext('2d')
    let img = new Image()
    img.src = 'favicon.ico'
    img.onload = () => {
        ctx.fillStyle = col
        ctx.beginPath()
        ctx.arc(120, 120, 120, 0, 2 * Math.PI, false)
        ctx.fill()

        ctx.fillStyle = fill
        ctx.font = 'bold 120px "Lexend Deca"'
        ctx.fillText('C4', 40, 160)

        ctx.drawImage(img, 0, 0)

        let link = document.createElement('link')
        link.type = 'image/x-icon'
        link.rel = 'shortcut icon'
        link.href = canvas.toDataURL("image/x-icon")
        document.getElementsByTagName('head')[0].appendChild(link)
    }
}