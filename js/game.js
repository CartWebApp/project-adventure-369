// Import dependencies
import { gameState, initGameState, decreaseShastaCola as decreaseShastaColaState } from "./game-state.js"
import { updateShastaCola as updateShastaColaUI, UI } from "./ui-handlers.js"
import { triggerRandomEvent } from "./events.js"
import { storyNodes } from "./story.js"

let UIManager = new UI(storyNodes.start.text)

// Initialize the game
function initGame() {
	// Initialize game state
	initGameState()

	// Initialize UIK
	UIManager.init()

	// Start game systems
	initGameSystems(UIManager)
}

// Initialize game systems (timers, etc.)
function initGameSystems(ui) {
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
		ui.updateGameDisplay() // Update display if mental health changed
	}, 2000)

	// Start random events based on mental health
	gameState.eventInterval = setInterval(() => {
		if (!gameState.eventActive && gameState.mentalHealth < 70) {
			const eventChance = (70 - gameState.mentalHealth) / 100
			if (Math.random() < eventChance) {
				triggerRandomEvent()
			}
		}
	}, 2000)
}

function getUIManager() {
	return UIManager;
}

// Initialize the game when the page loads
window.addEventListener("load", initGame)

// Export the init function for restart functionality
export { initGame, getUIManager }