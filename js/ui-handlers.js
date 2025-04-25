// Import dependencies
import { gameState, makeChoice, drinkShastaCola } from "./game-state.js"
import { storyNodes } from "./story.js"
import { triggerTrainAnimation } from "./events.js"

let endScreen = false;
let typeWriterRunning = false;

export class UI {
	constructor(initMessage) {
		this.initMessage = initMessage;
	}

	async init() {
		let t = await this.typeWriter(this.initMessage, 0);
		this.createButton(storyNodes[gameState.currentNode]);
	}

	typeWriter(text, index) {
		typeWriterRunning = true
		if (index == 0) {
			let out = document.createElement("p");
			document.getElementById("story-text").appendChild(out)
		}

		if (index < text.length) {
			document.getElementById("story-text").children[document.getElementById("story-text").children.length-1].innerHTML += text.charAt(index);
			setTimeout(() => {
				this.typeWriter(text, index + 1)
			}, 50); // Delay of 100ms
		}
		typeWriterRunning = false
	}

	updateGameDisplay() {
		const mentalHealthBar = document.getElementById("mental-health-bar")
		const shastaColaBar = document.getElementById("shasta-cola-bar")
		const balanceAmount = document.getElementById("balance-amount")

		if (gameState.mentalHealth <= 0 && !gameState.gameOver) {
			gameState.gameOver = true
			triggerTrainAnimation()
			return
		}

		// Get current node
		this.currentNode = storyNodes[gameState.currentNode]

		// Scroll to bottom of story container
		const storyContainer = document.getElementById("story-container")
		storyContainer.scrollTop = storyContainer.scrollHeight

		// Update status bars
		mentalHealthBar.style.width = `${Math.max(0, Math.min(100, gameState.mentalHealth))}%`
		shastaColaBar.style.height = `${gameState.shastaCola}%`

		// Update balance
		balanceAmount.textContent = gameState.balance

		// Change mental health bar color based on value
		if (gameState.mentalHealth < 30) {
			mentalHealthBar.style.backgroundColor = "#ff3333" // Red for low health
		} else if (gameState.mentalHealth < 60) {
			mentalHealthBar.style.backgroundColor = "#ffcc33" // Yellow for medium health
		} else {
			mentalHealthBar.style.backgroundColor = "#33cc33" // Green for good health
		}

		// If this is an ending node
		if (this.currentNode.ending) {
			// Display ending
			const endingElement = document.createElement("div")
			endingElement.className = "ending"
			endingElement.textContent = this.currentNode.ending
			choicesContainer.appendChild(endingElement)

			// Add restart button
			const restartButton = document.createElement("button")
			restartButton.className = "restart-btn"
			restartButton.textContent = "Restart Game"
			restartButton.addEventListener("click", () => {window.location.reload()})
			choicesContainer.appendChild(restartButton)

			endScreen = true;

			return
		}
	}

	updateStoryText() {
		this.createButton(storyNodes[gameState.currentNode])
		this.typeWriter(storyNodes[gameState.currentNode].text, 0)
	}

	createButton(node) {
		const choicesContainer = document.getElementById("choices-container")

		choicesContainer.innerHTML = ""

		if (!gameState.eventActive) {
			console.log("Generating buttons")
			node.choices.forEach((choice) => {
				const choiceButton = document.createElement("button")
				choiceButton.className = "choice-btn"
				choiceButton.textContent = choice.text
				choiceButton.addEventListener("click", () => {
					this.makeChoice(choice)
					this.updateStoryText()
				})
				choicesContainer.appendChild(choiceButton)
			})
		}
	}

	makeChoice(choice) {
		if (gameState.eventActive) return
	
		// Add current node text to history
		gameState.history.push(storyNodes[gameState.currentNode].text)
	
		// Update mental health and project progress if specified
		if (choice.mentalHealth) {
			gameState.mentalHealth += choice.mentalHealth
		}
	
		if (choice.projectProgress) {
			gameState.projectProgress += choice.projectProgress
		}
	
		// Update balance based on choice
		if (choice.balance) {
			gameState.balance += choice.balance
		} else {
			// Default balance change based on the choice type
			if (choice.nextNode.includes("job") || choice.nextNode.includes("work")) {
				gameState.balance += Math.floor(Math.random() * 50) + 20
			} else if (choice.nextNode.includes("homeless") || choice.nextNode.includes("give_up")) {
				gameState.balance -= Math.floor(Math.random() * 30) + 10
			}
		}
	
		this.checkMoney()
	
		// Move to next node
		console.log(choice.nextNode)
		gameState.currentNode = choice.nextNode
	}
	
	checkMoney() {
		if (gameState.balance < 0) {
			gameState.balance = 0
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

function getEnding() {
	return endScreen
}

// Export UI functions
export { updateShastaCola, updatebalance, showMessage, showGameOver, getEnding }
