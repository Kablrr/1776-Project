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

/* ===== Image Generator (Dummy Placeholder) ===== */
const generateBtn = document.getElementById('generateBtn');
const imageContainer = document.getElementById('imageContainer');
generateBtn.addEventListener('click', () => {
  const prompt = document.getElementById('promptInput').value;
  if (!prompt) return;
  imageContainer.innerHTML = `<div class="spinner-wrapper"><div class="spinner"></div><div class="spinner-text">Generating image for "${prompt}"...</div></div>`;
  setTimeout(() => {
    imageContainer.innerHTML = `<img src="https://via.placeholder.com/400x300?text=${encodeURIComponent(prompt)}" alt="Generated Image">`;
  }, 1200);
});

/* ===== Avatar Generator (Dummy Placeholder) ===== */
const generateAvatarBtn = document.getElementById('generateAvatarBtn');
const avatarContainer = document.getElementById('avatarContainer');
generateAvatarBtn.addEventListener('click', () => {
  const gender = document.getElementById('genderSelect').value;
  const bg = document.getElementById('backgroundSelect').value;
  const outfit = document.getElementById('outfitSelect').value;
  avatarContainer.innerHTML = `<img src="https://via.placeholder.com/200x300?text=${gender}+${outfit}+in+${bg}" alt="Avatar">`;
});

/* ===== Quiz (10 Questions) ===== */
const quizData = [
  { q: "Year Declaration of Independence was signed?", a: ["1775","1776","1777","1781"], correct: 1 },
  { q: "Commander of Continental Army?", a: ["Thomas Jefferson","Benjamin Franklin","George Washington","John Adams"], correct: 2 },
  { q: "Document ending Revolutionary War?", a: ["Bill of Rights","Treaty of Paris","Articles of Confederation","Constitution"], correct: 1 },
  { q: "Which city was first capital of USA?", a: ["Philadelphia","New York","Boston","Washington DC"], correct: 0 },
  { q: "Who wrote most of the Declaration?", a: ["Jefferson","Adams","Washington","Franklin"], correct: 0 },
  { q: "What was the first US national flag called?", a: ["Stars and Stripes","Grand Union","Betsy Ross Flag","Gadsden Flag"], correct: 1 },
  { q: "What year did the Revolutionary War start?", a: ["1774","1775","1776","1777"], correct: 1 },
  { q: "Who was the primary author of the Articles of Confederation?", a: ["John Dickinson","Thomas Paine","Benjamin Franklin","Alexander Hamilton"], correct: 0 },
  { q: "Which battle is considered the turning point of the war?", a: ["Bunker Hill","Saratoga","Yorktown","Trenton"], correct: 1 },
  { q: "Which treaty officially recognized US independence?", a: ["Treaty of Paris","Treaty of Versailles","Treaty of Ghent","Jay Treaty"], correct: 0 }
];

let currentQuestion = 0;
let score = 0;

const questionEl = document.getElementById('question');
const answersEl = document.getElementById('answers');
const submitBtn = document.getElementById('submitBtn');
const nextBtn = document.getElementById('nextBtn');
const takeAgainBtn = document.getElementById('takeAgainBtn');
const scoreEl = document.getElementById('score');

function loadQuestion() {
  const q = quizData[currentQuestion];
  questionEl.textContent = q.q;
  answersEl.innerHTML = '';
  
  q.a.forEach((answer, idx) => {
    const btn = document.createElement('button');
    btn.textContent = answer;
    btn.addEventListener('click', () => {
      Array.from(answersEl.children).forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      submitBtn.disabled = false;
    });
    answersEl.appendChild(btn);
  });
  
  submitBtn.disabled = true;
  nextBtn.classList.add('hidden');
}

submitBtn.addEventListener('click', () => {
  const selected = Array.from(answersEl.children).find(b => b.classList.contains('selected'));
  if (!selected) return;
  const q = quizData[currentQuestion];
  const selectedIndex = Array.from(answersEl.children).indexOf(selected);

  if (selectedIndex === q.correct) {
    selected.classList.add('correct');
    score++;
  } else {
    selected.classList.add('wrong');
    answersEl.children[q.correct].classList.add('correct');
  }

  submitBtn.classList.add('hidden');
  nextBtn.classList.remove('hidden');
});

nextBtn.addEventListener('click', () => {
  currentQuestion++;
  if (currentQuestion < quizData.length) {
    loadQuestion();
    submitBtn.classList.remove('hidden');
  } else {
    questionEl.textContent = "Quiz Completed!";
    answersEl.innerHTML = '';
    scoreEl.textContent = `Your score: ${score}/${quizData.length}`;
    scoreEl.classList.remove('hidden');
    nextBtn.classList.add('hidden');
    takeAgainBtn.classList.remove('hidden');
  }
});

