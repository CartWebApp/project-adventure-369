// Game state
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
}

// Story nodes
const storyNodes = {
  start: {
    text: "You are Terry A. Davis, a schizophrenic genius programmer and you have been given the chance to go back in time and restart from 3 possible points. What will you pick?",
    choices: [
      {
        text: "You are sitting at your boring office job as a software engineer for Ticketmaster when you receive a divine call.",
        nextNode: "office_job",
      },
      {
        text: "You are an online developer experiencing mental episodes struggling to get people to notice your work.",
        nextNode: "online_developer",
      },
      {
        text: "You are a homeless man who was once a great programmer who wants to continue his work.",
        nextNode: "homeless",
      },
    ],
  },

  // Office job path
  office_job: {
    text: "You are sitting at your boring office job as a software engineer for Ticketmaster when you receive a divine call.",
    choices: [
      { text: "Accept the call and begin work.", nextNode: "accept_call", mentalHealth: -10, projectProgress: 10 },
      { text: "Doubt the call and seek mental help.", nextNode: "seek_help", mentalHealth: 10, projectProgress: -5 },
    ],
  },

  accept_call: {
    text: 'You have decided to listen to this "divine call." You come to find out this call was given to you by god himself, and he has tasked you with working on his temple in the form of an operating system. How much time will you dedicate to god\'s temple?',
    choices: [
      {
        text: "Quit the job entirely and work on it full time.",
        nextNode: "quit_job",
        mentalHealth: -15,
        projectProgress: 30,
      },
      { text: "Work on it slowly during free time.", nextNode: "work_slowly", mentalHealth: -5, projectProgress: 10 },
    ],
  },

  quit_job: {
    text: "You get the idea to make an operating system called TempleOS, but you need to enlist the help of others or else you'll have to quit your job.",
    choices: [
      {
        text: "Quit job entirely and work on it full time.",
        nextNode: "final_stretch",
        mentalHealth: -20,
        projectProgress: 40,
        income: -200,
      },
      {
        text: "Find a partner to work on the project with you.",
        nextNode: "find_partner",
        mentalHealth: 5,
        projectProgress: 20,
        income: -50,
      },
    ],
  },

  work_slowly: {
    text: "It has taken a very long time, but your creation is nearing completion. Though symptoms of Schizophrenia are getting worse.",
    choices: [
      {
        text: "Continue to work on your project but as it grows larger, you doubt yourself.",
        nextNode: "doubt_yourself",
        mentalHealth: -15,
        projectProgress: 10,
      },
    ],
  },

  doubt_yourself: {
    text: "You continue to work on your project but as it grows larger, you doubt yourself. You worry that the project may not be completed.",
    choices: [
      {
        text: "Find a partner to work on the project with you.",
        nextNode: "find_partner",
        mentalHealth: 5,
        projectProgress: 15,
      },
      { text: "Give up on the project entirely.", nextNode: "give_up_ending", mentalHealth: -30, projectProgress: -50 },
    ],
  },

  seek_help: {
    text: "Choosing to seek mental help, you visit a therapist who diagnoses you with Schizophrenia, and he provides you with the appropriate medicine.",
    choices: [
      { text: "Take medicine as prescribed.", nextNode: "take_medicine", mentalHealth: 30, projectProgress: -5 },
      {
        text: "Decide not to take the medicine for the fear it will ruin your creativity.",
        nextNode: "no_medicine",
        mentalHealth: -20,
        projectProgress: 10,
      },
    ],
  },

  take_medicine: {
    text: "The therapist gives you medicine which you take in an effort to resume work on your passion project yet the largest challenge still lies ahead. You use advice given to you by your therapist to better communicate your problems.",
    choices: [
      {
        text: "Use your communications skills for help.",
        nextNode: "use_skills",
        mentalHealth: 10,
        projectProgress: 15,
      },
      { text: "Continue to work alone.", nextNode: "work_alone", mentalHealth: -10, projectProgress: 10 },
    ],
  },

  use_skills: {
    text: "You spend your time working on the final iterations of your custom compiler which proves to be the hardest challenge you face throughout development. Fortunately, you finish it. You publish it online and receive plenty of positive feedback which allows your online presence to gain traction, and you are invited to speak about your story creating god's temple.",
    choices: [{ text: "Continue your journey", nextNode: "heaven_ending", mentalHealth: 20, projectProgress: 40 }],
  },

  work_alone: {
    text: "Even though you decide to work on the final challenge on your own, you were still able to manage. It took much longer than you anticipated, but it is finally complete. However, because of your lack of communication skills and the damage done from your mental issues, you don't know how to share your passion project with the world.",
    choices: [
      { text: "Attempt to share your project.", nextNode: "attempt_share", mentalHealth: -5, projectProgress: 10 },
      { text: "Keep the project private.", nextNode: "keep_private", mentalHealth: -10, projectProgress: 0 },
    ],
  },

  attempt_share: {
    text: "You attempt to share your project with minor success. People notice you and your work but it is not as much as you hoped.",
    choices: [
      { text: "Persist", nextNode: "persist", mentalHealth: -5, projectProgress: 15 },
      { text: "Give up", nextNode: "give_up_ending", mentalHealth: -30, projectProgress: -20 },
    ],
  },

  persist: {
    text: "You continue to share your project, improving on it with each piece of feedback until your operating system is fully complete and polished. Your work is admired.",
    choices: [{ text: "Continue your journey", nextNode: "heaven_ending", mentalHealth: 20, projectProgress: 30 }],
  },

  keep_private: {
    text: "You decide that it is best to keep the project to yourself and the project goes unnoticed until it is found by a family member who inherits your computer after you pass. He shares it online and it gains a massive following of hobbyists who dissect the operating system. They hail you as a genius.",
    choices: [{ text: "End your journey", nextNode: "genius_ending", mentalHealth: 0, projectProgress: 0 }],
  },

  no_medicine: {
    text: "You are able to land a stable and good paying job at Ticketmaster.",
    choices: [
      {
        text: "Continue working on your own programming projects",
        nextNode: "wasted_time",
        mentalHealth: -15,
        projectProgress: 5,
      },
    ],
  },

  wasted_time: {
    text: "While working on your own programming projects, you realize you have wasted your time, and that you are now evicted from your apartment.",
    choices: [
      { text: "Find a non-tech related job", nextNode: "non_tech_job", mentalHealth: 5, projectProgress: -10 },
      { text: "Live out of your car", nextNode: "live_in_car", mentalHealth: -20, projectProgress: 10 },
    ],
  },

  non_tech_job: {
    text: "You are able to pick up a minimum wage job at a supermarket where you meet someone who has the same interest in computers as you.",
    choices: [
      {
        text: "Continue your journey",
        nextNode: "find_partner",
        mentalHealth: 10,
        projectProgress: 5,
        income: 150,
      },
    ],
  },

  live_in_car: {
    text: "You now spend your time living inside of your car with nothing to do but to work on the operating system.",
    choices: [
      {
        text: "Continue your journey",
        nextNode: "youtube_channel",
        mentalHealth: -10,
        projectProgress: 20,
        income: -100,
      },
    ],
  },

  // Online developer path
  online_developer: {
    text: "You are an online developer experiencing mental episodes struggling to get people to notice your work.",
    choices: [
      {
        text: "Continue to work on your projects to receive feedback.",
        nextNode: "continue_work",
        mentalHealth: -5,
        projectProgress: 15,
      },
      {
        text: "Deny the help of others and give up on publicly creating your projects.",
        nextNode: "deny_help",
        mentalHealth: -15,
        projectProgress: -10,
      },
    ],
  },

  continue_work: {
    text: "You continue to work on your projects and find users who appreciate your work. They provide constructive feedback that could prove to be very useful later on the project development.",
    choices: [{ text: "Continue your journey", nextNode: "final_stretch", mentalHealth: 5, projectProgress: 20 }],
  },

  deny_help: {
    text: "A lack of public interaction and feedback combined with your mental episodes causes you to develop poor programming habits and your work greatly slows down.",
    choices: [
      { text: "Seek mental guidance.", nextNode: "seek_help", mentalHealth: 15, projectProgress: -5 },
      { text: "Push forward.", nextNode: "push_forward", mentalHealth: -20, projectProgress: 5 },
    ],
  },

  push_forward: {
    text: "You have decided that your mental health is no longer a priority. Despite the mental episodes, you move forward with your project.",
    choices: [{ text: "Continue your journey", nextNode: "final_stretch", mentalHealth: -25, projectProgress: 15 }],
  },

  // Homeless path
  homeless: {
    text: "You are a homeless man who was once a great programmer who wants to continue his work.",
    choices: [
      {
        text: "Accept help from people to get back on your feet.",
        nextNode: "accept_help",
        mentalHealth: 15,
        projectProgress: 5,
      },
      {
        text: "Deny help from people and set out on your own.",
        nextNode: "deny_people_help",
        mentalHealth: -15,
        projectProgress: -5,
      },
    ],
  },

  accept_help: {
    text: "You decide it would benefit you to try and get help from others. You reach out and a fellow tech genius funds an apartment and computer for you.",
    choices: [
      { text: "Try and find a stable job.", nextNode: "find_job", mentalHealth: 10, projectProgress: -5 },
      { text: "Work on your personal projects.", nextNode: "personal_projects", mentalHealth: -5, projectProgress: 15 },
    ],
  },

  find_job: {
    text: "You are able to land a stable and good paying job at Ticketmaster.",
    choices: [
      {
        text: "Continue your journey",
        nextNode: "accept_call",
        mentalHealth: 5,
        projectProgress: 0,
        income: 300,
      },
    ],
  },

  personal_projects: {
    text: "You continue to work on your projects and find users who appreciate your work. They provide constructive feedback that could prove to be very useful later on the project development.",
    choices: [{ text: "Continue your journey", nextNode: "final_stretch", mentalHealth: -5, projectProgress: 20 }],
  },

  deny_people_help: {
    text: "Instead of reaching out for help you try and utilize what is available for free. You go to a library and work on your final project, god's temple.",
    choices: [{ text: "Continue your journey", nextNode: "library_work", mentalHealth: -10, projectProgress: 10 }],
  },

  library_work: {
    text: "You work out of a library but it's difficult. People complain about you because of your poor health and the librarian wants you out.",
    choices: [
      { text: "Argue with the librarian.", nextNode: "argue_librarian", mentalHealth: -15, projectProgress: -5 },
      { text: "Leave the library.", nextNode: "leave_library", mentalHealth: -5, projectProgress: -10 },
    ],
  },

  argue_librarian: {
    text: "You cause a scene in the library which gets you forcefully removed. However, you don't give up and you find another library.",
    choices: [
      { text: "Continue your journey", nextNode: "find_another_library", mentalHealth: -10, projectProgress: 5 },
    ],
  },

  find_another_library: {
    text: "You find a smaller library with less people, somewhere where you can work on your project in peace.",
    choices: [{ text: "Continue your journey", nextNode: "final_stretch", mentalHealth: 5, projectProgress: 15 }],
  },

  leave_library: {
    text: "You have no other choice but to live on the street. You pawn off your laptop and other possessions for money but programming is no longer your priority. Your journey is over.",
    choices: [{ text: "End your journey", nextNode: "homeless_ending", mentalHealth: -30, projectProgress: -50 }],
  },

  // Common paths
  final_stretch: {
    text: "You're at the final stretch of the project and you are met with your final task, the HolyC compiler. There is an issue however. Your mental health is continuing to degrade and your thinking is blurred.",
    choices: [
      {
        text: "Ignore your degrading mental health.",
        nextNode: "ignore_health",
        mentalHealth: -25,
        projectProgress: 15,
      },
      { text: "Seek mental help", nextNode: "seek_help_late", mentalHealth: 15, projectProgress: -5 },
    ],
  },

  ignore_health: {
    text: "Despite your poor mental health, you have managed your issues to finish the compiler and develop a one man operating system second to none. TempleOS",
    choices: [
      { text: "Share your creation on Hacker News", nextNode: "hacker_news", mentalHealth: -5, projectProgress: 10 },
      {
        text: "Share your creation on your own YouTube channel",
        nextNode: "youtube_channel",
        mentalHealth: -10,
        projectProgress: 15,
      },
    ],
  },

  hacker_news: {
    text: "You decide you want to share god's temple with the world, and so you post it on Hacker News.",
    choices: [{ text: "Continue your journey", nextNode: "feedback_reaction", mentalHealth: -5, projectProgress: 10 }],
  },

  feedback_reaction: {
    text: "The feedback you receive is not what you hoped, you see people disregarding, ignoring, and making fun of god's temple, and combined with your schizophrenia, you take your anger out directly on these forums and you are subsequently banned.",
    choices: [
      {
        text: "Seek help regarding your degrading mental health.",
        nextNode: "seek_help_late",
        mentalHealth: 10,
        projectProgress: -5,
      },
      {
        text: "Get into arguments on the internet over your project.",
        nextNode: "internet_arguments",
        mentalHealth: -20,
        projectProgress: -10,
      },
    ],
  },

  internet_arguments: {
    text: "You continue to get into heated arguments with people on the internet and it pulls you even farther into a degraded and mentally unstable state that doesn't do anything to help get your project out into the world. Your degrading mental state is reflected in the decline of your personal life, where you have become homeless.",
    choices: [{ text: "End your journey", nextNode: "spiral_ending", mentalHealth: -40, projectProgress: -20 }],
  },

  seek_help_late: {
    text: "You were able to seek a therapist who helped you get your current mental situation under control.",
    choices: [
      {
        text: "Return to forums with a new approach",
        nextNode: "return_forums",
        mentalHealth: 20,
        projectProgress: 10,
      },
    ],
  },

  return_forums: {
    text: "You return to the forums you had been banned from on alternate accounts, and you repost the project. This time, you are much more open and accepting of feedback, while still ignoring the intentionally degrading comments.",
    choices: [{ text: "Continue your journey", nextNode: "heaven_ending", mentalHealth: 15, projectProgress: 25 }],
  },

  youtube_channel: {
    text: "You decide that you want to start a YouTube channel where you will livestream the development of your project. Your streams gain traction because of the way you respond to viewers and hate messages.",
    choices: [{ text: "Continue your journey", nextNode: "video_logs", mentalHealth: -15, projectProgress: 20 }],
  },

  video_logs: {
    text: "Your YouTube channel gains a small following and you continue to live stream development. Despite your new found small online fame, you have ignored your mental state for too long and you get more outlandish every live stream, you are subsequently banned from live streaming on YouTube. You decide to create video logs instead.",
    choices: [
      {
        text: "Create short video logs of the development process",
        nextNode: "car_battery",
        mentalHealth: -10,
        projectProgress: 15,
      },
    ],
  },

  car_battery: {
    text: "You create short video logs of the development process but your car battery and supplies are running out. Your car can no longer support even the most basic of needs.",
    choices: [
      { text: "Go to a library for power.", nextNode: "library_work", mentalHealth: -5, projectProgress: 10 },
      { text: "Live on the street.", nextNode: "homeless_ending", mentalHealth: -30, projectProgress: -40 },
    ],
  },

  find_partner: {
    text: "You find someone who thinks the same way you do to help work on your project. Your progress speeds back up.",
    choices: [
      { text: "Work together on some projects", nextNode: "work_together", mentalHealth: 10, projectProgress: 20 },
    ],
  },

  work_together: {
    text: "You and your new found partner decide to work together on some projects. You both decide you want to create an operating system.",
    choices: [{ text: "Continue your journey", nextNode: "partner_compiler", mentalHealth: 5, projectProgress: 25 }],
  },

  partner_compiler: {
    text: "You and your new partner work together on the project, tackling all challenges with ease. However, problems arose when you reached the final and most difficult challenge, the compiler. Your partner is not as well versed with the codebase as you are.",
    choices: [
      {
        text: "Spend extra time teaching your partner.",
        nextNode: "teach_partner",
        mentalHealth: -5,
        projectProgress: 15,
      },
      { text: "Work on the compiler yourself.", nextNode: "compiler_yourself", mentalHealth: -15, projectProgress: 25 },
    ],
  },

  teach_partner: {
    text: "Although teaching your partner how the codebase worked made the overall process take quite a bit longer, you were able to get him up to speed with the project. Both of you worked together on the compiler and were able to tackle it with ease.",
    choices: [{ text: "Continue your journey", nextNode: "heaven_ending", mentalHealth: 15, projectProgress: 30 }],
  },

  compiler_yourself: {
    text: "You decide that it will be too much a waste of time to try and teach your partner the ins and outs of the codebase so you reallocate the entire workload of finishing the compiler to yourself.",
    choices: [{ text: "Continue your journey", nextNode: "heaven_ending", mentalHealth: -10, projectProgress: 35 }],
  },

  // Endings
  give_up_ending: {
    text: "You decide that it is pointless to try and spread the word of your creation. Instead, you continue to work on it in solitaire.",
    ending: "You give up on the project entirely.",
  },

  spiral_ending: {
    text: "Your mental condition continues to spiral downwards and you have ended up homeless, unable to think straight, and without purpose. Your mission is over.",
    ending: "Your mental condition spirals out of control.",
  },

  genius_ending: {
    text: "You decide that it is best to keep the project to yourself and the project goes unnoticed until it is found by a family member who inherits your computer after you pass. He shares it online and it gains a massive following of hobbyists who dissect the operating system. They hail you as a genius.",
    ending: "You are hailed as a genius posthumously.",
  },

  heaven_ending: {
    text: "You find peace now that you have fulfilled your god given purpose. You are now able to close this chapter of your life and move on. Fast forward 60 or so years, you have now passed. You are greeted at the gates of heaven by god himself, he appoints you as his god of technology.",
    ending: "You become God's technology architect in heaven.",
  },

  homeless_ending: {
    text: "You have no other choice but to live on the street. You pawn off your laptop and other possessions for money but programming is no longer your priority. Your journey is over.",
    ending: "You end up homeless with no purpose.",
  },
}

