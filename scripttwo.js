// ===== Element References =====
const promptInput = document.getElementById("promptInput");
const generateBtn = document.getElementById("generateBtn");
const imageContainer = document.getElementById("imageContainer");

const generateAvatarBtn = document.getElementById("generateAvatarBtn");
const avatarContainer = document.getElementById("avatarContainer");

const questionEl = document.getElementById("question");
const answersEl = document.getElementById("answers");
const submitBtn = document.getElementById("submitBtn");
const nextBtn = document.getElementById("nextBtn");
const takeAgainBtn = document.getElementById("takeAgainBtn");
const scoreEl = document.getElementById("score");
const progressContainer = document.getElementById("progressContainer");

const memoryGrid = document.querySelector("#memoryGame .card-grid");
const memoryTimerEl = document.getElementById("memoryTimer");
const memoryLeaderboardEl = document.getElementById("memoryLeaderboard");

const sentenceDisplay = document.getElementById("sentenceDisplay");
const typingInput = document.getElementById("typingInput");
const typingScore = document.getElementById("typingScore");
const typingLeaderboard = document.getElementById("typingLeaderboard");

const classroomBoard = document.getElementById("classroomBoard");
const basket = document.getElementById("basket");
const cleanupTimerEl = document.getElementById("cleanupTimer");
const cleanupLeaderboardEl = document.getElementById("cleanupLeaderboard");
const resetCleanupBtn = document.getElementById("resetCleanupBtn");

// ===== Audio =====
const correctSfx = new Audio("correct.mp3");
const wrongSfx = new Audio("wrong.mp3");
const completeSfx = new Audio("complete.mp3");

// ===== Light/Dark Mode =====
const modeSwitch = document.getElementById("modeSwitch");
modeSwitch.addEventListener("change", () => {
  document.body.classList.toggle("light-mode", modeSwitch.checked);
});

// ===== AI Image Generator =====
generateBtn.addEventListener("click", async () => {
  const userPrompt = promptInput.value.trim();
  if (!userPrompt) return;

  const prompt = `${userPrompt}, colonial-era scene, historical clothing, wooden desks, parchment and quills, oil painting style, early American 18th century, realistic lighting`;

  imageContainer.innerHTML = `<div class="spinner-wrapper"><div class="spinner"></div><div class="spinner-text">Generating image...</div></div>`;

  try {
    const response = await fetch(`https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}`);
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    imageContainer.innerHTML = `<img src="${url}" alt="Generated Colonial Scene">`;
  } catch (e) {
    imageContainer.innerHTML = `<p style="color:red;">Error generating image. Try again.</p>`;
  }
});

// ===== Avatar Generator =====
generateAvatarBtn.addEventListener("click", async () => {
  const gender = document.getElementById("genderSelect").value;
  const background = document.getElementById("backgroundSelect").value;
  const outfit = document.getElementById("outfitSelect").value;
  const hat = document.getElementById("hatSelect").value;
  const accessory = document.getElementById("accessorySelect").value;
  const hair = document.getElementById("hairSelect").value;
  const age = document.getElementById("ageSelect").value;
  const race = document.getElementById("raceSelect").value;

  const avatarPrompt = `A ${age} ${gender} with ${hair} hair, wearing ${outfit} and ${hat}, holding ${accessory}, background: ${background}, heritage: ${race}, colonial-era 1770s American style, oil painting, realistic`;

  avatarContainer.innerHTML = `<div class="spinner-wrapper"><div class="spinner"></div><div class="spinner-text">Generating avatar...</div></div>`;

  try {
    const response = await fetch(`https://image.pollinations.ai/prompt/${encodeURIComponent(avatarPrompt)}`);
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    avatarContainer.innerHTML = `<img src="${url}" alt="Generated Avatar">`;
  } catch (e) {
    avatarContainer.innerHTML = `<p style="color:red;">Error generating avatar. Try again.</p>`;
  }
});

// ===== Quiz =====
let currentQuestion = 0;
let userScore = 0;
let quizData = [
  { q: "Which year did the American Declaration of Independence occur?", a: ["1775","1776","1781","1789"], correct:1 },
  { q: "Who was the primary author of the Declaration of Independence?", a: ["George Washington","Thomas Jefferson","Benjamin Franklin","John Adams"], correct:1 },
  { q: "What was a common school supply in 1776?", a: ["Tablet","Parchment and Quill","Notebook","Chalkboard"], correct:1 },
  { q: "Which battle is considered the turning point of the American Revolution?", a: ["Battle of Bunker Hill","Battle of Saratoga","Battle of Yorktown","Battle of Lexington"], correct:1 },
  { q: "Who was the commander-in-chief of the Continental Army?", a: ["Thomas Jefferson","Benjamin Franklin","George Washington","John Adams"], correct:2 },
  { q: "Which document formally ended the Revolutionary War?", a: ["Declaration of Independence","Articles of Confederation","Treaty of Paris 1783","Bill of Rights"], correct:2 },
  { q: "What was a common classroom activity in colonial schools?", a: ["Typing on a keyboard","Reciting lessons by rote","Drawing with crayons","Using calculators"], correct:1 },
  { q: "Which of these items would students use in 1776?", a: ["Ink pen","Quill","Fountain pen","Marker"], correct:1 },
  { q: "Which famous figure signed the Declaration of Independence?", a: ["Paul Revere","Benjamin Franklin","Alexander Hamilton","John Hancock"], correct:3 },
  { q: "Which colony was the first to declare independence?", a: ["Virginia","Pennsylvania","Massachusetts","Delaware"], correct:2 }
];


