// Import dependencies
import { gameState, makeChoice, drinkShastaCola } from "./game-state.js"
import { storyNodes } from "./story.js"
import { triggerTrainAnimation } from "./events.js"

let endScreen = false;

function typeWriter(text, index) {
	if (index < text.length) {
		document.getElementById("story-text").innerHTML += text.charAt(index);
		setTimeout(function () {
			typeWriter(text, index + 1);
		}, 100); // Delay of 100ms
	}
}

// Update the game display based on current state
function updateGameDisplay() {
	const storyTextElement = document.getElementById("story-text")
	const choicesContainer = document.getElementById("choices-container")
	const mentalHealthBar = document.getElementById("mental-health-bar")
	const progressBar = document.getElementById("progress-bar")
	const shastaColaBar = document.getElementById("shasta-cola-bar")
	const incomeAmount = document.getElementById("income-amount")

	// Check if mental health has reached zero
	if (gameState.mentalHealth <= 0 && !gameState.gameOver) {
		gameState.gameOver = true
		triggerTrainAnimation()
		return
	}

	// Clear previous content
	choicesContainer.innerHTML = ""

	// Get current node
	const currentNode = storyNodes[gameState.currentNode]

	// Update story text
	if (gameState.history.length > 0) {
		let historyHtml = ""
		gameState.history.forEach((text) => {
			historyHtml += `<p>${text}</p>`
		})
		storyTextElement.innerHTML = historyHtml + `<p>${currentNode.text}</p>`
	} else {
		storyTextElement.innerHTML = `<p>${currentNode.text}</p>`
	}

	// Scroll to bottom of story container
	const storyContainer = document.getElementById("story-container")
	storyContainer.scrollTop = storyContainer.scrollHeight

	// Update status bars
	mentalHealthBar.style.width = `${Math.max(0, Math.min(100, gameState.mentalHealth))}%`
	progressBar.style.width = `${Math.max(0, Math.min(100, gameState.projectProgress))}%`
	shastaColaBar.style.height = `${gameState.shastaCola}%`

	// Update income
	incomeAmount.textContent = gameState.income

	// Change mental health bar color based on value
	if (gameState.mentalHealth < 30) {
		mentalHealthBar.style.backgroundColor = "#ff3333" // Red for low health
	} else if (gameState.mentalHealth < 60) {
		mentalHealthBar.style.backgroundColor = "#ffcc33" // Yellow for medium health
	} else {
		mentalHealthBar.style.backgroundColor = "#33cc33" // Green for good health
	}

	// If this is an ending node
	if (currentNode.ending) {
		// Display ending
		const endingElement = document.createElement("div")
		endingElement.className = "ending"
		endingElement.textContent = currentNode.ending
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

	// Add choices
	if (!gameState.eventActive) {
		currentNode.choices.forEach((choice) => {
			const choiceButton = document.createElement("button")
			choiceButton.className = "choice-btn"
			choiceButton.textContent = choice.text
			choiceButton.addEventListener("click", () => {
				makeChoice(choice)
				updateGameDisplay()
			})
			choicesContainer.appendChild(choiceButton)
		})
	}
}

// Update Shasta Cola bar
function updateShastaCola() {
	const shastaColaBar = document.getElementById("shasta-cola-bar")
	shastaColaBar.style.height = `${gameState.shastaCola}%`
}

// Update income display
function updateIncome() {
	const incomeAmount = document.getElementById("income-amount")
	incomeAmount.textContent = gameState.income
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
			updateIncome()
		} else {
			showMessage("Not enough money for Diet Shasta Cola!")
		}
	})

	// Add window button functionality
	const windowButtons = document.querySelectorAll("#windowButtons p")

	// Close button (X)
	windowButtons[2].addEventListener("click", () => {
		if (confirm("Are you sure you want to close the game?")) {
			document.body.innerHTML =
				'<div style="color: white; text-align: center; margin-top: 100px;"><h1>Game Closed</h1><p>Refresh the page to restart</p></div>'
		}
	})

	// Minimize button (_)
	windowButtons[0].addEventListener("click", () => {
		if (gameContainer.style.display === "none") {
			gameContainer.style.display = "block"
		} else {
			gameContainer.style.display = "none"
		}
	})

	// Maximize button (□)
	windowButtons[1].addEventListener("click", () => {
		const container = document.querySelector(".container")
		if (container.style.maxWidth === "100%") {
			container.style.maxWidth = "800px"
		} else {
			container.style.maxWidth = "100%"
		}
	})

	// Update game display
	updateGameDisplay()
}

function getEnding() {
	return endScreen
}

// Export UI functions
export { updateGameDisplay, updateShastaCola, updateIncome, showMessage, showGameOver, initUI, getEnding }
