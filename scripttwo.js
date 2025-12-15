/* ===== Theme Toggle ===== */
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

/* ===== Image Generator ===== */
const promptInput = document.getElementById('promptInput');
const generateBtn = document.getElementById('generateBtn');
const imageContainer = document.getElementById('imageContainer');

generateBtn.addEventListener('click', () => {
  const prompt = promptInput.value.trim();
  if (!prompt) return;
  
  // Example placeholder, replace with actual AI/image API if desired
  const img = document.createElement('img');
  img.src = `https://via.placeholder.com/400x250.png?text=${encodeURIComponent(prompt)}`;
  img.alt = prompt;
  img.style.marginTop = '15px';
  imageContainer.innerHTML = '';
  imageContainer.appendChild(img);
});

/* ===== Avatar Generator ===== */
const avatarContainer = document.getElementById('avatarContainer');
document.getElementById('generateAvatarBtn').addEventListener('click', () => {
  const gender = document.getElementById('genderSelect').value;
  const background = document.getElementById('backgroundSelect').value;
  const outfit = document.getElementById('outfitSelect').value;
  const hat = document.getElementById('hatSelect').value;
  const accessory = document.getElementById('accessorySelect').value;
  const hair = document.getElementById('hairSelect').value;
  const age = document.getElementById('ageSelect').value;
  const race = document.getElementById('raceSelect').value;

  // Placeholder: replace with actual avatar generator API
  const img = document.createElement('img');
  img.src = `https://via.placeholder.com/300x400.png?text=${encodeURIComponent(gender + ' ' + age + ' ' + race)}`;
  img.alt = '1776 Avatar';
  avatarContainer.innerHTML = '';
  avatarContainer.appendChild(img);
});

/* ===== Quiz ===== */
const quizData = [
  { q: "What year did the Declaration of Independence get signed?", a: ["1776","1789","1492","1804"], correct: 0 },
  { q: "Who was the first President of the United States?", a: ["George Washington","Thomas Jefferson","John Adams","Benjamin Franklin"], correct: 0 },
  { q: "What was a common material for colonial clothing?", a: ["Cotton","Polyester","Nylon","Silk"], correct: 0 }
];
let currentQuestion = 0;
let score = 0;
const questionEl = document.getElementById('question');
const answersEl = document.getElementById('answers');
const submitBtn = document.getElementById('submitBtn');
const nextBtn = document.getElementById('nextBtn');
const takeAgainBtn = document.getElementById('takeAgainBtn');
const scoreEl = document.getElementById('score');

