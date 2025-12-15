/* ===============================
   Kabir Malhi - 1776 Project JS
   Fully Fixed Version
   =============================== */

/* ===== Light/Dark Mode ===== */
const modeSwitch = document.getElementById('modeSwitch');
modeSwitch.checked = localStorage.getItem('theme') === 'light';
document.body.classList.toggle('light-mode', modeSwitch.checked);

modeSwitch.addEventListener('change', () => {
  document.body.classList.toggle('light-mode', modeSwitch.checked);
  localStorage.setItem('theme', modeSwitch.checked ? 'light' : 'dark');
});

/* ===== Cursor Glow ===== */
const cursorGlow = document.getElementById('cursorGlow');
let mouseX = 0, mouseY = 0;
document.addEventListener('mousemove', e => { mouseX = e.clientX; mouseY = e.clientY; });

function updateGlow(){
  cursorGlow.style.transform = `translate(${mouseX - 90}px, ${mouseY - 90}px)`;
  requestAnimationFrame(updateGlow);
}
updateGlow();

/* ===== Image Generator ===== */
const promptInput = document.getElementById('promptInput');
const generateBtn = document.getElementById('generateBtn');
const imageContainer = document.getElementById('imageContainer');

generateBtn.addEventListener('click', () => {
  const prompt = promptInput.value.trim();
  if (!prompt) return alert('Enter a prompt!');

  imageContainer.innerHTML = `
    <div class="spinner-wrapper">
      <div class="spinner"></div>
      <div class="spinner-text">Generating image...</div>
    </div>`;

  setTimeout(() => {
    const encodedPrompt = encodeURIComponent(prompt);
    imageContainer.innerHTML = `
      <img src="https://via.placeholder.com/400x250?text=${encodedPrompt}" 
           alt="Generated Image"
           style="border:2px solid var(--border-color); border-radius:12px;">`;
  }, 1500);
});

/* ===== Avatar Generator ===== */
const generateAvatarBtn = document.getElementById('generateAvatarBtn');
const avatarContainer = document.getElementById('avatarContainer');

generateAvatarBtn.addEventListener('click', () => {
  const gender = document.getElementById('genderSelect').value;
  const background = document.getElementById('backgroundSelect').value;
  const outfit = document.getElementById('outfitSelect').value;
  const hat = document.getElementById('hatSelect').value;
  const accessory = document.getElementById('accessorySelect').value;
  const hair = document.getElementById('hairSelect').value;
  const age = document.getElementById('ageSelect').value;
  const race = document.getElementById('raceSelect').value;

  avatarContainer.innerHTML = `
    <div class="spinner-wrapper">
      <div class="spinner"></div>
      <div class="spinner-text">Generating avatar...</div>
    </div>`;

  setTimeout(() => {
    const avatarText = `${gender}, ${age}, ${race}, ${hair} hair, ${hat}, ${outfit}, ${accessory}, ${background}`;
    avatarContainer.innerHTML = `
      <div style="
        padding:20px; 
        border:2px solid var(--border-color); 
        background: var(--container-bg); 
        border-radius:12px; 
        color: var(--text-color);
        font-weight:bold;
        text-align:center;">
        ${avatarText}
      </div>`;
  }, 1000);
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
  submitBtn.classList.remove('hidden');
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
  } else {
    questionEl.textContent = '';
    answersEl.innerHTML = '';
    progressContainer.innerHTML = '';
    scoreEl.textContent = `Your Score: ${score} / ${quizData.length}`;
    scoreEl.classList.remove('hidden');
    takeAgainBtn.classList.remove('hidden');
    submitBtn.classList.add('hidden');
    nextBtn.classList.add('hidden');
  }
});

takeAgainBtn.addEventListener('click', () => {
  currentQuestion = 0;
  score = 0;
  scoreEl.classList.add('hidden');
  takeAgainBtn.classList.add('hidden');
  loadQuestion();
});

/* ===== Memory Match ===== */
const memoryGrid = document.querySelector('#memoryGame .card-grid');
let memoryCards = [];
let memoryFlipped = [];
let memoryMatched = 0;

function createMemoryCards() {
  const values = [...Array(8).keys(), ...Array(8).keys()];
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
    back.textContent = val + 1;
    inner.appendChild(front);
    inner.appendChild(back);
    card.appendChild(inner);

    card.addEventListener('click', () => {
      if(memoryFlipped.length < 2 && !card.classList.contains('flipped')){
        card.classList.add('flipped');
        memoryFlipped.push({card, val});
        if(memoryFlipped.length === 2){
          setTimeout(checkMemoryMatch, 500);
        }
      }
    });

    memoryCards.push(card);
    memoryGrid.appendChild(card);
  });
}

function checkMemoryMatch(){
  const [first, second] = memoryFlipped;
  if(first.val === second.val){
    memoryMatched += 2;
  } else {
    first.card.classList.remove('flipped');
    second.card.classList.remove('flipped');
  }
  memoryFlipped = [];

  if(memoryMatched === memoryCards.length){
    setTimeout(() => alert('You matched all cards! 🎉'), 200);
  }
}

createMemoryCards();

/* ===== Typing Challenge ===== */
const typingInput = document.getElementById('typingInput');
const sentenceDisplay = document.getElementById('sentenceDisplay');
const typingScore = document.getElementById('typingScore');
const sentences = [
  "The sun rises over the colonial town.",
  "George Washington led his troops across the river.",
  "Colonists gathered to discuss independence.",
  "The market was busy with merchants and buyers.",
  "Children studied in the colonial schoolhouse."
];

let currentSentence = "";
let startTime = Date.now();

function loadTypingSentence(){
  currentSentence = sentences[Math.floor(Math.random()*sentences.length)];
  sentenceDisplay.textContent = currentSentence;
  typingInput.value = '';
  typingScore.textContent = '';
  typingInput.style.borderColor = 'var(--border-color)';
  startTime = Date.now();
}

typingInput.addEventListener('input', () => {
  const typed = typingInput.value;
  if(currentSentence.startsWith(typed)){
    typingInput.style.borderColor = 'var(--border-color)';
  } else {
    typingInput.style.borderColor = 'var(--wrong-color)';
  }
  if(typed === currentSentence){
    const elapsed = ((Date.now() - startTime)/1000).toFixed(2);
    typingScore.textContent = `Correct! Time: ${elapsed}s`;
    loadTypingSentence();
  }
});

loadTypingSentence();

/* ===== Classroom Cleanup ===== */
const classroomBoard = document.getElementById('classroomBoard');
const basket = document.getElementById('basket');

// Create clutter items dynamically
for(let i=0;i<8;i++){
  const item = document.createElement('div');
  item.className = 'clutter-item';
  item.textContent = '📚';
  item.style.fontSize = '28px';
  item.style.left = `${Math.random() * 80}%`;
  item.style.top = `${Math.random() * 80}%`;
  classroomBoard.appendChild(item);
}

let draggingItem = null;
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

/* ===== Reset Buttons ===== */
const resetMemoryBtn = document.createElement('button');
resetMemoryBtn.textContent = 'Reset Memory Game';
resetMemoryBtn.style.marginTop = '10px';
memoryGrid.parentElement.appendChild(resetMemoryBtn);
resetMemoryBtn.addEventListener('click', createMemoryCards);

const resetTypingBtn = document.createElement('button');
resetTypingBtn.textContent = 'Reset Typing Challenge';
resetTypingBtn.style.marginTop = '10px';
typingInput.parentElement.appendChild(resetTypingBtn);
resetTypingBtn.addEventListener('click', loadTypingSentence);
