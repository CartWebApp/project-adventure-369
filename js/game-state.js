// Import story nodes
import { storyNodes } from "./story.js"

// Game state object
let gameState = {
	mentalHealth: 100,
	projectProgress: 0,
	currentNode: "start",
	history: [],
	shastaCola: 100,
	income: 500,
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
		income: 500,
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

	// Update income based on choice
	if (choice.income) {
		gameState.income += choice.income
	} else {
		// Default income change based on the choice type
		if (choice.nextNode.includes("job") || choice.nextNode.includes("work")) {
			gameState.income += Math.floor(Math.random() * 50) + 20
		} else if (choice.nextNode.includes("homeless") || choice.nextNode.includes("give_up")) {
			gameState.income -= Math.floor(Math.random() * 30) + 10
		}
	}

	// Move to next node
	gameState.currentNode = choice.nextNode
}

// Decrease Shasta Cola level
function decreaseShastaCola() {
	gameState.shastaCola -= 5
	if (gameState.shastaCola <= 0) {
		gameState.shastaCola = 0
		gameState.mentalHealth -= 5
	}
}

// Drink Shasta Cola
function drinkShastaCola() {
	if (gameState.eventActive) return

	if (gameState.income >= 5) {
		gameState.income -= 5
		gameState.shastaCola = Math.min(100, gameState.shastaCola + 30)
		return true
	}

	return false
}

// Export functions and state
export { gameState, initGameState, makeChoice, decreaseShastaCola, drinkShastaCola }
