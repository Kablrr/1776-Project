/* ===============================
   Kabir Malhi - 1776 Project JS
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

  imageContainer.innerHTML = `<div class="spinner-wrapper">
    <div class="spinner"></div>
    <div class="spinner-text">Generating image...</div>
  </div>`;

  try {
    // Pollinations API
    const response = await fetch(`https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}`);
    if (!response.ok) throw new Error('Failed to generate image');
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    imageContainer.innerHTML = `<img src="${url}" alt="Generated Image">`;
  } catch (err) {
    imageContainer.innerHTML = `<p style="color:var(--wrong-color);">Error generating image. Try again.</p>`;
    console.error(err);
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

  const prompt = `${gender}, ${age}, ${race}, ${hair} hair, ${hat}, ${outfit}, ${accessory}, in a ${background} setting, colonial 1776 style`;

  avatarContainer.innerHTML = `<div class="spinner-wrapper">
    <div class="spinner"></div>
    <div class="spinner-text">Generating avatar...</div>
  </div>`;

  try {
    const response = await fetch(`https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}`);
    if (!response.ok) throw new Error('Failed to generate avatar');
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    avatarContainer.innerHTML = `<img src="${url}" alt="Generated Avatar">`;
  } catch (err) {
    avatarContainer.innerHTML = `<div style="padding:20px; border:2px solid var(--border-color); color:var(--text-color;">${prompt}</div>`;
    console.error(err);
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
  answersEl.innerHTML = '';

  const qData = quizData[currentQuestion];
  questionEl.textContent = qData.q;

  qData.a.forEach((ans,i) => {
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

  // Progress bar
  progressContainer.innerHTML = '';
  quizData.forEach((_,i) => {
    const seg = document.createElement('div');
    seg.classList.add('progress-segment');
    if(i < currentQuestion) seg.style.backgroundColor = 'var(--correct-color)';
    progressContainer.appendChild(seg);
  });
}

submitBtn.addEventListener('click', () => {
  const qData = quizData[currentQuestion];
  Array.from(answersEl.children).forEach((btn,i) => {
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

/* ===== Memory Match (Emojis) ===== */
const memoryGrid = document.querySelector('#memoryGame .card-grid');
let memoryCards = [];
let memoryFlipped = [];
let memoryMatched = 0;
let memoryStartTime, memoryTimerInterval;
const emojis = ["📜","🖋️","📚","⚔️","🧺","🎓","🕰️","🍎"];

function createMemoryCards() {
  const values = [...emojis, ...emojis];
  values.sort(() => Math.random() - 0.5);

  memoryGrid.innerHTML = '';
  memoryCards = [];
  memoryFlipped = [];
  memoryMatched = 0;

  values.forEach(val => {
    const card = document.createElement('div');
    card.className = 'card';
    const inner = document.createElement('div');
    inner.className = 'card-inner';
    const front = document.createElement('div');
    front.className = 'card-front';
    front.textContent = '?';
    const back = document.createElement('div');
    back.className = 'card-back';
    back.textContent = val;
    inner.appendChild(front);
    inner.appendChild(back);
    card.appendChild(inner);

    card.addEventListener('click', () => {
      if(memoryFlipped.length < 2 && !card.classList.contains('flipped')){
        card.classList.add('flipped');
        memoryFlipped.push({card,val});
        if(memoryFlipped.length === 2){
          setTimeout(checkMemoryMatch, 500);
        }
      }
    });

    memoryCards.push(card);
    memoryGrid.appendChild(card);
  });

  memoryStartTime = performance.now();
  if(memoryTimerInterval) clearInterval(memoryTimerInterval);
  memoryTimerInterval = setInterval(updateMemoryTimer, 50);
}

function checkMemoryMatch() {
  const [first, second] = memoryFlipped;
  if(first.val === second.val){
    memoryMatched += 2;
    if(memoryMatched === memoryCards.length){
      clearInterval(memoryTimerInterval);
      updateMemoryLeaderboard();
    }
  } else {
    first.card.classList.remove('flipped');
    second.card.classList.remove('flipped');
  }
  memoryFlipped = [];
}

function updateMemoryTimer(){
  const elapsed = (performance.now() - memoryStartTime)/1000;
  document.getElementById('memoryTimer').textContent = `Time: ${elapsed.toFixed(2)}s`;
}

function updateMemoryLeaderboard(){
  const bestEl = document.getElementById('memoryLeaderboard');
  const currentTime = (performance.now() - memoryStartTime)/1000;
  const previousBest = parseFloat(bestEl.dataset.best) || Infinity;
  if(currentTime < previousBest){
    bestEl.dataset.best = currentTime;
    bestEl.textContent = `Best: ${currentTime.toFixed(2)} s`;
  }
}

