// Game state object
let gameState = {
	mentalHealth: 100,
	projectProgress: 0,
	currentNode: "start",
	history: [],
	shastaCola: 100,
	balance: 50,
	eventActive: false,
	shastaInterval: null,
	eventInterval: null,
	gameOver: false,
}

// Initialize the game state
function initGameState() {
	gameState = {
		mentalHealth: 100,
		projectProgress: 0,
		currentNode: "start",
		history: [],
		shastaCola: 100,
		balance: 50,
		eventActive: false,
		gameOver: false,
		shastaInterval: null,
		eventInterval: null,
	}

	return gameState
}

// Decrease Shasta Cola level
function decreaseShastaCola() {
	gameState.shastaCola -= 10

	if (gameState.shastaCola <= 0) {
		gameState.shastaCola = 0
		gameState.mentalHealth -= 10
	}
}

// Drink Shasta Cola
function drinkShastaCola() {
	if (gameState.eventActive) return

	// popUp(null, "5")

	if (gameState.balance >= 5) {
		gameState.balance -= 5
		gameState.shastaCola = Math.min(100, gameState.shastaCola + 30)
		return true
	}

	return false
}


document.getElementById("soda-button").addEventListener("click", () => {
	drinkShastaCola();
});


// Export functions and state
export { gameState, initGameState, decreaseShastaCola, drinkShastaCola }
