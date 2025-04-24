// Import dependencies
import { gameState, initGameState, decreaseShastaCola as decreaseShastaColaState } from "./game-state.js"
import { updateShastaCola as updateShastaColaUI, initUI, updateGameDisplay } from "./ui-handlers.js"
import { triggerRandomEvent } from "./events.js"

// Initialize the game
function initGame() {
	// Initialize game state
	initGameState()

	// Initialize UI
	initUI()

	// Start game systems
	initGameSystems()
}

// Initialize game systems (timers, etc.)
function initGameSystems() {
	// Clear any existing intervals
	if (gameState.shastaInterval) {
		clearInterval(gameState.shastaInterval)
	}

	if (gameState.eventInterval) {
		clearInterval(gameState.eventInterval)
	}

	// Start decreasing Shasta Cola over time
	gameState.shastaInterval = setInterval(() => {
		decreaseShastaColaState()
		updateShastaColaUI()
		if (!gameState.eventActive) {
			updateGameDisplay() // Update display if mental health changed
		}
	}, 2000)

	// Start random events based on mental health
	gameState.eventInterval = setInterval(() => {
		if (!gameState.eventActive && gameState.mentalHealth < 70) {
			const eventChance = (70 - gameState.mentalHealth) / 100
			if (Math.random() < eventChance) {
				triggerRandomEvent()
			}
		}
	}, 10000)
}

// Add window button functionality
window.addEventListener("load", () => {
	const windowButtons = document.querySelectorAll("#windowButtons p")

	// // Close button (X)
	// windowButtons[2].addEventListener("click", () => {
	// 	if (confirm("Are you sure you want to close the game?")) {
	// 		document.body.innerHTML =
	// 			'<div style="color: white; text-align: center; margin-top: 100px;"><h1>Game Closed</h1><p>Refresh the page to </p></div>'
	// 	}
	// })

	// // Minimize button (_)
	// windowButtons[0].addEventListener("click", () => {
	// 	const gameContainer = document.getElementById("game-container")
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
})

// Initialize the game when the page loads
window.addEventListener("load", initGame)

// Export the init function for restart functionality
export { initGame }