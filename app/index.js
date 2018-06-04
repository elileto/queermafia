//Includes
const Booster = require('./booster.js');
const Boss = require('./boss.js');

//varibles
const TOTALBOOSTERS = 9;
const LEVELS = 3;
let level = 1;
const boxWidth = 133;
const boxHeight = 133;
let boxX = 0;
let boxY = 0;
let boxNum = 0;
let rows = 3;
let cols = 3;

let points = 0;
let timer;
let multiplier = 1;
let canvasOne = document.getElementById('canvas-1');
let elem = document.getElementById("message-box");

const boosterImages = [];
const boosters = [];
boosters[0] = new Booster("Gay Agenda", 2, 10, 10000);
boosters[1] = new Booster("Rainbow Potion", 3, 50, 20000);
boosters[2] = new Booster("Drag Disguise", 4, 75, 10000);
boosters[3] = new Booster("Unihorn", 5, 100, 20000);
boosters[4] = new Booster("Fairy Dust", 6, 150, 25000);
boosters[5] = new Booster("Babadook", 7, 200, 20000);
boosters[6] = new Booster(1, 0, 0);
boosters[7] = new Booster(1, 0, 0);
boosters[8] = new Booster(1, 0, 0);

const bosses = [];
bosses[0] = new Boss("Homophobes", 1000, "boss.gif");
bosses[1] = new Boss("Bestboro Waptist Church", 2000, "trumpcheeto.gif");
bosses[2] = new Boss("Trumpcheeto", 3000, "trumpcheeto.gif");


let currentBoss = bosses[level - 1];
let hp = currentBoss.hp;
let totalHP = currentBoss.hp;
let bossImage = currentBoss.image;

let boxes = [];

for (let i = 0; i < TOTALBOOSTERS; i++) {
	boxes[i] = {
		width: boxWidth,
		height: boxHeight
	}
}

let setBoxes = function () {
	for (let i = 0; i < rows; i++) {
		for (let j = 0; j < cols; j++) {
			boxes[boxNum].x = (j * boxWidth);
			boxes[boxNum].y = (i * boxHeight);
			boxes[boxNum].num = boxNum;
			boxNum++;
		}
	}
}

let posX = 0;
let posY = 0;

let images = ['gayagenda-pixel.png', 'rainbow-potion-pixel.png', 'drag-disguise-pixel.png', 'horn-pixel.png',
	'fairy-pixel.png', 'babadook.png', 'empty.jpg', 'empty.jpg', 'empty.jpg'
];

for (let i = 0; i < TOTALBOOSTERS; i++) {
	boosterImages[i] = {
		background: 'item-holder.png'
	}
}

for (let i = 0; i < TOTALBOOSTERS; i++) {
	boosterImages[i].name = images[i];
	boosterImages[i].posX = posX;
	boosterImages[i].posY = posY;
	posX += 133;
	if (posX >= 399) {
		posX = 0;
		posY += 133;
	}
}


let message = (text) => {
	var node = document.createElement("li");
	var textnode = document.createTextNode(text);
	node.appendChild(textnode);
	document.getElementById("text-list").appendChild(node);
	scrollToBottom();
}

function scrollToBottom() {
	elem.scrollTop = elem.scrollHeight;
}





window.onload = () => {

	setBoxes();

	//SAVED GAME OR NEW GAME
	console.log("Loading game....");
	message("Loading Game...");
	try {
		const loadedData = JSON.parse(localStorage.getItem("save"));
		console.log("Loading complete....");
		message("Loading complete...");
		if (typeof loadedData.points !== "undefined") {
			points = loadedData.points;
			document.getElementById("points").textContent = points;
		}
	} catch (error) {
		console.error(error);
	}
	///////////////////////////
	let contextOne = canvasOne.getContext("2d");

	for (let i = 0; i < TOTALBOOSTERS; i++) {
		let background = new Image();
		background.src = boosterImages[i].background;
		background.onload = function () {
			contextOne.drawImage(background, boosterImages[i].posX, boosterImages[i].posY);
		}
	}

	for (let j = 0; j < TOTALBOOSTERS; j++) {
		let img = new Image();
		img.src = boosterImages[j].name;
		img.onload = function () {
			contextOne.drawImage(img, boosterImages[j].posX, boosterImages[j].posY);
		}
	}



	document.getElementById("canvas-1").style.cursor = "pointer";

}
/*
let drawCanvas = () => {


	}
*/

function getBooster(aCanvasX, aCanvasY) {
	let context = canvasOne.getContext('2d');
	for (let i = 0; i < boxes.length; i++) {
		if (Math.abs(boxes[i].x - aCanvasX) < boxes[i].width &&
			Math.abs(boxes[i].y - aCanvasY) < boxes[i].height) return boxes[i].num;
	}
	return null;
}

