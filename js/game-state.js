// Import story nodes
import { storyNodes } from "./story.js"
import { popUp } from "./ui-handlers.js"

// Game state object
let gameState = {
	mentalHealth: 100,
	projectProgress: 0,
	currentNode: "start",
	history: [],
	shastaCola: 100,
	balance: 25,
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
		balance: 25,
		eventActive: false,
		gameOver: false,
		shastaInterval: null,
		eventInterval: null,
	}

	return gameState
}

// Handle player choice
function makeChoice(choice) {
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

	checkMoney()

	// Move to next node
	gameState.currentNode = choice.nextNode
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

function checkMoney() {
	if (gameState.balance < 0) {
		gameState.balance = 0
	}
}

// Export functions and state
export { gameState, initGameState, makeChoice, decreaseShastaCola, drinkShastaCola }
