/* ===============================
   Kabir Malhi - 1776 Project JS
   Fully Fixed Version
   =============================== */

/* ===== Light/Dark Mode ===== */
const modeSwitch = document.getElementById('modeSwitch');
modeSwitch.addEventListener('change', () => {
  document.body.classList.toggle('light-mode', modeSwitch.checked);
});

/* ===== Cursor Glow ===== */
const cursorGlow = document.getElementById('cursorGlow');
document.addEventListener('mousemove', e => {
  cursorGlow.style.left = e.clientX + 'px';
  cursorGlow.style.top = e.clientY + 'px';
});

/* ===== Image Generator (Pollinations AI) ===== */
const promptInput = document.getElementById('promptInput');
const generateBtn = document.getElementById('generateBtn');
const imageContainer = document.getElementById('imageContainer');

generateBtn.addEventListener('click', async () => {
  const prompt = promptInput.value.trim();
  if (!prompt) return alert('Enter a prompt!');
  imageContainer.innerHTML = `<div class="spinner-wrapper"><div class="spinner"></div><div class="spinner-text">Generating image...</div></div>`;

  try {
    const response = await fetch(`https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}`);
    if (!response.ok) throw new Error("Image generation failed");
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    imageContainer.innerHTML = `<img src="${url}" alt="Generated Image">`;
  } catch (err) {
    console.error(err);
    imageContainer.innerHTML = `<p style="color:red;">Failed to generate image. Try again.</p>`;
  }
});

/* ===== Avatar Generator ===== */
const generateAvatarBtn = document.getElementById('generateAvatarBtn');
const avatarContainer = document.getElementById('avatarContainer');

generateAvatarBtn.addEventListener('click', async () => {
  const gender = document.getElementById('genderSelect').value;
  const background = document.getElementById('backgroundSelect').value;
  const outfit = document.getElementById('outfitSelect').value;
  const hat = document.getElementById('hatSelect').value;
  const accessory = document.getElementById('accessorySelect').value;
  const hair = document.getElementById('hairSelect').value;
  const age = document.getElementById('ageSelect').value;
  const race = document.getElementById('raceSelect').value;

  const avatarPrompt = `A ${age} ${race} student in 1776 wearing ${outfit} with ${hair} hair, ${hat}, holding ${accessory}, in ${background}`;
  avatarContainer.innerHTML = `<div class="spinner-wrapper"><div class="spinner"></div><div class="spinner-text">Generating avatar...</div></div>`;

  try {
    const response = await fetch(`https://image.pollinations.ai/prompt/${encodeURIComponent(avatarPrompt)}`);
    if (!response.ok) throw new Error("Avatar generation failed");
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    avatarContainer.innerHTML = `<img src="${url}" alt="Generated Avatar" style="border:2px solid var(--border-color); border-radius:12px;">`;
  } catch (err) {
    console.error(err);
    avatarContainer.innerHTML = `<div style="padding:20px; border:2px solid var(--border-color); background: var(--container-bg); border-radius:12px; color: var(--text-color);">${avatarPrompt}</div>`;
  }
});

/* ===== Quiz ===== */
const quizData = [
  { q: "When was the Declaration of Independence signed?", a: ["1776","1789","1765","1800"], correct: 0 },
  { q: "Who was the first President of the United States?", a: ["George Washington","John Adams","Thomas Jefferson","Benjamin Franklin"], correct: 0 },
  { q: "Which battle was the first major conflict of the Revolutionary War?", a: ["Lexington and Concord","Bunker Hill","Yorktown","Saratoga"], correct: 0 },
  { q: "Which act imposed taxes on paper goods?", a: ["Stamp Act","Tea Act","Intolerable Acts","Sugar Act"], correct: 0 },
  { q: "Who wrote Common Sense?", a: ["Thomas Paine","Benjamin Franklin","John Locke","James Madison"], correct: 0 },
  { q: "Which country helped the US in the Revolutionary War?", a: ["France","Spain","Netherlands","Germany"], correct: 0 },
  { q: "Which treaty ended the Revolutionary War?", a: ["Treaty of Paris 1783","Treaty of Versailles","Jay Treaty","Treaty of Ghent"], correct: 0 },
  { q: "Where did Washington cross to surprise the Hessians?", a: ["Delaware River","Hudson River","Potomac River","Mississippi River"], correct: 0 },
  { q: "Which document governed the US before the Constitution?", a: ["Articles of Confederation","Bill of Rights","Declaration of Independence","Federalist Papers"], correct: 0 },
  { q: "Which city was the first US capital?", a: ["New York","Philadelphia","Boston","Washington D.C."], correct: 0 },
];