takeAgainBtn.addEventListener('click', () => {
  currentQuestion = 0;
  score = 0;
  scoreEl.classList.add('hidden');
  takeAgainBtn.classList.add('hidden');
  submitBtn.classList.remove('hidden');
  loadQuestion();
});

loadQuestion();

/* ===== Memory Match Game ===== */
const memoryGrid = document.querySelector('#memoryGame .card-grid');
const memoryTimerEl = document.getElementById('memoryTimer');
const memoryResetBtn = document.createElement('button');
memoryResetBtn.textContent = 'Reset';
memoryResetBtn.style.marginTop = '10px';
document.getElementById('memoryGame').appendChild(memoryResetBtn);

let memoryCards = ['🍎','🍌','🍒','🍇','🍎','🍌','🍒','🍇'];
let memoryTimer, memoryStartTime;
let flipped = [];
let matched = [];

function shuffle(array){ return array.sort(() => Math.random()-0.5); }

function startMemoryGame(){
  memoryGrid.innerHTML = '';
  flipped = []; matched = [];
  const cards = shuffle(memoryCards.slice());
  cards.forEach(symbol => {
    const card = document.createElement('div'); card.className = 'card';
    const inner = document.createElement('div'); inner.className='card-inner';
    const front = document.createElement('div'); front.className='card-front';
    const back = document.createElement('div'); back.className='card-back';
    front.textContent = '?'; back.textContent = symbol;
    inner.appendChild(front); inner.appendChild(back);
    card.appendChild(inner);
    card.addEventListener('click', () => flipMemoryCard(card, symbol));
    memoryGrid.appendChild(card);
  });
  memoryStartTime = Date.now();
  clearInterval(memoryTimer);
  memoryTimer = setInterval(() => {
    const t = ((Date.now() - memoryStartTime)/1000).toFixed(2);
    memoryTimerEl.textContent = `Time: ${t}s`;
  },100);
}

function flipMemoryCard(card,symbol){
  if(flipped.length>=2 || matched.includes(symbol)) return;
  card.classList.add('flipped'); flipped.push({card,symbol});
  if(flipped.length===2){
    setTimeout(() => {
      if(flipped[0].symbol === flipped[1].symbol){
        matched.push(flipped[0].symbol);
      } else {
        flipped[0].card.classList.remove('flipped');
        flipped[1].card.classList.remove('flipped');
      }
      flipped=[];
      if(matched.length===memoryCards.length/2){ clearInterval(memoryTimer); }
    },600);
  }
}

memoryResetBtn.addEventListener('click', startMemoryGame);
startMemoryGame();

/* ===== Typing Challenge ===== */
const sentenceDisplay = document.getElementById('sentenceDisplay');
const typingInput = document.getElementById('typingInput');
const typingScoreEl = document.getElementById('typingScore');
const typingResetBtn = document.createElement('button');
typingResetBtn.textContent = 'Reset';
document.getElementById('typingGame').appendChild(typingResetBtn);

let typingSentence = "The colonial school children wrote with quills.";
function startTypingGame(){
  sentenceDisplay.textContent = typingSentence;
  typingInput.value = '';
  typingScoreEl.textContent = '';
}
typingInput.addEventListener('input', () => {
  const value = typingInput.value;
  if(typingSentence.startsWith(value)){
    typingScoreEl.textContent = `Progress: ${value.length}/${typingSentence.length}`;
    typingScoreEl.classList.remove('error');
  } else {
    typingScoreEl.textContent = 'Typing Error!';
    typingScoreEl.classList.add('error');
  }
});
typingResetBtn.addEventListener('click', startTypingGame);
startTypingGame();

/* ===== Classroom Cleanup ===== */
const cleanupBoard = document.getElementById('classroomBoard');
const cleanupTimerEl = document.getElementById('cleanupTimer');
const resetCleanupBtn = document.getElementById('resetCleanupBtn');
let cleanupStartTime, cleanupTimer;

function startCleanup(){
  cleanupBoard.innerHTML = '<div id="basket">🧺</div>';
  cleanupStartTime = Date.now();
  clearInterval(cleanupTimer);
  cleanupTimer = setInterval(() => {
    const t = ((Date.now() - cleanupStartTime)/1000).toFixed(2);
    cleanupTimerEl.textContent = `Time: ${t}s`;
  },100);
}
resetCleanupBtn.addEventListener('click', startCleanup);
startCleanup();