function renderQuestion() {
  const q = quizData[currentQuestion];
  questionEl.textContent = q.q;
  answersEl.innerHTML = "";
  q.a.forEach((answer, idx) => {
    const btn = document.createElement("button");
    btn.textContent = answer;
    btn.addEventListener("click", () => {
      Array.from(answersEl.children).forEach(b => b.classList.remove("selected"));
      btn.classList.add("selected");
      submitBtn.disabled = false;
    });
    answersEl.appendChild(btn);
  });
  submitBtn.disabled = true;
  nextBtn.classList.add("hidden");
}
renderQuestion();

submitBtn.addEventListener("click", () => {
  const selected = Array.from(answersEl.children).find(b => b.classList.contains("selected"));
  const correctIdx = quizData[currentQuestion].correct;

  Array.from(answersEl.children).forEach((b,i) => {
    b.classList.remove("selected");
    if(i === correctIdx) b.classList.add("correct");
    else if(b === selected) b.classList.add("wrong");
  });

  if(Array.from(answersEl.children).indexOf(selected) === correctIdx) {
    userScore++;
    correctSfx.currentTime = 0;
    correctSfx.play();
  } else {
    wrongSfx.currentTime = 0;
    wrongSfx.play();
  }

  // Update progress bar
  progressContainer.innerHTML = "";
  quizData.forEach((_,i) => {
    const segment = document.createElement("div");
    segment.classList.add("progress-segment");
    if(i < currentQuestion + 1){
      segment.style.backgroundColor = i < userScore ? "var(--correct-color)" : "var(--wrong-color)";
    }
    progressContainer.appendChild(segment);
  });

  nextBtn.classList.remove("hidden");
  submitBtn.disabled = true;
});

nextBtn.addEventListener("click", () => {
  currentQuestion++;
  if(currentQuestion >= quizData.length){
    questionEl.textContent = "Quiz Completed!";
    answersEl.innerHTML = "";
    nextBtn.classList.add("hidden");
    scoreEl.textContent = `Score: ${userScore} / ${quizData.length}`;
    scoreEl.classList.remove("hidden");
    takeAgainBtn.classList.remove("hidden");
    completeSfx.currentTime = 0;
    completeSfx.play();
  } else renderQuestion();
});

takeAgainBtn.addEventListener("click", () => {
  currentQuestion = 0;
  userScore = 0;
  scoreEl.classList.add("hidden");
  takeAgainBtn.classList.add("hidden");
  renderQuestion();
});

// ===== Memory Match =====
const emojiCards = ["📜","🖋️","🎓","📚","🏺","🪑","🕯️","🔔"];
let memoryCards = [];
let flipped = [];
let memoryStarted = false;
let memoryTime = 0;
let memoryTimer;

// Sound effects
const correctSound = new Audio("correct.mp3");
const completeSound = new Audio("complete.mp3");
const wrongSound = new Audio("wrong.mp3");

function startMemoryTimer() {
  if (memoryStarted) return;
  memoryStarted = true;
  memoryTime = 0;
  memoryTimer = setInterval(() => {
    memoryTime += 0.01;
    memoryTimerEl.textContent = `Time: ${memoryTime.toFixed(2)}s`;
  }, 10);
}

function setupMemory() {
  memoryCards = [...emojiCards, ...emojiCards].sort(() => 0.5 - Math.random());
  memoryGrid.innerHTML = "";
  flipped = [];

  memoryCards.forEach((emoji) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `<div class="card-inner">
                        <div class="card-front"></div>
                        <div class="card-back">${emoji}</div>
                      </div>`;

    card.addEventListener("click", () => {
      startMemoryTimer();
      if (card.classList.contains("flipped") || flipped.length === 2) return;

      card.classList.add("flipped");
      flipped.push({ card, emoji });

      if (flipped.length === 2) {
        if (flipped[0].emoji === flipped[1].emoji) {
          // Correct match
          correctSound.play();
          flipped = [];
        } else {
          wrongSound.play();
          setTimeout(() => {
            flipped[0].card.classList.remove("flipped");
            flipped[1].card.classList.remove("flipped");
            flipped = [];
          }, 500);
        }

        // Check if all matched
        const allFlipped = document.querySelectorAll("#memoryGame .card.flipped").length;
        if (allFlipped === memoryCards.length) {
          clearInterval(memoryTimer);
          memoryLeaderboardEl.textContent = `Best: ${memoryTime.toFixed(2)} s`;
          completeSound.play();
        }
      }
    });

    memoryGrid.appendChild(card);
  });
}

