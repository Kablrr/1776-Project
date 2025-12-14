// ===== Cursor Glow =====
const cursorGlow = document.getElementById('cursorGlow');
document.addEventListener('mousemove', e => {
  cursorGlow.style.top = e.clientY + 'px';
  cursorGlow.style.left = e.clientX + 'px';
});

// ===== Text to Image =====
const generateBtn = document.getElementById('generateBtn');
const promptInput = document.getElementById('promptInput');
const imageContainer = document.getElementById('imageContainer');
let textImg = null;

generateBtn.addEventListener('click', () => {
  const userPrompt = promptInput.value.trim();
  if (!userPrompt) return alert('Enter a colonial scene!');

  const prompt = `
    Colonial American scene, set in the year 1776.
    ${userPrompt}.
    Historical realism, 18th century atmosphere, parchment tones, oil painting style.
  `;

  if (!textImg) {
    textImg = new Image();
    textImg.style.width = '100%';
    textImg.style.maxWidth = '300px';
    textImg.style.border = '2px solid #4b2e2a';
    textImg.style.borderRadius = '12px';
    imageContainer.innerHTML = '';
    imageContainer.appendChild(textImg);
  }

  // Show loading indicator
  textImg.src = '';
  textImg.alt = 'Loading...';
  
  const temp = new Image();
  temp.onload = () => textImg.src = temp.src;
  temp.onerror = () => alert('Failed to generate image. Try again.');
  temp.src = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}`;
  textImg.alt = prompt;
});

// ===== Avatar Generator =====
const generateAvatarBtn = document.getElementById('generateAvatarBtn');
const avatarContainer = document.getElementById('avatarContainer');
let avatarImg = null;

generateAvatarBtn.addEventListener('click', () => {
  const gender = document.getElementById('genderSelect').value;
  const background = document.getElementById('backgroundSelect').value;
  const outfit = document.getElementById('outfitSelect').value;
  const hat = document.getElementById('hatSelect').value;
  const accessory = document.getElementById('accessorySelect').value;
  const hair = document.getElementById('hairSelect').value;
  const age = document.getElementById('ageSelect').value;
  const heritage = document.getElementById('raceSelect').value;

  const prompt = `
    Colonial American style portrait, year 1776.
    ${age} ${gender} person of ${heritage} heritage.
    Wearing ${outfit}, ${hat}.
    Hairstyle: ${hair}.
    Accessory: ${accessory}.
    Background setting: ${background}.
    Painted realism, warm parchment tones, 18th century oil painting style.
  `;

  if (!avatarImg) {
    avatarImg = new Image();
    avatarImg.style.width = '100%';
    avatarImg.style.maxWidth = '220px';
    avatarImg.style.border = '2px solid #4b2e2a';
    avatarImg.style.borderRadius = '14px';
    avatarContainer.innerHTML = '';
    avatarContainer.appendChild(avatarImg);
  }

  avatarImg.src = '';
  avatarImg.alt = 'Loading...';

  const temp = new Image();
  temp.onload = () => avatarImg.src = temp.src;
  temp.onerror = () => alert('Failed to generate avatar. Try again.');
  temp.src = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}`;
  avatarImg.alt = '1776 Avatar';
});

// ===== Quiz =====
const quizData = [
  { q:"Year Declaration of Independence was signed?", o:["1775","1776","1777","1781"], a:"1776" },
  { q:"Commander of Continental Army?", o:["Thomas Jefferson","Benjamin Franklin","George Washington","John Adams"], a:"George Washington" },
  { q:"Document ending Revolutionary War?", o:["Bill of Rights","Treaty of Paris","Articles of Confederation","Constitution"], a:"Treaty of Paris" },
  { q:"Which city was first capital of USA?", o:["Philadelphia","New York","Boston","Washington DC"], a:"New York" },
  { q:"Who wrote the Declaration?", o:["Jefferson","Adams","Washington","Franklin"], a:"Jefferson" },
  { q:"Which battle was first major battle?", o:["Bunker Hill","Lexington","Saratoga","Yorktown"], a:"Bunker Hill" },
  { q:"Who was king of Britain?", o:["George I","George II","George III","George IV"], a:"George III" },
  { q:"What year did war start?", o:["1774","1775","1776","1777"], a:"1775" },
  { q:"Famous spy during revolution?", o:["Nathan Hale","Benjamin Franklin","Paul Revere","John Hancock"], a:"Nathan Hale" },
  { q:"Which treaty ended war?", o:["Paris","Versailles","London","Madrid"], a:"Paris" }
];

let currentQuestion = 0;
let score = 0;

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
    const segment = document.createElement('div');
    segment.classList.add('progress-segment');
    segment.style.backgroundColor = '#ccc'; // default unattempted color
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

  const options = [...q.o].sort(() => Math.random() - 0.5);
  options.forEach(opt => {
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

function markProgress(isCorrect) {
  const segments = document.querySelectorAll('.progress-segment');
  if (segments[currentQuestion]) segments[currentQuestion].style.backgroundColor = isCorrect ? '#4CAF50' : '#e74c3c';
}

submitBtn.addEventListener('click', () => {
  const selected = document.querySelector('#answers button.selected');
  if (!selected) return;

  const correct = quizData[currentQuestion].a;
  const isCorrect = selected.textContent === correct;

  Array.from(document.querySelectorAll('#answers button')).forEach(btn => {
    btn.disabled = true;
    if (btn.textContent === correct) btn.classList.add('correct');
  });
  if (!isCorrect) selected.classList.add('wrong');
  else score++;

  markProgress(isCorrect);
  submitBtn.classList.add('hidden');
  nextBtn.classList.remove('hidden');
});

nextBtn.addEventListener('click', () => {
  currentQuestion++;
  if (currentQuestion >= quizData.length) showScore();
  else loadQuestion();
});

function showScore() {
  questionEl.textContent = 'Quiz Completed!';
  answersEl.innerHTML = '';
  submitBtn.classList.add('hidden');
  nextBtn.classList.add('hidden');
  takeAgainBtn.classList.remove('hidden');
  scoreEl.textContent = `Your Score: ${score} / ${quizData.length}`;
  scoreEl.classList.remove('hidden');
}

takeAgainBtn.addEventListener('click', () => {
  currentQuestion = 0;
  score = 0;
  scoreEl.classList.add('hidden');
  takeAgainBtn.classList.add('hidden');
  initProgressBar();
  loadQuestion();
});

// ===== Initialize =====
initProgressBar();
loadQuestion();