function showQuestion() {
  const q = quizData[currentQuestion];
  questionEl.textContent = q.q;
  answersEl.innerHTML = '';
  q.a.forEach((ans, idx) => {
    const btn = document.createElement('button');
    btn.textContent = ans;
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
  const idx = Array.from(answersEl.children).indexOf(selected);
  if (idx === q.correct) {
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
    showQuestion();
    submitBtn.classList.remove('hidden');
  } else {
    questionEl.textContent = "Quiz Finished!";
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
  showQuestion();
});
showQuestion();

/* ===== Memory Match ===== */
const memoryGame = document.querySelector('#memoryGame .card-grid');
const memoryTimerEl = document.getElementById('memoryTimer');
const memoryLeaderboard = document.getElementById('memoryLeaderboard');
let memoryStartTime, memoryInterval, memoryBestTime = localStorage.getItem('memoryBest') || '--';
memoryLeaderboard.textContent = `Best: ${memoryBestTime} s`;

const icons = ['🪑','📚','🖋️','⚔️','🪑','📚','🖋️','⚔️'];
function shuffle(a){return a.sort(()=>0.5-Math.random());}
function createMemoryCards(){
  memoryGame.innerHTML = '';
  const shuffled = shuffle([...icons]);
  shuffled.forEach(icon => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `<div class="card-inner"><div class="card-front"></div><div class="card-back">${icon}</div></div>`;
    memoryGame.appendChild(card);
  });
}
createMemoryCards();

let flipped = [];
memoryGame.addEventListener('click', e => {
  const card = e.target.closest('.card');
  if (!card || card.classList.contains('flipped')) return;
  card.classList.add('flipped');
  flipped.push(card);
  if (flipped.length === 2){
    if (flipped[0].querySelector('.card-back').textContent === flipped[1].querySelector('.card-back').textContent){
      flipped = [];
      if(!memoryStartTime){ memoryStartTime = Date.now(); memoryInterval = setInterval(updateMemoryTimer, 100); }
      if([...memoryGame.children].every(c=>c.classList.contains('flipped'))){
        clearInterval(memoryInterval);
        const time = ((Date.now() - memoryStartTime)/1000).toFixed(2);
        if(memoryBestTime==='--' || time<memoryBestTime){ memoryBestTime=time; localStorage.setItem('memoryBest', time); }
        memoryLeaderboard.textContent = `Best: ${memoryBestTime} s`;
        memoryStartTime=null;
        memoryTimerEl.textContent=`Time: 0.00s`;
      }
    } else {
      setTimeout(()=>{ flipped.forEach(c=>c.classList.remove('flipped')); flipped=[]; }, 800);
    }
  }
});

function updateMemoryTimer(){
  if(memoryStartTime) memoryTimerEl.textContent = `Time: ${((Date.now()-memoryStartTime)/1000).toFixed(2)}s`;
}

/* ===== Typing Challenge ===== */
const sentences = ["The colonists gather at the town square.","George Washington was the first president.","Colonial schools used slates and quills."];
const sentenceDisplay = document.getElementById('sentenceDisplay');
const typingInput = document.getElementById('typingInput');
const typingScore = document.getElementById('typingScore');
const typingLeaderboard = document.getElementById('typingLeaderboard');
let currentSentenceIndex = 0, typingStartTime, typingBestTime = localStorage.getItem('typingBest') || '--';
typingLeaderboard.textContent = `Best: ${typingBestTime} s`;

function newTypingSentence(){
  sentenceDisplay.textContent = sentences[currentSentenceIndex];
  typingInput.value = '';
  typingStartTime = Date.now();
}
newTypingSentence();

typingInput.addEventListener('input', () => {
  if(typingInput.value === sentences[currentSentenceIndex]){
    const time = ((Date.now()-typingStartTime)/1000).toFixed(2);
    typingScore.textContent = `Completed in ${time}s`;
    if(typingBestTime==='--' || time<typingBestTime){ typingBestTime=time; localStorage.setItem('typingBest', time); typingLeaderboard.textContent=`Best: ${typingBestTime} s`; }
    currentSentenceIndex = (currentSentenceIndex+1)%sentences.length;
    setTimeout(newTypingSentence, 800);
  }
});

/* ===== Classroom Cleanup ===== */
const classroomBoard = document.getElementById('classroomBoard');
const cleanupTimerEl = document.getElementById('cleanupTimer');
const cleanupLeaderboard = document.getElementById('cleanupLeaderboard');
let cleanupStartTime, cleanupInterval, cleanupBestTime = localStorage.getItem('cleanupBest') || '--';
cleanupLeaderboard.textContent = `Best: ${cleanupBestTime} s`;

document.getElementById('resetCleanupBtn').addEventListener('click', initCleanup);

function initCleanup(){
  classroomBoard.innerHTML = '<div id="basket">🧺</div>';
  cleanupStartTime = Date.now();
  cleanupInterval = setInterval(()=>{ cleanupTimerEl.textContent = `Time: ${((Date.now()-cleanupStartTime)/1000).toFixed(2)}s`; }, 100);
  const basket = document.getElementById('basket');
  basket.addEventListener('dragover', e => e.preventDefault());
  basket.addEventListener('drop', e => {
    const item = document.querySelector('.dragging');
    if(item){ item.remove(); checkCleanupDone(); }
  });
  for(let i=0;i<5;i++){
    const item = document.createElement('div');
    item.className = 'clutter-item';
    item.textContent = ['📚','🖋️','⚔️','🪑','🪄'][i];
    item.style.top = Math.random()*200+'px';
    item.style.left = Math.random()*500+'px';
    item.draggable=true;
    item.addEventListener('dragstart', e => { item.classList.add('dragging'); });
    item.addEventListener('dragend', e => { item.classList.remove('dragging'); });
    classroomBoard.appendChild(item);
  }
}
function checkCleanupDone(){
  if(classroomBoard.querySelectorAll('.clutter-item').length===0){
    clearInterval(cleanupInterval);
    const time = ((Date.now()-cleanupStartTime)/1000).toFixed(2);
    if(cleanupBestTime==='--' || time<cleanupBestTime){ cleanupBestTime=time; localStorage.setItem('cleanupBest', time); }
    cleanupLeaderboard.textContent=`Best: ${cleanupBestTime} s`;
    cleanupTimerEl.textContent=`Time: 0.00s`;
  }
}
initCleanup();
