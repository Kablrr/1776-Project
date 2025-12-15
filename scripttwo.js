// ================= CURSOR GLOW =================
const cursorGlow = document.getElementById('cursorGlow');
document.addEventListener('mousemove', e => {
  cursorGlow.style.top = `${e.clientY}px`;
  cursorGlow.style.left = `${e.clientX}px`;
});

// ================= SOUNDS =================
const correctSound = new Audio('sounds/correct.mp3');
correctSound.volume = 0.3;

const wrongSound = new Audio('sounds/wrong.mp3');
wrongSound.volume = 0.4;

const completeSound = new Audio('sounds/complete.mp3');
completeSound.volume = 0.2;

// ---- Unlock audio (REQUIRED for browsers) ----
let audioUnlocked = false;

function unlockAudio() {
  if (audioUnlocked) return;
  [correctSound, wrongSound, completeSound].forEach(s => {
    s.play().then(() => {
      s.pause();
      s.currentTime = 0;
    }).catch(() => {});
  });
  audioUnlocked = true;
  document.removeEventListener('click', unlockAudio);
  document.removeEventListener('keydown', unlockAudio);
}

document.addEventListener('click', unlockAudio);
document.addEventListener('keydown', unlockAudio);

// ---- Safe sound play helper ----
function playSound(sound) {
  sound.currentTime = 0;
  sound.play().catch(() => {});
}

// ================= SPINNER =================
function createSpinner(text = 'May take a moment to generate...') {
  const wrapper = document.createElement('div');
  wrapper.className = 'spinner-wrapper';
  wrapper.innerHTML = `<div class="spinner"></div><div class="spinner-text">${text}</div>`;
  return wrapper;
}

// ================= TEXT TO IMAGE =================
const generateBtn = document.getElementById('generateBtn');
const promptInput = document.getElementById('promptInput');
const imageContainer = document.getElementById('imageContainer');

generateBtn.addEventListener('click', () => {
  const userPrompt = promptInput.value.trim();
  if (!userPrompt) return alert('Enter a colonial scene!');

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
    playSound(completeSound);
  };

  img.onerror = () => {
    spinner.remove();
    alert('Failed to generate image.');
  };

  img.src = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}`;
});

// ================= AVATAR GENERATOR =================
const generateAvatarBtn = document.getElementById('generateAvatarBtn');
const avatarContainer = document.getElementById('avatarContainer');

generateAvatarBtn.addEventListener('click', () => {
  const fields = ['gender','background','outfit','hat','accessory','hair','age','race'];
  const values = fields.map(f => document.getElementById(f + 'Select').value);
  const [gender, background, outfit, hat, accessory, hair, age, heritage] = values;

  const prompt = `Colonial American portrait 1776. ${age} ${gender} of ${heritage} heritage, wearing ${outfit} and ${hat}. Hairstyle: ${hair}. Accessory: ${accessory}. Background: ${background}. Oil painting style.`;

  avatarContainer.innerHTML = '';
  const spinner = createSpinner();
  avatarContainer.appendChild(spinner);

  const img = new Image();
  img.style.maxWidth = '220px';
  img.style.width = '100%';
  img.style.border = '2px solid #4b2e2a';
  img.style.borderRadius = '14px';

  img.onload = () => {
    spinner.remove();
    avatarContainer.appendChild(img);
    playSound(completeSound);
  };

  img.onerror = () => spinner.remove();
  img.src = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}`;
});