createMemoryCards();

/* ===== Typing Challenge ===== */
const typingInput = document.getElementById('typingInput');
const sentenceDisplay = document.getElementById('sentenceDisplay');
const typingScore = document.getElementById('typingScore');
const typingLeaderboard = document.getElementById('typingLeaderboard');

const sentences = [
  "The sun rises over the colonial town.",
  "George Washington led his troops across the river.",
  "Colonists gathered to discuss independence.",
  "The market was busy with merchants and buyers.",
  "Children studied in the colonial schoolhouse."
];

let currentSentence = "";
let typingStartTime, typingInterval;

function loadTypingSentence(){
  currentSentence = sentences[Math.floor(Math.random()*sentences.length)];
  sentenceDisplay.textContent = currentSentence;
  typingInput.value = '';
  typingScore.textContent = '';
  typingStartTime = performance.now();
  if(typingInterval) clearInterval(typingInterval);
  typingInterval = setInterval(updateTypingTimer,50);
}

function updateTypingTimer(){
  const elapsed = (performance.now()-typingStartTime)/1000;
  typingLeaderboard.textContent = `Best: -- s | Current: ${elapsed.toFixed(2)} s`;
}

typingInput.addEventListener('input', () => {
  if(typingInput.value === currentSentence){
    const elapsed = (performance.now()-typingStartTime)/1000;
    typingScore.textContent = `Correct! Time: ${elapsed.toFixed(2)}s`;
    const previousBest = parseFloat(typingLeaderboard.dataset.best) || Infinity;
    if(elapsed < previousBest){
      typingLeaderboard.dataset.best = elapsed;
      typingLeaderboard.textContent = `Best: ${elapsed.toFixed(2)} s`;
    }
    loadTypingSentence();
  }
});

loadTypingSentence();

/* ===== Classroom Cleanup ===== */
const classroomBoard = document.getElementById('classroomBoard');
const basket = document.getElementById('basket');
const resetCleanupBtn = document.getElementById('resetCleanupBtn');
const cleanupLeaderboard = document.getElementById('cleanupLeaderboard');

let draggingItem = null;
let cleanupStartTime, cleanupInterval;

function startCleanupTimer(){
  cleanupStartTime = performance.now();
  if(cleanupInterval) clearInterval(cleanupInterval);
  cleanupInterval = setInterval(updateCleanupTimer,50);
}

function updateCleanupTimer(){
  const elapsed = (performance.now() - cleanupStartTime)/1000;
  document.getElementById('cleanupTimer').textContent = `Time: ${elapsed.toFixed(2)}s`;
}

document.addEventListener('mousedown', e => {
  if(e.target.classList.contains('clutter-item')) draggingItem = e.target;
});
document.addEventListener('mouseup', e => {
  if(draggingItem){
    const rect = basket.getBoundingClientRect();
    const itemRect = draggingItem.getBoundingClientRect();
    if(itemRect.left + itemRect.width/2 > rect.left && itemRect.left + itemRect.width/2 < rect.right &&
       itemRect.top + itemRect.height/2 > rect.top && itemRect.top + itemRect.height/2 < rect.bottom){
      draggingItem.remove();
      if(document.querySelectorAll('.clutter-item').length === 0){
        clearInterval(cleanupInterval);
        const elapsed = (performance.now() - cleanupStartTime)/1000;
        const previousBest = parseFloat(cleanupLeaderboard.dataset.best) || Infinity;
        if(elapsed < previousBest){
          cleanupLeaderboard.dataset.best = elapsed;
          cleanupLeaderboard.textContent = `Best: ${elapsed.toFixed(2)} s`;
        }
      }
    }
    draggingItem = null;
  }
});
document.addEventListener('mousemove', e => {
  if(draggingItem){
    draggingItem.style.left = e.clientX - classroomBoard.offsetLeft - draggingItem.offsetWidth/2 + 'px';
    draggingItem.style.top = e.clientY - classroomBoard.offsetTop - draggingItem.offsetHeight/2 + 'px';
  }
});

resetCleanupBtn.addEventListener('click', () => {
  classroomBoard.innerHTML = '<div id="basket">🧺</div>';
  for(let i=0;i<6;i++){
    const item = document.createElement('div');
    item.className='clutter-item';
    item.textContent = ["📜","🖋️","📚","⚔️","🕰️","🍎"][i];
    item.style.top = Math.random()*200+'px';
    item.style.left = Math.random()*500+'px';
    classroomBoard.appendChild(item);
  }
  startCleanupTimer();
});

resetCleanupBtn.click();