function handleMouseDown(e) {

	var rect = canvasOne.getBoundingClientRect();
	var canvasX = e.pageX - rect.left;
	var canvasY = e.pageY - rect.top;
	let boosterBeingClicked = getBooster(canvasX, canvasY);

	if (boosterBeingClicked != null) {
		document.addEventListener("mouseup", handleMouseUp, true);
		activateBooster(boosterBeingClicked);
	}
	e.stopPropagation();
	e.preventDefault();
}

let activateBooster = (num) => {
	let context = canvasOne.getContext('2d');

	let cost = boosters[num].cost;
	if (points >= cost) {
		points = points - cost;
		document.getElementById("points").textContent = points;
		boosters[num].activated = true;
		while (boosters[num].activated) {
			context.fillStyle = 'rgba(225,225,225,0.5)';
			context.fillRect(boxes[num].x, boxes[num].y, boxes[num].width, boxes[num].height);
			multiplier += boosters[num].multiplier;
			document.getElementById("multiplier").textContent = multiplier;
			let response = "Multiplier x" + boosters[num].multiplier + " activated for " + boosters[num].timer / 1000 + "sec";
			message(response);
			setTimeout(function () {
				multiplier -= boosters[num].multiplier;
				document.getElementById("multiplier").textContent = multiplier;
				boosters[num].activated = false;
				context.fillStyle = 'rgba(225,225,225,0.5)';
				let background = new Image();
				let img = new Image();
				background.src = boosterImages[num].background;
				img.src = boosterImages[num].name;
				background.onload = function () {
					context.drawImage(background, boosterImages[num].posX, boosterImages[num].posY);
				}
				img.onload = function () {
					context.drawImage(img, boosterImages[num].posX, boosterImages[num].posY);
				}
			}, boosters[num].timer);
			boosters[num].activated = false;

		}
	} else {
		message("NOT ENOUGH POINTS");
	}
}

function handleMouseUp(e) {
	e.stopPropagation();
	$("#canvas-1").off("mouseup", handleMouseUp); 

}

document.addEventListener('DOMContentLoaded', function () {
	document.getElementById("canvas-1").addEventListener("mousedown", handleMouseDown);

});


document.getElementById("clickButton").addEventListener('click', () => {
	document.getElementById("character-overlay").style.display = "block";

	setTimeout(function () {
		document.getElementById("character-overlay").style.display = "none";
	}, 500);
	points += multiplier;
	document.getElementById("points").textContent = points;
});


//Attack Boss
document.getElementById("attackButton").addEventListener('click', () => {
	if (points >= 25) {
		points = points - 25;
		hp = hp - 20;
		document.getElementById("points").textContent = points;
		document.getElementById("boss-overlay").style.display = "block";

		setTimeout(function () {
			document.getElementById("boss-overlay").style.display = "none";
		}, 500);
		document.getElementById("progress-bar").style.width = (hp / totalHP * 100) + "%";
		document.getElementById("hp").textContent = hp;
		if (hp <= 0) {
			let response = "YOU DEFEATED " + currentBoss.name + "!!!";
			message(response);
			level++;
			if (level <= LEVELS) {
				currentBoss = bosses[level - 1];
				hp = currentBoss.hp;
				totalHP = currentBoss.hp;
				document.getElementById("hp").textContent = totalHP;
				document.getElementById("progress-bar").style.width = '100%';
				document.getElementById("boss-image").src = currentBoss.image;

			} else {
				message("In a display of true pride and gayness you have defeated all who oppose you.");
				message("Go forth and conquer oh gay one.");
				message("The End...");
			}
		}
	}
	else {
		message("NOT ENOUGH POWER");
	}
});





//SAVE GAME //


document.getElementById("save").addEventListener('click', () => {
	saveGame();
});

function saveGame() {
	message("Attempting to save game...");
	console.log("Attempting Save...");
	let save = {
		points: points
	}
	try {
		localStorage.setItem("save", JSON.stringify(save));
		message("Save complete...");
		console.log("Save Complete...");
	} catch (error) {
		console.error(error);
	}
}

export function cheatFunction(code) {
	if (code === "reset") {
		resetGame();
	} else if (code === "1000points") {
		points += 1000;
		document.getElementById("points").textContent = points;
	}
}

let resetGame = () => {
	message("Resetting Game...");
	try {
		points = 0;
		level = 1;
		currentBoss = bosses[level - 1];
		hp = currentBoss.hp;
		totalHP = currentBoss.hp;
		document.getElementById("hp").textContent = totalHP;
		document.getElementById("progress-bar").style.width = '100%';
		document.getElementById("points").textContent = points;
		message("Game Reset");
	} catch (error) {
		message("Error reseting game");
		console.error(error);

	}
}