// ================= QUIZ =================
const quizData = [
  {q:"Year Declaration of Independence was signed?", o:["1775","1776","1777","1781"], a:"1776"},
  {q:"Commander of Continental Army?", o:["Thomas Jefferson","Benjamin Franklin","George Washington","John Adams"], a:"George Washington"},
  {q:"Document ending Revolutionary War?", o:["Bill of Rights","Treaty of Paris","Articles of Confederation","Constitution"], a:"Treaty of Paris"},
  {q:"Which city was first capital of USA?", o:["Philadelphia","New York","Boston","Washington DC"], a:"New York"},
  {q:"Who wrote most of the Declaration?", o:["Jefferson","Adams","Washington","Franklin"], a:"Jefferson"},
  {q:"Which battle was first major battle?", o:["Bunker Hill","Lexington","Saratoga","Yorktown"], a:"Bunker Hill"},
  {q:"Who was king of Britain?", o:["George I","George II","George III","George IV"], a:"George III"},
  {q:"What year did war start?", o:["1774","1775","1776","1777"], a:"1775"},
  {q:"Famous spy during revolution?", o:["Nathan Hale","Benjamin Franklin","Paul Revere","John Hancock"], a:"Nathan Hale"},
  {q:"Which treaty ended war?", o:["Paris","Versailles","London","Madrid"], a:"Paris"}
];

let currentQuestion = 0, quizScore = 0;
const progressContainer = document.getElementById('progressContainer');
const questionEl = document.getElementById('question');
const answersEl = document.getElementById('answers');
const submitBtn = document.getElementById('submitBtn');
const nextBtn = document.getElementById('nextBtn');
const takeAgainBtn = document.getElementById('takeAgainBtn');
const scoreEl = document.getElementById('score');

function initProgressBar() {
  progressContainer.innerHTML = '';
  quizData.forEach(() => {
    const div = document.createElement('div');
    div.className = 'progress-segment';
    progressContainer.appendChild(div);
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
    btn.onclick = () => {
      document.querySelectorAll('#answers button').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      submitBtn.disabled = false;
    };
    answersEl.appendChild(btn);
  });
}

submitBtn.addEventListener('click', () => {
  const selected = document.querySelector('#answers button.selected');
  if (!selected) return;

  const isCorrect = selected.textContent === quizData[currentQuestion].a;
  if (isCorrect) playSound(correctSound);
  else playSound(wrongSound);

  quizScore += isCorrect ? 1 : 0;
  currentQuestion++;

  if (currentQuestion >= quizData.length) {
    questionEl.textContent = 'Quiz Completed!';
    answersEl.innerHTML = '';
    scoreEl.textContent = `Your Score: ${quizScore} / ${quizData.length}`;
    scoreEl.classList.remove('hidden');
    playSound(completeSound);
  } else {
    loadQuestion();
  }
});

initProgressBar();
loadQuestion();

// ================= MEMORY MATCH =================
const memoryEmojis = ['📚','✒️','📜','🖋️','🗺️','🏮','🎩','⚔️'];
const memoryGrid = document.querySelector('#memoryGame .card-grid');
let memoryFlipped = [], memoryMatches = 0;

function initMemoryGame() {
  memoryGrid.innerHTML = '';
  memoryMatches = 0;
  memoryFlipped = [];

  [...memoryEmojis, ...memoryEmojis].sort(() => Math.random() - 0.5).forEach(emoji => {
    const card = document.createElement('div');
    card.className = 'card';
    card.dataset.value = emoji;
    card.innerHTML = `<div class="card-inner"><div class="card-front">?</div><div class="card-back">${emoji}</div></div>`;
    card.onclick = () => flipCard(card);
    memoryGrid.appendChild(card);
  });
}

function flipCard(card) {
  if (memoryFlipped.length === 2 || card.classList.contains('flipped')) return;
  card.classList.add('flipped');
  memoryFlipped.push(card);

  if (memoryFlipped.length === 2) {
    setTimeout(() => {
      const [a,b] = memoryFlipped;
      if (a.dataset.value === b.dataset.value) {
        memoryMatches++;
        if (memoryMatches === memoryEmojis.length) playSound(completeSound);
      } else {
        a.classList.remove('flipped');
        b.classList.remove('flipped');
      }
      memoryFlipped = [];
    }, 700);
  }
}

initMemoryGame();

// ================= LIGHT / DARK MODE =================
const modeSwitch = document.getElementById('modeSwitch');
modeSwitch.addEventListener('change', () => {
  document.body.classList.toggle('light-mode', modeSwitch.checked);
});
