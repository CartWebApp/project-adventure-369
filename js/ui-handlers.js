// Import dependencies
import { gameState, makeChoice, drinkShastaCola } from "./game-state.js"
import { storyNodes } from "./story.js"
import { triggerTrainAnimation } from "./events.js"

let endScreen = false;

export class UI {
	constructor(initMessage) {
		this.initMessage = initMessage;
	}

	init() {
		this.typeWriter(this.initMessage, 0);
	}

	typeWriter(text, index) {
		console.log("type")
		if (index < text.length) {
			document.getElementById("story-text").innerHTML += text.charAt(index);
			setTimeout(this.typeWriter(text, index + 1)); // Delay of 100ms
		}
	}
}

document.addEventListener("keypress", (event) => {
	document.getElementById("keystroke").innerText = event.key;
})

function getPos(obj) {
    if (!obj) return;
    let objBox = obj.getBoundingClientRect();
    let pos = {};
    pos.top = objBox.top
    pos.bottom = objBox.bottom
    pos.left = objBox.left
    pos.Right = objBox.Right
    return pos;
}

// Update the game display based on current state
function updateGameDisplay() {
	const storyTextElement = document.getElementById("story-text")
	const choicesContainer = document.getElementById("choices-container")
	const mentalHealthBar = document.getElementById("mental-health-bar")
	const shastaColaBar = document.getElementById("shasta-cola-bar")
	const balanceAmount = document.getElementById("balance-amount")

	// Check if mental health has reached zero
	if (gameState.mentalHealth <= 0 && !gameState.gameOver) {
		gameState.gameOver = true
		triggerTrainAnimation()
		return
	}
}

// Update Shasta Cola bar
function updateShastaCola() {
	const shastaColaBar = document.getElementById("shasta-cola-bar")
	shastaColaBar.style.height = `${gameState.shastaCola}%`
}

// Update balance display
function updatebalance() {
	const balanceAmount = document.getElementById("balance-amount")
	balanceAmount.textContent = gameState.balance
}

// Show message in the story text area
function showMessage(message) {
	const storyText = document.getElementById("story-text")
	storyText.innerHTML += `<p class="message">${message}</p>`

	// Scroll to bottom of story container
	const storyContainer = document.getElementById("story-container")
	storyContainer.scrollTop = storyContainer.scrollHeight
}

// Show game over message
function showGameOver() {
	const gameOver = document.getElementById("game-over")
	gameOver.style.display = "block"

	endScreen = true;

	// Add event listener to restart button
	document.getElementById("restart-button").addEventListener("click", () => {
		// Reset game container position
		document.getElementById("game-container").style.transform = ""

		// Hide train and game over
		document.getElementById("train-container").style.display = "none"
		gameOver.style.display = "none"

		// Restart game
		window.location.reload();
	})
}

// Initialize UI elements and event listeners
function initUI() {
	// Reset game container position
	const gameContainer = document.getElementById("game-container")
	gameContainer.style.transform = ""

	// Hide train and game over
	document.getElementById("train-container").style.display = "none"
	document.getElementById("game-over").style.display = "none"

	// Add click event for soda button
	const sodaButton = document.getElementById("soda-button")
	sodaButton.addEventListener("click", () => {
		const success = drinkShastaCola()
		if (success) {
			updateShastaCola()
			updatebalance()
		} else {
			showMessage("Not enough money for Diet Shasta Cola!")
		}
	})

	typeWriter(currentNode.text, 0)

	// Add window button functionality
	const windowButtons = document.querySelectorAll("#windowButtons p")

	// Close button (X)
	// windowButtons[2].addEventListener("click", () => {
	// 	if (confirm("Are you sure you want to close the game?")) {
	// 		document.body.innerHTML =
	// 			'<div style="color: white; text-align: center; margin-top: 100px;"><h1>Game Closed</h1><p>Refresh the page to restart</p></div>'
	// 	}
	// })

	// // Minimize button (_)
	// windowButtons[0].addEventListener("click", () => {
	// 	if (gameContainer.style.display === "none") {
	// 		gameContainer.style.display = "block"
	// 	} else {
	// 		gameContainer.style.display = "none"
	// 	}
	// })

	// // Maximize button (□)
	// windowButtons[1].addEventListener("click", () => {
	// 	const container = document.querySelector(".container")
	// 	if (container.style.maxWidth === "100%") {
	// 		container.style.maxWidth = "800px"
	// 	} else {
	// 		container.style.maxWidth = "100%"
	// 	}
	// })

	// Update game display
	updateGameDisplay()
}

function getEnding() {
	return endScreen
}

function popUp(el, text) {
	let popUp = document.createElement("p")
	document.getElementById("popup").appendChild(popUp)
	popUp.classList.add("popUp")
	popUp.style.left = getPos(el)
	popUp.style.right = getPos(el)
	popUp.innerText = text
}

// Export UI functions
export { popUp, updateGameDisplay, updateShastaCola, updatebalance, showMessage, showGameOver, initUI, getEnding }
