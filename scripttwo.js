// ===== Cursor Glow =====
const cursorGlow = document.getElementById('cursorGlow');
document.addEventListener('mousemove', e => {
  cursorGlow.style.top = `${e.clientY}px`;
  cursorGlow.style.left = `${e.clientX}px`;
});

// ===== Spinner Helper =====
function createSpinner(text='May take up to a minute to generate') {
  const wrapper = document.createElement('div');
  wrapper.className = 'spinner-wrapper';
  wrapper.innerHTML = `<div class="spinner"></div><div class="spinner-text">${text}</div>`;
  return wrapper;
}

// ===== Text-to-Image Generator =====
const generateBtn = document.getElementById('generateBtn');
const promptInput = document.getElementById('promptInput');
const imageContainer = document.getElementById('imageContainer');

generateBtn.addEventListener('click', () => {
  const userPrompt = promptInput.value.trim();
  if(!userPrompt) return alert('Enter a colonial scene!');
  
  const prompt = `Colonial American scene, 1776. ${userPrompt}. Historical realism, 18th century atmosphere, oil painting.`;
  
  imageContainer.innerHTML = '';
  const spinner = createSpinner();
  imageContainer.appendChild(spinner);

  const img = new Image();
  img.alt = prompt;
  img.style.maxWidth = '300px';
  img.style.width = '100%';
  img.style.border = '2px solid #4b2e2a';
  img.style.borderRadius = '12px';

  img.onload = () => {
    spinner.remove();
    imageContainer.appendChild(img);
  };
  img.onerror = () => { spinner.remove(); alert('Failed to generate image. Try again.'); };
  img.src = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}`;
});

// ===== Avatar Generator =====
const generateAvatarBtn = document.getElementById('generateAvatarBtn');
const avatarContainer = document.getElementById('avatarContainer');

generateAvatarBtn.addEventListener('click', () => {
  const fields = ['gender','background','outfit','hat','accessory','hair','age','race'];
  const values = fields.map(f => document.getElementById(f+'Select').value);
  const [gender,background,outfit,hat,accessory,hair,age,heritage] = values;

  const prompt = `Colonial American portrait 1776. ${age} ${gender} of ${heritage} heritage, wearing ${outfit} and ${hat}. Hairstyle: ${hair}. Accessory: ${accessory}. Background: ${background}. Oil painting style.`;

  avatarContainer.innerHTML = '';
  const spinner = createSpinner();
  avatarContainer.appendChild(spinner);

  const img = new Image();
  img.alt = '1776 Avatar';
  img.style.maxWidth = '220px';
  img.style.width = '100%';
  img.style.border = '2px solid #4b2e2a';
  img.style.borderRadius = '14px';

  img.onload = () => { spinner.remove(); avatarContainer.appendChild(img); };
  img.onerror = () => { spinner.remove(); alert('Failed to generate avatar. Try again.'); };
  img.src = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}`;
});

// ===== Quiz with Sound Effects =====
const quizData = [
  {q:"Year Declaration of Independence was signed?", o:["1775","1776","1777","1781"], a:"1776"},
  {q:"Commander of Continental Army?", o:["Thomas Jefferson","Benjamin Franklin","George Washington","John Adams"], a:"George Washington"},
  {q:"Document ending Revolutionary War?", o:["Bill of Rights","Treaty of Paris","Articles of Confederation","Constitution"], a:"Treaty of Paris"},
  {q:"Which city was first capital of USA?", o:["Philadelphia","New York","Boston","Washington DC"], a:"New York"},
  {q:"Who wrote the most of the Declaration?", o:["Jefferson","Adams","Washington","Franklin"], a:"Jefferson"},
  {q:"Which battle was first major battle?", o:["Bunker Hill","Lexington","Saratoga","Yorktown"], a:"Bunker Hill"},
  {q:"Who was king of Britain?", o:["George I","George II","George III","George IV"], a:"George III"},
  {q:"What year did war start?", o:["1774","1775","1776","1777"], a:"1775"},
  {q:"Famous spy during revolution?", o:["Nathan Hale","Benjamin Franklin","Paul Revere","John Hancock"], a:"Nathan Hale"},
  {q:"Which treaty ended war?", o:["Paris","Versailles","London","Madrid"], a:"Paris"}
];

let currentQuestion = 0, score = 0;
const progressContainer = document.getElementById('progressContainer');
const questionEl = document.getElementById('question');
const answersEl = document.getElementById('answers');
const submitBtn = document.getElementById('submitBtn');
const nextBtn = document.getElementById('nextBtn');
const takeAgainBtn = document.getElementById('takeAgainBtn');
const scoreEl = document.getElementById('score');

// Sound effects
const correctSound = new Audio('correct.mp3');
const wrongSound = new Audio('wrong.mp3');
const completeSound = new Audio('complete.mp3');

function initProgressBar() {
  progressContainer.innerHTML = '';
  quizData.forEach(() => {
    const segment = document.createElement('div');
    segment.className = 'progress-segment';
    progressContainer.appendChild(segment);
  });
}

function loadQuestion() {
  submitBtn.disabled = true;
  submitBtn.classList.remove('hidden');
  nextBtn.classList.add('hidden');

  const q = quizData[currentQuestion];
  questionEl.textContent = q.q;
  answersEl.innerHTML = '';

  [...q.o].sort(() => Math.random() - 0.5).forEach(opt => {
    const btn = document.createElement('button');
    btn.textContent = opt;
    btn.addEventListener('click', () => {
      document.querySelectorAll('#answers button').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      submitBtn.disabled = false;
    });
    answersEl.appendChild(btn);
  });
}