// Initialize the game
function initGame() {
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

  // Hide train container
  document.getElementById("train-container").classList.add("hidden")
  document.getElementById("game-over").style.opacity = "0"

  // Reset game container position
  document.getElementById("game-container").style.transform = "none"

  // Clear any existing intervals
  if (gameState.shastaInterval) {
    clearInterval(gameState.shastaInterval)
  }

  if (gameState.eventInterval) {
    clearInterval(gameState.eventInterval)
  }

  updateGameDisplay()
  initShastaSystem()
}

// Update the game display based on current state
function updateGameDisplay() {
  const storyTextElement = document.getElementById("story-text")
  const choicesContainer = document.getElementById("choices-container")
  const mentalHealthBar = document.getElementById("mental-health-bar")
  const progressBar = document.getElementById("progress-bar")
  const shastaColaBar = document.getElementById("shasta-cola-bar")
  const incomeAmount = document.getElementById("income-amount")

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
  shastaColaBar.style.width = `${gameState.shastaCola}%`

  // Update income
  incomeAmount.textContent = gameState.income

  // Change mental health bar color based on value
  if (gameState.mentalHealth < 30) {
    mentalHealthBar.style.backgroundColor = "#ff3333"
  } else if (gameState.mentalHealth < 60) {
    mentalHealthBar.style.backgroundColor = "#ffcc33"
  } else {
    mentalHealthBar.style.backgroundColor = "black"
  }

  // Add this after updating the mental health bar
  if (gameState.mentalHealth <= 0 && !gameState.gameOver) {
    gameState.gameOver = true
    triggerTrainEvent()
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
    restartButton.addEventListener("click", initGame)
    choicesContainer.appendChild(restartButton)

    // Clear intervals
    if (gameState.shastaInterval) {
      clearInterval(gameState.shastaInterval)
    }

    if (gameState.eventInterval) {
      clearInterval(gameState.eventInterval)
    }

    return
  }

  // Add choices
  if (!gameState.eventActive) {
    currentNode.choices.forEach((choice) => {
      const choiceButton = document.createElement("button")
      choiceButton.className = "choice-btn"
      choiceButton.textContent = choice.text
      choiceButton.addEventListener("click", () => makeChoice(choice))
      choicesContainer.appendChild(choiceButton)
    })
  }
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

  // Update game display
  updateGameDisplay()
}

