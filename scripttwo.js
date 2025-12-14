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

generateBtn.addEventListener('click', () => {
  const prompt = promptInput.value.trim();
  if(!prompt) return alert('Enter a colonial scene!');
  imageContainer.innerHTML = '';
  const img = new Image();
  img.src = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}`;
  img.alt = prompt;
  img.style.width = '300px';
  img.style.border = '2px solid #4b2e2a';
  img.style.borderRadius = '12px';
  imageContainer.appendChild(img);
});

// ===== Avatar Generator =====
const generateAvatarBtn = document.getElementById('generateAvatarBtn');
const avatarContainer = document.getElementById('avatarContainer');

generateAvatarBtn.addEventListener('click', () => {
  avatarContainer.innerHTML = '';
  const gender = document.getElementById('genderSelect').value;
  const background = document.getElementById('backgroundSelect').value;
  const outfit = document.getElementById('outfitSelect').value;
  const prompt = `1776 student avatar, gender: ${gender}, background: ${background}, outfit: ${outfit}`;
  const img = new Image();
  img.src = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}`;
  img.alt = 'Avatar';
  img.style.width = '200px';
  img.style.border = '2px solid #4b2e2a';
  img.style.borderRadius = '12px';
  avatarContainer.appendChild(img);
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

// ===== Initialize Progress Bar =====
function initProgress() {
  progressContainer.innerHTML = '';
  quizData.forEach(() => {
    const seg = document.createElement('div');
    seg.classList.add('progress-segment');

    const fill = document.createElement('div');
    fill.classList.add('fill');
    fill.style.width = '0%'; // start empty
    seg.appendChild(fill);

    progressContainer.appendChild(seg);
  });
}

// ===== Load Question =====
function loadQuestion() {
  submitBtn.disabled = true;
  submitBtn.classList.remove('hidden');
  nextBtn.classList.add('hidden');
  const q = quizData[currentQuestion];
  questionEl.textContent = q.q;
  answersEl.innerHTML = '';
  q.o.forEach(opt => {
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

// ===== Update Progress Bar =====
function updateProgress() {
  const fills = document.querySelectorAll('.progress-segment .fill');
  fills.forEach((fill, i) => {
    if (i <= currentQuestion) fill.style.width = '100%';
    else fill.style.width = '0%';
  });
}

// ===== Submit Answer =====
submitBtn.addEventListener('click', () => {
  const selected = document.querySelector('#answers button.selected');
  if(!selected) return;
  const correct = quizData[currentQuestion].a;
  Array.from(document.querySelectorAll('#answers button')).forEach(btn => {
    btn.disabled = true;
    if(btn.textContent === correct) btn.classList.add('correct');
  });
  if(selected.textContent !== correct) selected.classList.add('wrong');
  else score++;
  submitBtn.classList.add('hidden');
  nextBtn.classList.remove('hidden');
  updateProgress();
});

// ===== Next Question =====
nextBtn.addEventListener('click', () => {
  currentQuestion++;
  if(currentQuestion >= quizData.length) showScore();
  else loadQuestion();
});

// ===== Show Final Score =====
function showScore() {
  questionEl.textContent = 'Quiz Completed!';
  answersEl.innerHTML = '';
  submitBtn.classList.add('hidden');
  nextBtn.classList.add('hidden');
  takeAgainBtn.classList.remove('hidden');
  scoreEl.textContent = `Your Score: ${score} / ${quizData.length}`;
  scoreEl.classList.remove('hidden');
}

// ===== Take Quiz Again =====
takeAgainBtn.addEventListener('click', () => {
  currentQuestion = 0;
  score = 0;
  scoreEl.classList.add('hidden');
  takeAgainBtn.classList.add('hidden');
  initProgress();
  loadQuestion();
});

// ===== Initialize =====
initProgress();
loadQuestion();
