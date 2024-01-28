var origboard;
var game = null;
var humanplayer = null;
var AIplayer = null;
var humanplayer2 = null;
var turn_track = null;


const welcome_container = document.querySelector(".welcome-container"); 
const choice_container = document.querySelector(".choice-container"); 
const game_container = document.querySelector(".game-container"); 

document.getElementById("AI").addEventListener("click", ()=>{
	game = "AIGAME";
	welcome_container.classList.remove("active-display");
	choice_container.classList.add("active-display");
});

document.getElementById("Human").addEventListener("click", ()=>{
	game = "HUMANGAME";
	welcome_container.classList.remove("active-display");
	choice_container.classList.add("active-display");
});

document.getElementById("X").addEventListener("click", ()=>{
	humanplayer = "X";
	AIplayer = "O"
	humanplayer2 = "O"
	turn_track = humanplayer
	choice_container.classList.remove("active-display");
	game_container.classList.add("active-display");
});

document.getElementById("O").addEventListener("click", ()=>{
	humanplayer = "O";
	AIplayer = "X";
	humanplayer2 = "X";
	turn_track = humanplayer
	choice_container.classList.remove("active-display");
	game_container.classList.add("active-display");
});

// let turn_track = humanplayer; //this variable tracks whose turn it is to play when the game is played with another human


const winCombos = [
	[0, 1, 2],
	[3, 4, 5],
	[6, 7, 8],
	[0, 3, 6],
	[1, 4, 7],
	[2, 5, 8],
	[0, 4, 8],
	[6, 4, 2]
]

const cells = document.querySelectorAll('.cell');
startGame();

function startGame(){
	turn_track = humanplayer;
    document.querySelector(".endgame").style.display = "none";
    origboard = Array.from(Array(9).keys())
    console.log(origboard);
    for (var i = 0; i<cells.length; i++){
        cells[i].innerText = "";
        cells[i].style.removeProperty("background-color");
        cells[i].addEventListener("click", turnClick, false);
    }
}

function turnClick(square) {
	if (typeof origboard[square.target.id] == 'number' && game === "AIGAME") {
		turn(square.target.id, humanplayer)
		if (!checkWin(origboard, humanplayer) && !checkTie()){
			console.log(humanplayer);
			turn(bestSpot(), AIplayer);
		} 		
	}
	if (typeof origboard[square.target.id] == 'number' && game === "HUMANGAME") {
		if (!checkWin(origboard, humanplayer) && !checkTie()){
			console.log(humanplayer);
			turn(square.target.id, turn_track);
			changeTurn()
		} 		
	}
}

function changeTurn(){
    if(turn_track == humanplayer){
        turn_track = humanplayer2;
        // document.querySelector(".bg").style.left = "85px";
    }
    else{
        turn_track = humanplayer;
        // document.querySelector(".bg").style.left = "0px";
    }   
}


function turn(squareId, player){
    origboard[squareId] = player;
    document.getElementById(squareId).innerText = player;
    let gameWon = checkWin(origboard, player);
    if (gameWon){
        gameOver(gameWon);
		console.log(gameWon);
    }
}

function checkWin(board, player) {
	let plays = board.reduce((a, e, i) =>
		(e === player) ? a.concat(i) : a, []);
	let gameWon = null;
	for (let [index, win] of winCombos.entries()) {
		if (win.every(elem => plays.indexOf(elem) > -1)) {
			gameWon = {index: index, player: player};
			break;
		}
	}
	return gameWon;
}


function gameOver(gameWon){
    for(let index of winCombos[gameWon.index]){
        document.getElementById(index).style.backgroundColor = 
            gameWon.player ==humanplayer ? "blue" : "red";
    }
    for(var i = 0; i<cells.length; i++){
        cells[i].removeEventListener("click", turnClick, false);
    }
	if(game === "AIGAME"){
		declareWinner(gameWon.player == humanplayer ? "You Win!" : "You Lose!");
	}
	else if(game === "HUMANGAME"){
		if(gameWon.player == "X"){
			declareWinner("X Wins!!")
		}
		else if(gameWon.player == "O"){
			declareWinner("O Wins!!")
		}
	}
}

function declareWinner(who){
    document.querySelector(".endgame").style.display = "block";
    document.querySelector(".endgame .text").innerText = who;
}

function emptySquares(){
    return origboard.filter(s=> typeof s == "number");
}

function bestSpot(){
    return minimax(origboard, AIplayer).index;
    // return emptySquares()[0];
}

function checkTie(){
    if(emptySquares().length == 0){
        for (var i = 0; i < cells.length; i++){
            cells[i].style.backgroundColor = "green";
            cells[i].removeEventListener("click", turnClick, false);
        }
        declareWinner("Tie Game!")
        return true;
    }
    return false;
}

function minimax(newBoard, player) {
	var availSpots = emptySquares(newBoard);

	if (checkWin(newBoard, humanplayer)) {
		return {score: -10};
	} else if (checkWin(newBoard, AIplayer)) {
		return {score: 20};
	} else if (availSpots.length === 0) {
		return {score: 0};
	}

	var moves = [];
	for (var i = 0; i < availSpots.length; i++) {
		var move = {};
		move.index = newBoard[availSpots[i]];
		newBoard[availSpots[i]] = player;

		if (player == AIplayer) {
			var result = minimax(newBoard, humanplayer);
			move.score = result.score;
		} 
        else {
			var result = minimax(newBoard, AIplayer);
			move.score = result.score;
		}

		newBoard[availSpots[i]] = move.index;

		moves.push(move);
	}

	var bestMove;
	if(player === AIplayer) {
		var bestScore = -10000;
		for(var i = 0; i < moves.length; i++) {
			if (moves[i].score > bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	} 
    else {
		var bestScore = 10000;
		for(var i = 0; i < moves.length; i++) {
			if (moves[i].score < bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	}

	return moves[bestMove];
}