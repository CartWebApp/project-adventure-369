// Import dependencies
import { gameState } from "./game-state.js"
import { storyNodes } from "./story.js"
import { triggerTrainAnimation } from "./events.js"

let endScreen = false;

function getRandomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min) + min);
}

export class UI {
	constructor(initMessage) {
		this.initMessage = initMessage;
	}

	async init() {
		await this.typeWriter(this.initMessage, 0);
		this.createButton(storyNodes[gameState.currentNode]);
		this.updateGameDisplay();
	}

	typeWriter(text, index) {
		return new Promise((resolve) => {
			if (index == 0) {
				let out = document.createElement("p");
				out.classList.add("story-text-element");
				document.getElementById("story-text").appendChild(out);
			}
	
			const typeChar = (i) => {
				if (i < text.length) {
					document.getElementsByClassName("story-text-element")[document.getElementsByClassName("story-text-element").length - 1].innerHTML += text.charAt(i);
					setTimeout(() => {
						typeChar(i + 1);
					}, getRandomInt(20, 50));
				} else {
					resolve(); // resolve when finished
				}
			};
	
			typeChar(index);
		});
	}

	updateGameDisplay() {
		const mentalHealthBar = document.getElementById("mental-health-bar")
		const shastaColaBar = document.getElementById("shasta-cola-bar")
		const balanceAmount = document.getElementById("balance-amount")
		const choicesContainer = document.getElementById("choices-container")

		updateShastaCola()
		updatebalance()

		if (gameState.mentalHealth <= 0 && !gameState.gameOver) {
			gameState.gameOver = true
			triggerTrainAnimation();
			this.clearAllOverlays();
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
			document.getElementById("overlayContainer").classList.add("schizoEpisode");
		} else {
			mentalHealthBar.style.backgroundColor = "#33cc33" // Green for good health

			if (document.getElementById("overlayContainer").classList.contains("schizoEpisode")) document.getElementById("overlayContainer").classList.remove("schizoEpisode");
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

	async updateStoryText() {
		const choicesContainer = document.getElementById("choices-container")
		choicesContainer.innerHTML = ""

		await this.typeWriter(storyNodes[gameState.currentNode].text, 0)
		this.createButton(storyNodes[gameState.currentNode])
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
	
		this.checkMoney()

		let out = document.createElement("p");
		out.classList.add("choice-message")
		document.getElementById("story-text").appendChild(out);

		document.getElementsByClassName("choice-message")[document.getElementsByClassName("choice-message").length - 1].innerText = choice.text;

	
		// Move to next node
		console.log(choice.nextNode)
		gameState.currentNode = choice.nextNode
	}
	
	checkMoney() {
		if (gameState.balance < 0) {
			gameState.balance = 0
		}
	}

	clearAllOverlays() {
		document.getElementById("glowie-container").classList.remove("active");
		document.getElementById("glowie-container").classList.add("hidden");
	}
}

document.addEventListener("keypress", (event) => {
	document.getElementById("keystroke").innerText = event.key;
})

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

document.getElementById("soda-button").addEventListener("click", () => {
	updateShastaCola();
	updatebalance();
});

function getEnding() {
	return endScreen
}

document.body.addEventListener("click", () => {
	const audio = document.getElementById("backgroundMusic");
	audio.play();
});

// Export UI functions
export { updateShastaCola, updatebalance, showMessage, showGameOver, getEnding }
