// Import dependencies
import { gameState, initGameState, decreaseShastaCola as decreaseShastaColaState } from "./game-state.js"
import { updateShastaCola as updateShastaColaUI, UI } from "./ui-handlers.js"
import { triggerRandomEvent } from "./events.js"
import { storyNodes } from "./story.js"

let UIManager = new UI(storyNodes.start.text)

// Initialize the game
function initGame() {
	document.getElementById("backgroundMusic").volume = 0.3;

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
	}, 2000)

	setInterval(() => {
		ui.updateGameDisplay();
	}, 100)

	// Start random events based on mental health
	gameState.eventInterval = setInterval(() => {
		if (!gameState.eventActive && gameState.mentalHealth < 70) {
			const eventChance = (70 - gameState.mentalHealth) / 100
			if (Math.random() < eventChance) {
				triggerRandomEvent()
			}
		}
	}, 3500)
}

function getUIManager() {
	return UIManager;
}

// Initialize the game when the page loads
document.getElementById("startGame").addEventListener("click", () => {
	document.getElementById("game-container").classList.remove("hidden");
	document.getElementById("settings-container").classList.add("hidden");
	initGame();
});

// Export the init function for restart functionality
export { initGame, getUIManager }