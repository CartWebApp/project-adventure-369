// Import dependencies
import { gameState, initGameState, decreaseShastaCola as decreaseShastaColaState } from "./game-state.js"
import { updateShastaCola as updateShastaColaUI, UI, updateGameDisplay } from "./ui-handlers.js"
import { triggerRandomEvent } from "./events.js"
import { storyNodes } from "./story.js"

// Initialize the game
function initGame() {
	// Initialize game state
	initGameState()

	// Initialize UI
	new UI(storyNodes.start.text).init()

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

// Initialize the game when the page loads
window.addEventListener("load", initGame)

// Export the init function for restart functionality
export { initGame }