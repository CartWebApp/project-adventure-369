// Import dependencies
import { gameState } from "./game-state.js"
import { updateGameDisplay, updatebalance, showMessage, showGameOver, getEnding } from "./ui-handlers.js"

// Trigger a random event
function triggerRandomEvent() {
	console.log("random event")
	if (gameState.eventActive) return
	if (getEnding()) return

	const eventType = Math.random() > 0.5 ? "glowie" : "parrot"

	if (eventType === "glowie") {
		triggerGlowieEvent()
	} else {
		triggerParrotEvent()
	}
}

// Trigger the CIA Glowie event
function triggerGlowieEvent() {
	gameState.eventActive = true
	const glowieContainer = document.getElementById("glowie-container")
	const glowie = document.getElementById("glowie")
	const clicksNeeded = Math.floor(Math.random() * 5) + 3 // 3-7 clicks
	let clicksRemaining = clicksNeeded

	// Add overlay
	document.body.classList.add("overlay")

	// Position glowie randomly
	repositionGlowie()

	// Show glowie
	glowieContainer.classList.remove("hidden")
	glowieContainer.classList.add("active")

	// Show message
	showMessage("A CIA Glowie has appeared! Click him " + clicksNeeded + " times to make him go away!")

	// Add click event
	glowie.addEventListener("click", handleGlowieClick)

	function handleGlowieClick() {
		clicksRemaining--

		if (clicksRemaining > 0) {
			repositionGlowie()
			showMessage("Glowie clicks remaining: " + clicksRemaining)
		} else {
			// Remove glowie
			glowieContainer.classList.add("hidden")
			glowieContainer.classList.remove("active")
			glowie.removeEventListener("click", handleGlowieClick)
			gameState.eventActive = false
			document.body.classList.remove("overlay")
			showMessage("The CIA Glowie has disappeared!")
		}
	}

	function repositionGlowie() {
		const gameContainer = document.getElementById("game-container")
		const maxX = gameContainer.offsetWidth - 60
		const maxY = gameContainer.offsetHeight - 60

		const randomX = Math.floor(Math.random() * maxX)
		const randomY = Math.floor(Math.random() * maxY)

		glowie.style.left = randomX + "px"
		glowie.style.top = randomY + "px"
	}
}

// Trigger the parrot event
function triggerParrotEvent() {
	gameState.eventActive = true
	const parrotContainer = document.getElementById("parrot-container")
	const parrot = document.getElementById("parrot")

	// Randomly decide if parrot comes from left or right
	const fromLeft = Math.random() < 0.5

	// Position parrot at the edge of the window (not just the game container)
	if (fromLeft) {
		parrot.style.left = "-80px"
		parrot.style.transform = "scaleX(1)" // Normal direction
	} else {
		parrot.style.left = window.innerWidth + "px"
		parrot.style.transform = "scaleX(-1)" // Flip horizontally
	}

	// Position vertically in the middle area of the screen
	parrot.style.top = Math.floor(Math.random() * (window.innerHeight - 200)) + 100 + "px"

	// Show parrot
	parrotContainer.classList.remove("hidden")
	parrotContainer.classList.add("active")

	// Show message
	showMessage("A parrot is flying across the screen! Click it before it escapes!")

	// Add click event
	parrot.addEventListener("click", handleParrotClick)

	// Start moving parrot - make it faster (5-10 pixels per frame)
	const speed = Math.random() * Math.floor(Math.random() * (20 - 10 + 1) + 10) + Math.floor(Math.random() * (20 - 10 + 1) + 10);
	const parrotAnimation = setInterval(moveParrot, 30)

	function moveParrot() {
		const currentLeft = Number.parseInt(parrot.style.left)

		if ((fromLeft && currentLeft > window.innerWidth) || (!fromLeft && currentLeft < -80)) {
			// Parrot escaped
			clearInterval(parrotAnimation)
			parrotContainer.classList.add("hidden")
			parrotContainer.classList.remove("active")
			parrot.removeEventListener("click", handleParrotClick)
			gameState.eventActive = false
			document.body.classList.remove("overlay")

			// Penalty
			gameState.mentalHealth -= 10
			updateGameDisplay()
			showMessage("The parrot escaped! Your mental health decreased!")
		} else {
			// Move parrot
			parrot.style.left = currentLeft + (fromLeft ? speed : -speed) + "px"
		}
	}

	function handleParrotClick() {
		// Stop parrot animation
		clearInterval(parrotAnimation)

		// Remove parrot
		parrotContainer.classList.add("hidden")
		parrotContainer.classList.remove("active")
		parrot.removeEventListener("click", handleParrotClick)
		gameState.eventActive = false
		document.body.classList.remove("overlay")

		// Reward
		gameState.balance += 15
		updatebalance()
		showMessage("You caught the parrot! +$15")
	}
}

// Trigger the train animation
function triggerTrainAnimation() {
	const trainContainer = document.getElementById("train-container")
	const train = document.getElementById("train")
	const gameContainer = document.getElementById("game-container")
	const gameContainerWindowBar = document.getElementById("windowButtons")

	// Show train container
	trainContainer.style.display = "block"

	// Determine random side (0: left, 1: right) - only horizontal movement now
	const side = Math.random() < 0.5 ? 0 : 1

	let startPos, endPos

	switch (side) {
		case 0: // Left
			train.style.top = "50%"
			train.style.left = "-300px"
			train.style.transform = "translateY(-50%)"
			startPos = -300
			endPos = window.innerWidth + 300

			// Animate train
			const animateFromLeft = () => {
				startPos += 10
				train.style.left = startPos + "px"

				// Push game container
				if (startPos > 100) {
					gameContainer.style.transform = `translateX(${startPos - 100}px)`
					gameContainerWindowBar.style.transform = `translateX(${startPos - 100}px)`
				}

				if (startPos < endPos) {
					requestAnimationFrame(animateFromLeft)
				} else {
					showGameOver()
				}
			}

			requestAnimationFrame(animateFromLeft)
			break

		case 1: // Right
			train.style.top = "50%"
			train.style.left = window.innerWidth + "px"
			train.style.transform = "translateY(-50%) scaleX(-1)"
			startPos = window.innerWidth + 300
			endPos = -300

			// Animate train
			const animateFromRight = () => {
				startPos -= 10
				train.style.left = startPos + "px"

				// Push game container
				if (startPos < window.innerWidth - 100) {
					gameContainer.style.transform = `translateX(${startPos - window.innerWidth + 100}px)`
				}

				if (startPos > endPos) {
					requestAnimationFrame(animateFromRight)
				} else {
					showGameOver()
				}
			}

			requestAnimationFrame(animateFromRight)
			break
	}
}

// Export event functions
export { triggerRandomEvent, triggerGlowieEvent, triggerParrotEvent, triggerTrainAnimation }
