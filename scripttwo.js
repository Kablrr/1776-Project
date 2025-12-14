// ===== Cursor Glow =====
const cursorGlow = document.getElementById('cursorGlow');
document.addEventListener('mousemove', e => {
  cursorGlow.style.top = e.clientY + 'px';
  cursorGlow.style.left = e.clientX + 'px';
});

// ===== Text-to-Image Generator (1776 Scene) =====
const generateBtn = document.getElementById('generateBtn');
const promptInput = document.getElementById('promptInput');
const imageContainer = document.getElementById('imageContainer');
const loadingText = document.getElementById('loadingText');

generateBtn.addEventListener('click', () => {
  const prompt = promptInput.value.trim();
  if (!prompt) return alert('Enter a colonial scene!');

  imageContainer.innerHTML = ''; // clear previous image

  // Add spinner
  const spinner = document.createElement('div');
  spinner.classList.add('spinner');
  imageContainer.appendChild(spinner);

  // Create image
  const img = new Image();
  img.src = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}`;
  img.alt = prompt;
  img.style.border = '2px solid #4b2e2a';
  img.style.borderRadius = '12px';
  img.style.marginTop = '15px';
  img.onload = () => {
    spinner.remove();
    imageContainer.appendChild(img);
  };
  img.onerror = () => {
    spinner.remove();
    alert('Failed to generate image. Try again.');
  };
});

// ===== Avatar Generator (1776 Student) =====
const generateAvatarBtn = document.getElementById('generateAvatarBtn');
const avatarContainer = document.getElementById('avatarContainer');

generateAvatarBtn.addEventListener('click', () => {
  avatarContainer.innerHTML = ''; // clear previous avatar

  // Add spinner
  const spinner = document.createElement('div');
  spinner.classList.add('spinner');
  avatarContainer.appendChild(spinner);

  // Collect avatar options
  const gender = document.getElementById('genderSelect').value;
  const background = document.getElementById('backgroundSelect').value;
  const outfit = document.getElementById('outfitSelect').value;
  const hat = document.getElementById('hatSelect').value;
  const accessory = document.getElementById('accessorySelect').value;
  const hair = document.getElementById('hairSelect').value;
  const age = document.getElementById('ageSelect').value;
  const race = document.getElementById('raceSelect').value;

  // Build Pollinations prompt
  const prompt = `Colonial student avatar, gender: ${gender}, background: ${background}, outfit: ${outfit}, hat: ${hat}, accessory: ${accessory}, hair: ${hair}, age: ${age}, heritage: ${race}`;

  // Create avatar image
  const img = new Image();
  img.src = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}`;
  img.alt = 'Colonial Avatar';
  img.style.border = '2px solid #4b2e2a';
  img.style.borderRadius = '12px';
  img.style.marginTop = '15px';

  img.onload = () => {
    spinner.remove();
    avatarContainer.appendChild(img);
  };
  img.onerror = () => {
    spinner.remove();
    alert('Failed to generate avatar. Try again.');
  };
});

// ===== 1776 History Quiz =====

// Quiz data (10 questions about 1776)
const quizData = [
  { 
    question: "In which year was the Declaration of Independence signed?",
    options: ["1775","1776","1777","1781"],
    answer: "1776"
  },
  { 
    question: "Who was the commander of the Continental Army?",
    options: ["Thomas Jefferson","Benjamin Franklin","George Washington","John Adams"],
    answer: "George Washington"
  },
  { 
    question: "Which document formally ended the Revolutionary War?",
    options: ["Bill of Rights","Treaty of Paris","Articles of Confederation","Constitution"],
    answer: "Treaty of Paris"
  },
  {
    question: "Which colony proposed independence from Britain?",
    options: ["Virginia","Massachusetts","Pennsylvania","All of the above"],
    answer: "All of the above"
  },
  {
    question: "Who wrote most of the Declaration of Independence?",
    options: ["Benjamin Franklin","John Adams","Thomas Jefferson","James Madison"],
    answer: "Thomas Jefferson"
  },
  {
    question: "Where was the Declaration of Independence signed?",
    options: ["Boston","Philadelphia","New York","Washington, D.C."],
    answer: "Philadelphia"
  },
  {
    question: "What was the name of the first American flag?",
    options: ["Stars and Stripes","Grand Union Flag","Betsy Ross Flag","Liberty Flag"],
    answer: "Grand Union Flag"
  },
  {
    question: "Which country helped the colonies during the Revolutionary War?",
    options: ["France","Spain","Netherlands","All of the above"],
    answer: "All of the above"
  },
  {
    question: "Which famous pamphlet encouraged independence?",
    options: ["Common Sense","The Federalist Papers","Poor Richard's Almanack","Magna Carta"],
    answer: "Common Sense"
  },
  {
    question: "Which battle was a turning point in 1776?",
    options: ["Battle of Bunker Hill","Battle of Trenton","Battle of Saratoga","Battle of Yorktown"],
    answer: "Battle of Trenton"
  }
];

// ===== DOM Elements =====
const progressContainer = document.getElementById('progressContainer');
const questionEl = document.getElementById('question');
const answersEl = document.getElementById('answers');
const submitBtn = document.getElementById('submitBtn');
const nextBtn = document.getElementById('nextBtn');
const takeAgainBtn = document.getElementById('takeAgainBtn');
const scoreEl = document.getElementById('score');

let currentQuestion = 0;
let score = 0;

// ===== Initialize Progress Bar =====
function initProgress() {
  progressContainer.innerHTML = '';
  quizData.forEach(() => {
    const segment = document.createElement('div');
    segment.classList.add('progress-segment');
    progressContainer.appendChild(segment);
  });
}

// ===== Load a Question =====
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

// ===== Update Progress Bar =====
function updateProgress() {
  const segments = document.querySelectorAll('.progress-segment');
  segments.forEach((seg, index) => {
    seg.style.background = index < currentQuestion ? '#4CAF50' : 'rgba(255,255,255,0.15)';
  });
}

// ===== Submit Answer =====
submitBtn.addEventListener('click', () => {
  const selected = document.querySelector('#answers button.selected');
  if (!selected) return;

  const correctAnswer = quizData[currentQuestion].answer;

  // Mark all buttons
  Array.from(document.querySelectorAll('#answers button')).forEach(btn => {
    btn.disabled = true;
    if (btn.textContent === correctAnswer) btn.classList.add('correct');
  });

  // Mark wrong if needed
  if (selected.textContent !== correctAnswer) selected.classList.add('wrong');
  else score++;

  submitBtn.classList.add('hidden');
  nextBtn.classList.remove('hidden');
  updateProgress();
});

// ===== Next Question =====
nextBtn.addEventListener('click', () => {
  currentQuestion++;
  if (currentQuestion >= quizData.length) {
    showScore();
  } else {
    loadQuestion();
  }
});

// ===== Show Final Score =====
function showScore() {
  questionEl.textContent = 'Quiz Completed!';
  answersEl.innerHTML = '';
  submitBtn.classList.add('hidden');
  nextBtn.classList.add('hidden');
  scoreEl.textContent = `Your Score: ${score} / ${quizData.length}`;
  scoreEl.classList.remove('hidden');
  takeAgainBtn.classList.remove('hidden');
}

// ===== Restart Quiz =====
takeAgainBtn.addEventListener('click', () => {
  currentQuestion = 0;
  score = 0;
  scoreEl.classList.add('hidden');
  takeAgainBtn.classList.add('hidden');
  initProgress();
  loadQuestion();
});

// ===== Initialize Quiz =====
initProgress();
loadQuestion();