// Initial setup
setupMemory();

// ===== Reset Button =====
const resetMemoryBtn = document.getElementById("resetMemoryBtn"); // Make sure this exists in HTML
resetMemoryBtn.addEventListener("click", () => {
  clearInterval(memoryTimer);
  memoryStarted = false;
  memoryTime = 0;
  memoryTimerEl.textContent = `Time: 0.00s`;
  setupMemory();
});

// ===== Typing Challenge =====
const colonialSentence = "Students in 1776 wrote with quills on parchment and learned by rote.";
let typingStarted = false;
let typingStartTime;

typingInput.addEventListener("input", () => {
  if(!typingStarted){
    typingStarted = true;
    typingStartTime = Date.now();
  }
  if(typingInput.value === colonialSentence){
    const elapsed = (Date.now()-typingStartTime)/1000;
    typingScore.textContent = `Time: ${elapsed.toFixed(2)}s`;
    typingLeaderboard.textContent = `Best: ${elapsed.toFixed(2)} s`;
    typingInput.disabled = true;
    completeSfx.currentTime = 0;
    completeSfx.play();
  }
});

sentenceDisplay.textContent = colonialSentence;

// ===== Classroom Cleanup =====
let cleanupStarted = false;
let cleanupTime = 0;
let cleanupTimer;

const classroomItems = ["📚","🖋️","🕯️","📜","🪑","🏺"]; // Emojis to pick up
let itemsInPlay = [];

// Set the background
classroomBoard.style.backgroundImage = "url('https://image.slidesdocs.com/responsive-images/background/classroom-clock-powerpoint-background_d7e0458f21__960_540.jpg')";
classroomBoard.style.backgroundSize = "cover";
classroomBoard.style.backgroundPosition = "center";

// Prevent text selection while dragging
classroomBoard.style.userSelect = "none";

function startCleanupTimer() {
  if (cleanupStarted) return;
  cleanupStarted = true;
  cleanupTime = 0;
  cleanupTimer = setInterval(() => {
    cleanupTime += 0.01;
    cleanupTimerEl.textContent = `Time: ${cleanupTime.toFixed(2)}s`;
  }, 10);
}

// Reset cleanup game
function resetCleanup() {
  clearInterval(cleanupTimer);
  cleanupStarted = false;
  cleanupTime = 0;
  cleanupTimerEl.textContent = `Time: 0.00s`;

  // Remove old items
  itemsInPlay.forEach(item => classroomBoard.removeChild(item));
  itemsInPlay = [];

  // Add new items at random positions
  classroomItems.forEach(emoji => {
    const item = document.createElement("div");
    item.classList.add("clutter-item");
    item.textContent = emoji;

    const boardRect = classroomBoard.getBoundingClientRect();
    const x = Math.random() * (boardRect.width - 40);
    const y = Math.random() * (boardRect.height - 40);
    item.style.left = `${x}px`;
    item.style.top = `${y}px`;
    item.style.position = "absolute";
    item.style.fontSize = "32px";
    item.style.cursor = "grab";

    // Dragging
    item.addEventListener("mousedown", e => {
      e.preventDefault(); // Prevent text selection
      startCleanupTimer();
      const offsetX = e.clientX - item.getBoundingClientRect().left;
      const offsetY = e.clientY - item.getBoundingClientRect().top;

      function onMouseMove(e) {
        const newX = e.clientX - boardRect.left - offsetX;
        const newY = e.clientY - boardRect.top - offsetY;
        item.style.left = `${Math.max(0, Math.min(newX, boardRect.width - 40))}px`;
        item.style.top = `${Math.max(0, Math.min(newY, boardRect.height - 40))}px`;
      }

      function onMouseUp() {
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);

        // Check precise basket collision
        const basketRect = basket.getBoundingClientRect();
        const itemRect = item.getBoundingClientRect();
        const overlapX = itemRect.left + itemRect.width/2 > basketRect.left &&
                         itemRect.left + itemRect.width/2 < basketRect.right;
        const overlapY = itemRect.top + itemRect.height/2 > basketRect.top &&
                         itemRect.top + itemRect.height/2 < basketRect.bottom;

        if(overlapX && overlapY){
          classroomBoard.removeChild(item);
          itemsInPlay = itemsInPlay.filter(i => i !== item);

          // Stop timer if all items collected
          if(itemsInPlay.length === 0){
            clearInterval(cleanupTimer);
            cleanupLeaderboardEl.textContent = `Best: ${cleanupTime.toFixed(2)} s`;
          }
        }
      }

      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    });

    classroomBoard.appendChild(item);
    itemsInPlay.push(item);
  });
}

// Attach reset button
resetCleanupBtn.addEventListener("click", resetCleanup);

// Initial setup
resetCleanup();

// ===== Cursor Glow =====
const cursorGlow = document.getElementById("cursorGlow");
document.addEventListener("mousemove", e=>{
  cursorGlow.style.left = e.clientX + "px";
  cursorGlow.style.top = e.clientY + "px";
});



