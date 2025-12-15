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
const resetMemoryBtn = document.getElementById("resetMemoryBtn");

const sentenceDisplay = document.getElementById("sentenceDisplay");
const typingInput = document.getElementById("typingInput");
const typingScore = document.getElementById("typingScore");
const typingLeaderboard = document.getElementById("typingLeaderboard");

const classroomBoard = document.getElementById("classroomBoard");
const basket = document.getElementById("basket");
const cleanupTimerEl = document.getElementById("cleanupTimer");
const cleanupLeaderboardEl = document.getElementById("cleanupLeaderboard");
const resetCleanupBtn = document.getElementById("resetCleanupBtn");

const cursorGlow = document.getElementById("cursorGlow");

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
  { q: "Which city hosted the signing of the Declaration of Independence?", a: ["New York","Philadelphia","Boston","Washington D.C."], correct:1 },
  { q: "What was the original purpose of colonial schools?", a: ["Trade skills","Religious instruction","Sports","Art"], correct:1 },
  { q: "Which famous figure was known as the 'Father of the Constitution'?", a: ["Thomas Jefferson","George Washington","James Madison","Benjamin Franklin"], correct:2 },
  { q: "What writing instrument was commonly used in 1776?", a: ["Ballpoint pen","Pencil","Quill and ink","Marker"], correct:2 },
  { q: "Which event sparked the American Revolutionary War?", a: ["Boston Tea Party","Signing of Declaration","Battle of Yorktown","Stamp Act"], correct:0 }
];
quizData.sort(() => Math.random() - 0.5);