// Shasta Cola System
function initShastaSystem() {
  // Start decreasing Shasta Cola over time
  gameState.shastaInterval = setInterval(() => {
    if (!gameState.eventActive) {
      decreaseShastaCola()
    }
  }, 2000)

  // Add click event for soda button
  const sodaButton = document.getElementById("soda-button")
  sodaButton.addEventListener("click", drinkShastaCola)

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

function decreaseShastaCola() {
  gameState.shastaCola -= 5
  if (gameState.shastaCola <= 0) {
    gameState.shastaCola = 0
    gameState.mentalHealth -= 5
    updateGameDisplay()
  }
  updateShastaCola()
}

function drinkShastaCola() {
  if (gameState.eventActive) return

  if (gameState.income >= 5) {
    gameState.income -= 5
    gameState.shastaCola = Math.min(100, gameState.shastaCola + 30)
    updateShastaCola()
    updateIncome()
  } else {
    showMessage("Not enough money for Diet Shasta Cola!")
  }
}

function updateShastaCola() {
  const shastaColaBar = document.getElementById("shasta-cola-bar")
  shastaColaBar.style.height = `${gameState.shastaCola}%`
}

function updateIncome() {
  const incomeAmount = document.getElementById("income-amount")
  incomeAmount.textContent = gameState.income
}

// Update the showMessage function to format messages properly
function showMessage(message) {
  const storyText = document.getElementById("story-text")
  storyText.innerHTML += `<p class="message">${message}</p>`

  // Scroll to bottom of story container
  const storyContainer = document.getElementById("story-container")
  storyContainer.scrollTop = storyContainer.scrollHeight
}

// Random Events
function triggerRandomEvent() {
  if (gameState.eventActive) return

  const eventType = Math.random() < 0.5 ? "glowie" : "parrot"

  if (eventType === "glowie") {
    triggerGlowieEvent()
  } else {
    triggerParrotEvent()
  }
}

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

function triggerParrotEvent() {
  gameState.eventActive = true
  const parrotContainer = document.getElementById("parrot-container")
  const parrot = document.getElementById("parrot")

  // Add overlay
  document.body.classList.add("overlay")

  // Decide starting position (left or right)
  const startFromRight = Math.random() < 0.5
  const gameContainer = document.getElementById("game-container")

  if (startFromRight) {
    parrot.style.left = gameContainer.offsetWidth + "px"
    parrot.style.transform = "scaleX(-1)" // Flip horizontally
  } else {
    parrot.style.left = "-80px"
    parrot.style.transform = "scaleX(1)"
  }

  parrot.style.top = Math.floor(Math.random() * 300) + 50 + "px"

  // Show parrot
  parrotContainer.classList.remove("hidden")
  parrotContainer.classList.add("active")

  // Show message
  showMessage("A parrot is flying across the screen! Click it before it escapes!")

  // Add click event
  parrot.addEventListener("click", handleParrotClick)

  // Start moving parrot
  const speed = Math.random() * 5 + 5 // 5-10 pixels per frame (faster)
  const direction = startFromRight ? -1 : 1
  const parrotAnimation = setInterval(moveParrot, 30)

  function moveParrot() {
    const currentLeft = Number.parseInt(parrot.style.left)

    if ((direction > 0 && currentLeft > gameContainer.offsetWidth) || (direction < 0 && currentLeft < -80)) {
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
      parrot.style.left = currentLeft + speed * direction + "px"
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
    gameState.income += 15
    updateIncome()
    showMessage("You caught the parrot! +$15")
  }
}

function triggerTrainEvent() {
  const trainContainer = document.getElementById("train-container")
  const train = document.getElementById("train")
  const gameOver = document.getElementById("game-over")
  const gameContainer = document.getElementById("game-container")

  // Show train container
  trainContainer.classList.remove("hidden")

  // Determine train direction (0: left, 1: right, 2: top, 3: bottom)
  const direction = Math.floor(Math.random() * 4)

  // Set initial position based on direction
  switch (direction) {
    case 0: // From left
      train.style.left = "-300px"
      train.style.top = "50%"
      train.style.transform = "translateY(-50%)"
      break
    case 1: // From right
      train.style.left = gameContainer.offsetWidth + "px"
      train.style.top = "50%"
      train.style.transform = "translateY(-50%) scaleX(-1)"
      break
    case 2: // From top
      train.style.left = "50%"
      train.style.top = "-200px"
      train.style.transform = "translateX(-50%) rotate(90deg)"
      break
    case 3: // From bottom
      train.style.left = "50%"
      train.style.top = gameContainer.offsetHeight + "px"
      train.style.transform = "translateX(-50%) rotate(-90deg)"
      break
  }

  // Animate train
  let position = direction < 2 ? Number.parseInt(train.style.left) : Number.parseInt(train.style.top)
  const speed = 15

  const trainAnimation = setInterval(() => {
    switch (direction) {
      case 0: // From left
        position += speed
        train.style.left = position + "px"
        if (position > gameContainer.offsetWidth) {
          clearInterval(trainAnimation)
          showGameOver()
        }
        break
      case 1: // From right
        position -= speed
        train.style.left = position + "px"
        if (position < -300) {
          clearInterval(trainAnimation)
          showGameOver()
        }
        break
      case 2: // From top
        position += speed
        train.style.top = position + "px"
        if (position > gameContainer.offsetHeight) {
          clearInterval(trainAnimation)
          showGameOver()
        }
        break
      case 3: // From bottom
        position -= speed
        train.style.top = position + "px"
        if (position < -200) {
          clearInterval(trainAnimation)
          showGameOver()
        }
        break
    }

    // Shake the game container
    gameContainer.style.transform = `translate(${Math.random() * 10 - 5}px, ${Math.random() * 10 - 5}px)`
  }, 30)

  function showGameOver() {
    // Reset container position
    gameContainer.style.transform = "none"

    // Show game over text
    gameOver.style.opacity = "1"

    // Clear any existing intervals
    if (gameState.shastaInterval) {
      clearInterval(gameState.shastaInterval)
    }

    if (gameState.eventInterval) {
      clearInterval(gameState.eventInterval)
    }

    // Add restart button after a delay
    setTimeout(() => {
      const choicesContainer = document.getElementById("choices-container")
      choicesContainer.innerHTML = ""

      const restartButton = document.createElement("button")
      restartButton.className = "restart-btn"
      restartButton.textContent = "Restart Game"
      restartButton.addEventListener("click", initGame)
      choicesContainer.appendChild(restartButton)
    }, 2000)
  }
}

// Add window button functionality
window.addEventListener("load", () => {
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
    const gameContainer = document.getElementById("game-container")
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
})

// Initialize the game when the page loads
window.addEventListener("load", initGame)
