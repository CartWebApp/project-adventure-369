// Import dependencies
import { gameState } from "./game-state.js"
import { showMessage, showGameOver, getEnding } from "./ui-handlers.js"

function randomIntFromInterval(min, max) { // min and max included 
	return Math.floor(Math.random() * (max - min + 1) + min);
}

class Ant {
	constructor() {
		const antContainer = document.getElementById("ant-container");
		this.fromLeft = Math.random() < 0.5;

		this.contain = antContainer;
		this.element = document.createElement("img");

		this.element.classList.add("ant");

        this.element.src = "/assets/ant.gif";
		this.contain.appendChild(this.element);

		this.element.style.left = "-80px";
		this.element.style.transform = "scaleX(1)";
		
		this.element.style.top = Math.floor(Math.random() * (window.innerHeight)) + "px";

		this.move(this.element);
	}

	move(e) {
		const speed = Math.random() * Math.floor(Math.random() * (20 - 10 + 1) + 10) + Math.floor(Math.random() * (20 - 10 + 1) + 10);
	
		this.contain.classList.remove("hidden");
		this.contain.classList.add("active");
	
		e.classList.remove("hidden");
		e.classList.add("show");
	
		const screenWidth = window.innerWidth;
		let startPos, endPos;
	
		if (this.fromLeft) {
			// Start off-screen left
			startPos = -80;
			endPos = screenWidth;
	
			e.style.left = "-80px";
			e.style.transform = "scaleX(1)"; // Normal direction
	
			const animateFromLeft = () => {
				startPos += speed * 0.1; // move to the right
				e.style.transform = `translateX(${startPos}px)`;
	
				if (startPos < endPos) {
					requestAnimationFrame(animateFromLeft);
				} else {
					e.remove(); // cleanup
				}
			};
	
			requestAnimationFrame(animateFromLeft);
		} else {
			// Start off-screen right
			startPos = screenWidth;
			endPos = -screenWidth;
	
			e.style.left = screenWidth + "px";
			e.src = "/assets/antL.gif"
	
			const animateFromRight = () => {
				startPos -= speed * 0.1; // move to the left
				e.style.transform = `translateX(${startPos}px)`;
	
				if (startPos > endPos) {
					requestAnimationFrame(animateFromRight);
				} else {
					e.remove(); // cleanup
				}
			};
	
			requestAnimationFrame(animateFromRight);
		}
	}
}

// Trigger the ant event
function triggerAntEvent() {
	new Audio("/assets/sounds/antcolony.mp3").play();

	for (let i = 0; i < randomIntFromInterval(100, 200); i++) {
		new Ant();
	}
}

// Trigger a random event
function triggerRandomEvent() {
	console.log("random event")
	if (gameState.eventActive) return
	if (gameState.gameOver) return

	const eventType = randomIntFromInterval(1, 3);

	if (eventType === 1) {
		triggerGlowieEvent()
	} else if (eventType === 2) {
		triggerParrotEvent()
	} else {
		triggerAntEvent();
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

	let sfx = new Audio("/assets/sounds/glowie.mp3");
	sfx.volume = 1;
	sfx.play();

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

	let birdAudio = new Audio("/assets/sounds/bird.mp3");
	birdAudio.loop = true;
	birdAudio.play();

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
	const parrotAnimation = setInterval(moveParrot, 40)

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
			showMessage("The parrot escaped! Your mental health decreased!")
			birdAudio.pause();
			birdAudio.playbackRate = 0;
		} else {
			// Move parrot
			parrot.style.left = currentLeft + (fromLeft ? speed : -speed) + "px"
		}
	}

	function handleParrotClick() {
		// Stop parrot animation
		clearInterval(parrotAnimation)

		birdAudio.pause();
		birdAudio.loop = false;

		new Audio("/assets/sounds/shut-up-bird.mp3").play();


		// Remove parrot
		parrotContainer.classList.add("hidden")
		parrotContainer.classList.remove("active")
		parrot.removeEventListener("click", handleParrotClick)
		gameState.eventActive = false
		document.body.classList.remove("overlay")

		// Reward
		gameState.balance += 15
		showMessage("You caught the parrot! +$15")
	}
}

// Trigger the train animation
function triggerTrainAnimation() {
	const trainContainer = document.getElementById("train-container")
	const train = document.getElementById("train")
	const gameContainer = document.getElementById("game-container")

	clearAllEvents()

	new Audio('/assets/sounds/train.mp3').play();

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
			endPos = window.innerWidth + 1000

			// Animate train
			const animateFromLeft = () => {
				startPos += 10
				train.style.left = startPos + "px"

				// Push game container
				if (startPos > 100) {
					gameContainer.style.transform = `translateX(${startPos - 100}px)`
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
			endPos = -1000

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

function clearAllEvents() {
	const audioElements = Array.from(document.getElementsByTagName('audio'));

	audioElements.forEach((element) => {
		element.pause();
	})
}

document.body.addEventListener("keypress", (event) => {
	if (event.key == "9") {
		triggerAntEvent();
	} else if (event.key == "0") {
		triggerGlowieEvent();
	}
})

// Export event functions
export { triggerRandomEvent, triggerGlowieEvent, triggerParrotEvent, triggerTrainAnimation, randomIntFromInterval }