function renderQuestion() {
  const q = quizData[currentQuestion];
  questionEl.textContent = q.q;
  answersEl.innerHTML = "";

  const answers = q.a.map((answer, idx) => ({ text: answer, isCorrect: idx === q.correct }));
  answers.sort(() => Math.random() - 0.5);

  answers.forEach(answerObj => {
    const btn = document.createElement("button");
    btn.textContent = answerObj.text;
    btn.dataset.correct = answerObj.isCorrect;
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
  const isCorrect = selected.dataset.correct === "true";

  Array.from(answersEl.children).forEach(b => {
    b.classList.remove("selected");
    if(b.dataset.correct === "true") b.classList.add("correct");
    else if(b === selected) b.classList.add("wrong");
  });

  if(isCorrect) userScore++;
  if(isCorrect) correctSfx.play();
  else wrongSfx.play();

  // Update progress
  progressContainer.innerHTML = "";
  quizData.forEach((_, i) => {
    const segment = document.createElement("div");
    segment.classList.add("progress-segment");
    if(i < currentQuestion+1){
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
    completeSfx.play();
  } else renderQuestion();
});

takeAgainBtn.addEventListener("click", () => {
  currentQuestion = 0;
  userScore = 0;
  scoreEl.classList.add("hidden");
  takeAgainBtn.classList.add("hidden");
  quizData.sort(() => Math.random() - 0.5);
  renderQuestion();
});

// ===== Memory Match =====
const emojiCards = ["📜","🖋️","🎓","📚","🏺","🪑","🕯️","🔔"];
let memoryCards = [];
let flipped = [];
let memoryStarted = false;
let memoryTime = 0;
let memoryTimer;

function startMemoryTimer() {
  if(memoryStarted) return;
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

  memoryCards.forEach(emoji => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `<div class="card-inner"><div class="card-front"></div><div class="card-back">${emoji}</div></div>`;

    card.addEventListener("click", () => {
      startMemoryTimer();
      if(card.classList.contains("flipped") || flipped.length === 2) return;

      card.classList.add("flipped");
      flipped.push({card, emoji});

      if(flipped.length === 2){
        if(flipped[0].emoji === flipped[1].emoji){
          correctSfx.play();
          flipped = [];
        } else {
          wrongSfx.play();
          setTimeout(() => {
            flipped[0].card.classList.remove("flipped");
            flipped[1].card.classList.remove("flipped");
            flipped = [];
          }, 500);
        }

        if(document.querySelectorAll("#memoryGame .card.flipped").length === memoryCards.length){
          clearInterval(memoryTimer);
          memoryLeaderboardEl.textContent = `Best: ${memoryTime.toFixed(2)} s`;
          completeSfx.play();
        }
      }
    });

    memoryGrid.appendChild(card);
  });
}
setupMemory();

resetMemoryBtn.addEventListener("click", () => {
  clearInterval(memoryTimer);
  memoryStarted = false;
  memoryTime = 0;
  memoryTimerEl.textContent = `Time: 0.00s`;
  setupMemory();
});

// ===== Typing Challenge (AI) =====
let currentSentence = "";
let typingStarted = false;
let typingStartTime = 0;

async function fetchRandomSentence() {
  sentenceDisplay.textContent = "Loading AI prompt...";
  typingInput.disabled = true;
  typingInput.value = "";
  typingScore.textContent = "";

  try {
    const prompt = "Write a short colonial era sentence for a typing challenge about school life in 1776.";
    const response = await fetch(`https://text.pollinations.ai/${encodeURIComponent(prompt)}`);
    const aiText = await response.text();
    currentSentence = aiText.trim() || "Students in 1776 wrote with quills on parchment.";
  } catch(err){
    currentSentence = "Students in 1776 wrote with quills on parchment.";
  }

  sentenceDisplay.textContent = currentSentence;
  typingInput.disabled = false;
  typingInput.focus();
  typingStarted = false;
  typingStartTime = 0;
}

fetchRandomSentence();

typingInput.addEventListener("input", () => {
  if(!typingStarted){
    typingStarted = true;
    typingStartTime = Date.now();
  }

  if(typingInput.value === currentSentence){
    const elapsed = (Date.now() - typingStartTime)/1000;
    typingScore.textContent = `Time: ${elapsed.toFixed(2)}s`;
    typingLeaderboard.textContent = `Best: ${elapsed.toFixed(2)} s`;
    typingInput.disabled = true;
    setTimeout(fetchRandomSentence, 1000);
  }
});

// ===== Classroom Cleanup =====
let cleanupStarted = false;
let cleanupTime = 0;
let cleanupTimer;
const classroomItems = ["📚","🖋️","🕯️","📜","🪑","🏺"];
let itemsInPlay = [];

classroomBoard.style.backgroundImage = "url('https://image.slidesdocs.com/responsive-images/background/classroom-clock-powerpoint-background_d7e0458f21__960_540.jpg')";
classroomBoard.style.backgroundSize = "cover";
classroomBoard.style.backgroundPosition = "center";
classroomBoard.style.userSelect = "none";

function startCleanupTimer() {
  if(cleanupStarted) return;
  cleanupStarted = true;
  cleanupTime = 0;
  cleanupTimer = setInterval(() => {
    cleanupTime += 0.01;
    cleanupTimerEl.textContent = `Time: ${cleanupTime.toFixed(2)}s`;
  }, 10);
}

function resetCleanup() {
  clearInterval(cleanupTimer);
  cleanupStarted = false;
  cleanupTime = 0;
  cleanupTimerEl.textContent = `Time: 0.00s`;

  itemsInPlay.forEach(item => classroomBoard.removeChild(item));
  itemsInPlay = [];

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

    item.addEventListener("mousedown", e => {
      e.preventDefault();
      startCleanupTimer();
      const offsetX = e.clientX - item.getBoundingClientRect().left;
      const offsetY = e.clientY - item.getBoundingClientRect().top;

      function onMouseMove(e){
        const newX = e.clientX - boardRect.left - offsetX;
        const newY = e.clientY - boardRect.top - offsetY;
        item.style.left = `${Math.max(0, Math.min(newX, boardRect.width-40))}px`;
        item.style.top = `${Math.max(0, Math.min(newY, boardRect.height-40))}px`;
      }

      function onMouseUp(){
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);

        const basketRect = basket.getBoundingClientRect();
        const itemRect = item.getBoundingClientRect();
        const overlapX = itemRect.left + itemRect.width/2 > basketRect.left &&
                         itemRect.left + itemRect.width/2 < basketRect.right;
        const overlapY = itemRect.top + itemRect.height/2 > basketRect.top &&
                         itemRect.top + itemRect.height/2 < basketRect.bottom;

        if(overlapX && overlapY){
          classroomBoard.removeChild(item);
          itemsInPlay = itemsInPlay.filter(i => i !== item);

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

resetCleanupBtn.addEventListener("click", resetCleanup);
resetCleanup();

// ===== Cursor Glow =====
document.addEventListener("mousemove", e => {
  const x = e.clientX + window.scrollX;
  const y = e.clientY + window.scrollY;
  cursorGlow.style.left = `${x}px`;
  cursorGlow.style.top = `${y}px`;
});