let currentQuestion = 0;
let selectedAnswer = null;
let score = 0;

const questionEl = document.getElementById('question');
const answersEl = document.getElementById('answers');
const submitBtn = document.getElementById('submitBtn');
const nextBtn = document.getElementById('nextBtn');
const takeAgainBtn = document.getElementById('takeAgainBtn');
const scoreEl = document.getElementById('score');
const progressContainer = document.getElementById('progressContainer');

function loadQuestion() {
  selectedAnswer = null;
  submitBtn.disabled = true;
  nextBtn.classList.add('hidden');

  const qData = quizData[currentQuestion];
  questionEl.textContent = qData.q;
  answersEl.innerHTML = '';
  qData.a.forEach((ans, i) => {
    const btn = document.createElement('button');
    btn.textContent = ans;
    btn.addEventListener('click', () => {
      selectedAnswer = i;
      Array.from(answersEl.children).forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      submitBtn.disabled = false;
    });
    answersEl.appendChild(btn);
  });

  progressContainer.innerHTML = '';
  quizData.forEach((_, i) => {
    const seg = document.createElement('div');
    seg.classList.add('progress-segment');
    if(i < currentQuestion) seg.style.backgroundColor = 'var(--correct-color)';
    progressContainer.appendChild(seg);
  });
}

submitBtn.addEventListener('click', () => {
  const qData = quizData[currentQuestion];
  Array.from(answersEl.children).forEach((btn, i) => {
    if(i === qData.correct) btn.classList.add('correct');
    if(i === selectedAnswer && selectedAnswer !== qData.correct) btn.classList.add('wrong');
  });
  if(selectedAnswer === qData.correct) score++;
  submitBtn.classList.add('hidden');
  nextBtn.classList.remove('hidden');
});

nextBtn.addEventListener('click', () => {
  currentQuestion++;
  if(currentQuestion < quizData.length){
    loadQuestion();
    submitBtn.classList.remove('hidden');
  } else {
    questionEl.textContent = '';
    answersEl.innerHTML = '';
    progressContainer.innerHTML = '';
    scoreEl.textContent = `Your Score: ${score} / ${quizData.length}`;
    scoreEl.classList.remove('hidden');
    takeAgainBtn.classList.remove('hidden');
    nextBtn.classList.add('hidden');
  }
});

takeAgainBtn.addEventListener('click', () => {
  currentQuestion = 0;
  score = 0;
  scoreEl.classList.add('hidden');
  takeAgainBtn.classList.add('hidden');
  loadQuestion();
  submitBtn.classList.remove('hidden');
});

loadQuestion();

/* ===== Memory Match (with emojis + timer) ===== */
const memoryGrid = document.querySelector('#memoryGame .card-grid');
const memoryTimerEl = document.getElementById('memoryTimer');
let memoryCards = [];
let memoryFlipped = [];
let memoryMatched = 0;
let memoryTimer = 60;
let memoryInterval;

const memoryEmojis = ["📚","✏️","🖋️","📝","🎒","🪑","🖼️","📜"];

function startMemoryTimer() {
  clearInterval(memoryInterval);
  memoryTimer = 60;
  memoryTimerEl.textContent = `Time: ${memoryTimer}s`;
  memoryInterval = setInterval(() => {
    memoryTimer--;
    memoryTimerEl.textContent = `Time: ${memoryTimer}s`;
    if(memoryTimer <= 0){
      clearInterval(memoryInterval);
      alert("Time's up! Try again.");
      createMemoryCards();
    }
  }, 1000);
}

