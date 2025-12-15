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

// ===== Light/Dark Mode =====
const modeSwitch = document.getElementById("modeSwitch");
modeSwitch.addEventListener("change", () => {
  document.body.classList.toggle("light-mode", modeSwitch.checked);
});

// ===== AI Image Generator =====
generateBtn.addEventListener("click", async () => {
  const userPrompt = promptInput.value.trim();
  if (!userPrompt) return;

  // Colonial / 1776 style prompt wording
  const prompt = `${userPrompt}, colonial-era scene, historical clothing, wooden desks, parchment and quills, oil painting style, early American 18th century, realistic lighting`;

  imageContainer.innerHTML = `<div class="spinner-wrapper"><div class="spinner"></div><div class="spinner-text">Generating image...</div></div>`;

  try {
    const response = await fetch(
      `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}`
    );
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
    const response = await fetch(
      `https://image.pollinations.ai/prompt/${encodeURIComponent(avatarPrompt)}`
    );
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
  { q: "What was a common school supply in 1776?", a: ["Tablet","Parchment and Quill","Notebook","Chalkboard"], correct:1 }
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

  if(Array.from(answersEl.children).indexOf(selected) === correctIdx) userScore++;

  // Correct progress bar update
  progressContainer.innerHTML = "";
  quizData.forEach((_,i) => {
    const segment = document.createElement("div");
    segment.classList.add("progress-segment");
    if(i < currentQuestion+1){
      if(i < userScore) segment.style.backgroundColor = "var(--correct-color)";
      else segment.style.backgroundColor = "var(--wrong-color)";
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

function startMemoryTimer(){
  if(memoryStarted) return;
  memoryStarted = true;
  memoryTime = 0;
  memoryTimer = setInterval(() => {
    memoryTime += 0.01;
    memoryTimerEl.textContent = `Time: ${memoryTime.toFixed(2)}s`;
  },10);
}

function setupMemory(){
  memoryCards = [...emojiCards, ...emojiCards].sort(() => 0.5-Math.random());
  memoryGrid.innerHTML = "";
  memoryCards.forEach((emoji) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `<div class="card-inner"><div class="card-front"></div><div class="card-back">${emoji}</div></div>`;
    card.addEventListener("click", () => {
      startMemoryTimer();
      if(card.classList.contains("flipped")) return;
      card.classList.add("flipped");
      flipped.push({card, emoji});
      if(flipped.length === 2){
        if(flipped[0].emoji !== flipped[1].emoji){
          setTimeout(()=>{flipped[0].card.classList.remove("flipped"); flipped[1].card.classList.remove("flipped"); flipped=[];},500);
        } else flipped = [];
        if(document.querySelectorAll("#memoryGame .card.flipped").length === memoryCards.length){
          clearInterval(memoryTimer);
          memoryLeaderboardEl.textContent = `Best: ${memoryTime.toFixed(2)} s`;
        }
      }
    });
    memoryGrid.appendChild(card);
  });
}
setupMemory();

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
  }
});

sentenceDisplay.textContent = colonialSentence;

// ===== Classroom Cleanup =====
let cleanupStarted = false;
let cleanupTime = 0;
let cleanupTimer;

function startCleanupTimer(){
  if(cleanupStarted) return;
  cleanupStarted = true;
  cleanupTime = 0;
  cleanupTimer = setInterval(()=> {
    cleanupTime += 0.01;
    cleanupTimerEl.textContent = `Time: ${cleanupTime.toFixed(2)}s`;
  },10);
}

// Start cleanup timer only on interaction
basket.addEventListener("mousedown", startCleanupTimer);

resetCleanupBtn.addEventListener("click", ()=> {
  clearInterval(cleanupTimer);
  cleanupStarted=false;
  cleanupTime=0;
  cleanupTimerEl.textContent = `Time: 0.00s`;
});

// ===== Cursor Glow =====
const cursorGlow = document.getElementById("cursorGlow");
document.addEventListener("mousemove", e=>{
  cursorGlow.style.left = e.clientX + "px";
  cursorGlow.style.top = e.clientY + "px";
});
