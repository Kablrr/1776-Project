
// ===== Cursor Glow =====
const cursorGlow = document.getElementById('cursorGlow');
document.addEventListener('mousemove', e => {
  cursorGlow.style.top = e.clientY + 'px';
  cursorGlow.style.left = e.clientX + 'px';
});

// ===== Image Generator =====
const generateBtn = document.getElementById('generateBtn');
const promptInput = document.getElementById('promptInput');
const imageContainer = document.getElementById('imageContainer');
const loadingText = document.getElementById('loadingText');

generateBtn.addEventListener('click', () => {
  const prompt = promptInput.value.trim();
  if(!prompt) return alert('Enter a colonial scene!');
  imageContainer.innerHTML = '';
  loadingText.classList.remove('hidden');
  loadingText.textContent = 'Generating image...';

  const img = new Image();
  img.src = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}`;
  img.alt = prompt;
  img.style.border = '2px solid #4b2e2a';
  img.style.borderRadius = '12px';
  img.onload = () => loadingText.classList.add('hidden');
  img.onerror = () => { loadingText.classList.add('hidden'); alert('Failed to generate image.'); };
  imageContainer.appendChild(img);
});

// ===== Avatar Generator =====
const generateAvatarBtn = document.getElementById('generateAvatarBtn');
const avatarContainer = document.getElementById('avatarContainer');
const avatarLoading = document.getElementById('avatarLoading');

generateAvatarBtn.addEventListener('click', () => {
  avatarContainer.innerHTML = '';
  avatarLoading.classList.remove('hidden');
  avatarLoading.textContent = 'Generating avatar...';

  const gender = document.getElementById('genderSelect').value;
  const background = document.getElementById('backgroundSelect').value;
  const outfit = document.getElementById('outfitSelect').value;
  const hat = document.getElementById('hatSelect').value;
  const accessory = document.getElementById('accessorySelect').value;
  const hair = document.getElementById('hairSelect').value;
  const age = document.getElementById('ageSelect').value;
  const race = document.getElementById('raceSelect').value;

  const prompt = `Colonial avatar, gender: ${gender}, background: ${background}, outfit: ${outfit}, hat: ${hat}, accessory: ${accessory}, hair: ${hair}, age: ${age}, heritage: ${race}`;
  
  const img = new Image();
  img.src = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}`;
  img.alt = 'Colonial Avatar';
  img.style.border = '2px solid #4b2e2a';
  img.style.borderRadius = '12px';
  img.onload = () => avatarLoading.classList.add('hidden');
  img.onerror = () => { avatarLoading.classList.add('hidden'); alert('Failed to generate avatar.'); };
  avatarContainer.appendChild(img);
});

// ===== Quiz Logic =====
const quizData = [
  { question: "In which year was the Declaration of Independence signed?", options: ["1775","1776","1777","1781"], answer: "1776" },
  { question: "Who was the commander of the Continental Army?", options: ["Thomas Jefferson","Benjamin Franklin","George Washington","John Adams"], answer: "George Washington" },
  { question: "Which document ended the Revolutionary War?", options: ["Bill of Rights","Treaty of Paris","Articles of Confederation","Constitution"], answer: "Treaty of Paris" }
];

let currentQuestion = 0;
let score = 0;

const progressContainer = document.getElementById('progressContainer');
const questionEl = document.getElementById('question');
const answersEl = document.getElementById('answers');
const submitBtn = document.getElementById('submitBtn');
const nextBtn = document.getElementById('nextBtn');
const scoreEl = document.getElementById('score');
const takeAgainBtn = document.getElementById('takeAgainBtn');

function initProgress() {
  progressContainer.innerHTML = '';
  quizData.forEach(() => {
    const seg = document.createElement('div');
    seg.classList.add('progress-segment');
    progressContainer.appendChild(seg);
  });
}

function loadQuestion() {
  submitBtn.disabled = true;
  submitBtn.classList.remove('hidden');
  nextBtn.classList.add('hidden');

  const q = quizData[currentQuestion];
  questionEl.textContent = q.question;
  answersEl.innerHTML = '';

  q.options.forEach(option => {
    const btn = document.createElement('button');
    btn.textContent = option;
    btn.addEventListener('click', () => {
      document.querySelectorAll('#answers button').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      submitBtn.disabled = false;
    });
    answersEl.appendChild(btn);
  });
}

function updateProgress() {
  const segments = document.querySelectorAll('.progress-segment');
  segments.forEach((seg, index) => {
    seg.style.background = index < currentQuestion ? '#4CAF50' : 'rgba(255,255,255,0.15)';
  });
}

submitBtn.addEventListener('click', () => {
  const selected = document.querySelector('#answers button.selected');
  if (!selected) return;

  const correct = quizData[currentQuestion].answer;
  Array.from(document.querySelectorAll('#answers button')).forEach(btn => {
    btn.disabled = true;
    if (btn.textContent === correct) btn.classList.add('correct');
  });

  if(selected.textContent !== correct) selected.classList.add('wrong');
  else score++;

  submitBtn.classList.add('hidden');
  nextBtn.classList.remove('hidden');

  updateProgress();
});

nextBtn.addEventListener('click', () => {
  currentQuestion++;
  if(currentQuestion >= quizData.length) showScore();
  else loadQuestion();
});

function showScore() {
  questionEl.textContent = 'Quiz Completed!';
  answersEl.innerHTML = '';
  submitBtn.classList.add('hidden');
  nextBtn.classList.add('hidden');
  scoreEl.textContent = `Your Score: ${score} / ${quizData.length}`;
  scoreEl.classList.remove('hidden');
  takeAgainBtn.classList.remove('hidden');
}

takeAgainBtn.addEventListener('click', () => {
  currentQuestion = 0;
  score = 0;
  scoreEl.classList.add('hidden');
  takeAgainBtn.classList.add('hidden');
  loadQuestion();
  initProgress();
});

initProgress();
loadQuestion();