function createMemoryCards() {
  const values = [...memoryEmojis, ...memoryEmojis];
  values.sort(() => Math.random() - 0.5);

  memoryGrid.innerHTML = '';
  memoryCards = [];
  memoryFlipped = [];
  memoryMatched = 0;

  values.forEach(emoji => {
    const card = document.createElement('div');
    card.className = 'card';
    const inner = document.createElement('div');
    inner.className = 'card-inner';
    const front = document.createElement('div');
    front.className = 'card-front';
    front.textContent = '❓';
    const back = document.createElement('div');
    back.className = 'card-back';
    back.textContent = emoji;
    inner.appendChild(front);
    inner.appendChild(back);
    card.appendChild(inner);

    card.addEventListener('click', () => {
      if(memoryFlipped.length < 2 && !card.classList.contains('flipped')){
        card.classList.add('flipped');
        memoryFlipped.push({card, emoji});
        if(memoryFlipped.length === 2){
          setTimeout(checkMemoryMatch, 500);
        }
      }
    });

    memoryCards.push(card);
    memoryGrid.appendChild(card);
  });

  startMemoryTimer();
}

function checkMemoryMatch(){
  const [first, second] = memoryFlipped;
  if(first.emoji === second.emoji){
    memoryMatched += 2;
    if(memoryMatched === memoryCards.length){
      clearInterval(memoryInterval);
      alert("Congratulations! You matched all emojis!");
    }
  } else {
    first.card.classList.remove('flipped');
    second.card.classList.remove('flipped');
  }
  memoryFlipped = [];
}

createMemoryCards();

/* ===== Typing Challenge with Timer ===== */
const typingTimerEl = document.getElementById('typingTimer');
let typingTime = 45;
let typingInterval;

function startTypingTimer(){
  clearInterval(typingInterval);
  typingTime = 45;
  typingTimerEl.textContent = `Time: ${typingTime}s`;
  typingInterval = setInterval(() => {
    typingTime--;
    typingTimerEl.textContent = `Time: ${typingTime}s`;
    if(typingTime <= 0){
      clearInterval(typingInterval);
      alert("Time's up! Try typing again.");
      loadTypingSentence();
      startTypingTimer();
    }
  }, 1000);
}

typingInput.addEventListener('input', () => {
  if(typingInput.value === currentSentence){
    typingScore.textContent = 'Correct!';
    loadTypingSentence();
    startTypingTimer();
  }
});
loadTypingSentence();
startTypingTimer();

/* ===== Classroom Cleanup with Timer ===== */
const cleanupTimerEl = document.getElementById('cleanupTimer');
let cleanupTime = 60;
let cleanupInterval;

function startCleanupTimer(){
  clearInterval(cleanupInterval);
  cleanupTime = 60;
  cleanupTimerEl.textContent = `Time: ${cleanupTime}s`;
  cleanupInterval = setInterval(() => {
    cleanupTime--;
    cleanupTimerEl.textContent = `Time: ${cleanupTime}s`;
    if(cleanupTime <= 0){
      clearInterval(cleanupInterval);
      alert("Time's up! Try cleaning again.");
    }
  }, 1000);
}

document.addEventListener('mouseup', e => {
  if(draggingItem){
    const rect = basket.getBoundingClientRect();
    const itemRect = draggingItem.getBoundingClientRect();
    if(itemRect.left + itemRect.width/2 > rect.left && itemRect.left + itemRect.width/2 < rect.right &&
       itemRect.top + itemRect.height/2 > rect.top && itemRect.top + itemRect.height/2 < rect.bottom){
      draggingItem.remove();
    }
    draggingItem = null;
  }
});

startCleanupTimer();

/* ===== Reset Buttons for Mini-Games ===== */
const resetMemoryBtn = document.createElement('button');
resetMemoryBtn.textContent = 'Reset Memory Game';
resetMemoryBtn.style.marginTop = '10px';
memoryGrid.parentElement.appendChild(resetMemoryBtn);
resetMemoryBtn.addEventListener('click', createMemoryCards);

const resetTypingBtn = document.createElement('button');
resetTypingBtn.textContent = 'Reset Typing Challenge';
resetTypingBtn.style.marginTop = '10px';
typingInput.parentElement.appendChild(resetTypingBtn);
resetTypingBtn.addEventListener('click', () => {
  loadTypingSentence();
  startTypingTimer();
});