function markProgress(isCorrect){
  const segments = document.querySelectorAll('.progress-segment');
  if(segments[currentQuestion]) segments[currentQuestion].style.backgroundColor = isCorrect ? '#4f7c4a' : '#8c3a2b';
}

submitBtn.addEventListener('click', () => {
  const selected = document.querySelector('#answers button.selected');
  if(!selected) return;
  const isCorrect = selected.textContent === quizData[currentQuestion].a;

  Array.from(document.querySelectorAll('#answers button')).forEach(btn => {
    btn.disabled = true;
    if(btn.textContent === quizData[currentQuestion].a) btn.classList.add('correct');
  });

  if(isCorrect){
    score++;
    correctSound.play();
  } else {
    selected.classList.add('wrong');
    wrongSound.play();
  }

  markProgress(isCorrect);
  submitBtn.classList.add('hidden');
  nextBtn.classList.remove('hidden');
});

nextBtn.addEventListener('click', () => {
  currentQuestion++;
  if(currentQuestion >= quizData.length) showScore();
  else loadQuestion();
});

function showScore(){
  questionEl.textContent = 'Quiz Completed!';
  answersEl.innerHTML = '';
  submitBtn.classList.add('hidden');
  nextBtn.classList.add('hidden');
  takeAgainBtn.classList.remove('hidden');
  scoreEl.textContent = `Your Score: ${score} / ${quizData.length}`;
  scoreEl.classList.remove('hidden');

  completeSound.play();
}

takeAgainBtn.addEventListener('click', () => {
  currentQuestion = 0;
  score = 0;
  scoreEl.classList.add('hidden');
  takeAgainBtn.classList.add('hidden');
  initProgressBar();
  loadQuestion();
});

// ===== Initialize Quiz =====
initProgressBar();
loadQuestion();

// ===== Colonial Memory Match 3D Flip =====
const memoryEmojis = ['📚','✒️','📜','🖋️','🗺️','🏮','🎩','⚔️'];
let memoryDeck = [...memoryEmojis, ...memoryEmojis];
let memoryGrid = document.querySelector('#memoryGame .card-grid');
let memoryFlipped = [];
let memoryMatches = 0;

function shuffle(array){ return array.sort(() => Math.random() - 0.5); }

function initMemoryGame() {
  memoryGrid.innerHTML = '';
  memoryDeck = shuffle(memoryDeck);
  memoryFlipped = [];
  memoryMatches = 0;

  memoryDeck.forEach((emoji) => {
    const card = document.createElement('div');
    card.className = 'card';
    card.dataset.value = emoji;
    card.innerHTML = `
      <div class="card-inner">
        <div class="card-front">?</div>
        <div class="card-back">${emoji}</div>
      </div>
    `;
    card.addEventListener('click', () => flipCard(card));
    memoryGrid.appendChild(card);
  });

  document.getElementById('memoryScore').textContent = '';
}

function flipCard(card) {
  if (memoryFlipped.length >= 2 || card.classList.contains('matched') || card.classList.contains('flipped')) return;
  card.classList.add('flipped');
  memoryFlipped.push(card);

  if (memoryFlipped.length === 2) setTimeout(checkMatch, 800);
}

function checkMatch() {
  const [c1, c2] = memoryFlipped;
  if (c1.dataset.value === c2.dataset.value) {
    c1.classList.add('matched');
    c2.classList.add('matched');
    memoryMatches++;
  } else {
    c1.classList.remove('flipped');
    c2.classList.remove('flipped');
  }
  memoryFlipped = [];

  if (memoryMatches === memoryEmojis.length) {
    document.getElementById('memoryScore').textContent = '🎉 You matched all cards! 🎉';
  }
}

initMemoryGame();

// ===== Typing Challenge =====
const sentences = [
  "Learn your lessons well in the colonial classroom.",
  "Quills and ink were the tools of every student.",
  "1776 was a year of revolution and learning.",
  "Books were rare and treasured in colonial schools."
];
let typingIndex = 0;
let typingStart = 0;
const sentenceDisplay = document.getElementById('sentenceDisplay');
const typingInput = document.getElementById('typingInput');
const typingScore = document.getElementById('typingScore');

function loadTypingSentence(){
  const sentence = sentences[typingIndex];
  sentenceDisplay.textContent = sentence;
  typingInput.value = '';
  typingStart = Date.now();
}

typingInput.addEventListener('input', ()=>{
  const sentence = sentences[typingIndex];
  if(typingInput.value === sentence){
    const time = ((Date.now()-typingStart)/1000).toFixed(2);
    typingScore.textContent = `Correct! Time: ${time} seconds`;
    typingIndex = (typingIndex+1)%sentences.length;
    setTimeout(loadTypingSentence, 800);
  }
});

loadTypingSentence();

// ===== Classroom Cleanup Game =====
const cleanupBoard = document.querySelector('.classroom-board');
const cleanupItems = ['Book','Quill','Scroll','Lantern','Hat','Sword'];

cleanupItems.forEach(item=>{
  const div = document.createElement('div');
  div.className = 'item';
  div.textContent = item;
  div.draggable = true;
  div.addEventListener('dragstart', e=>{ e.dataTransfer.setData('text/plain', item); });
  cleanupBoard.appendChild(div);
});

cleanupBoard.addEventListener('dragover', e=> e.preventDefault());
cleanupBoard.addEventListener('drop', e=>{
  e.preventDefault();
  const item = e.dataTransfer.getData('text/plain');
  const divs = Array.from(cleanupBoard.querySelectorAll('.item'));
  const target = divs.find(d=>d.textContent === item && !d.classList.contains('dropped'));
  if(target){
    target.classList.add('dropped');
    target.style.background = '#4f7c4a';
    target.style.color = '#fff';
    document.getElementById('cleanupScore').textContent = 'Item placed correctly!';
  }
});

