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

// ===== 1776 Quiz =====
const quizData = [
    { question: "In which year was the Declaration of Independence signed?", options: ["1775","1776","1777","1781"], answer: "1776" },
    { question: "Who was the commander of the Continental Army?", options: ["Thomas Jefferson","Benjamin Franklin","George Washington","John Adams"], answer: "George Washington" },
    { question: "Which document ended the Revolutionary War?", options: ["Bill of Rights","Treaty of Paris","Articles of Confederation","Constitution"], answer: "Treaty of Paris" },
    { question: "Where was the Declaration of Independence signed?", options: ["New York","Philadelphia","Boston","Washington D.C."], answer: "Philadelphia" },
    { question: "Who wrote most of the Declaration of Independence?", options: ["Benjamin Franklin","John Adams","Thomas Jefferson","Alexander Hamilton"], answer: "Thomas Jefferson" },
    { question: "Which battle was a turning point in the Revolutionary War?", options: ["Battle of Bunker Hill","Battle of Saratoga","Battle of Yorktown","Battle of Lexington"], answer: "Battle of Saratoga" },
    { question: "Who was the King of Britain during the American Revolution?", options: ["George III","Charles II","James I","William IV"], answer: "George III" },
    { question: "What was the first capital of the United States?", options: ["Philadelphia","New York","Boston","Washington D.C."], answer: "New York" },
    { question: "Which group supported independence from Britain?", options: ["Loyalists","Patriots","Tories","Redcoats"], answer: "Patriots" },
    { question: "Which river did George Washington cross for a famous surprise attack?", options: ["Hudson","Delaware","Potomac","Mississippi"], answer: "Delaware" }
];

let currentQuestion = 0;
let score = 0;

// DOM Elements
const progressContainer = document.getElementById('progressContainer');
const questionEl = document.getElementById('question');
const answersEl = document.getElementById('answers');
const submitBtn = document.getElementById('submitBtn');
const nextBtn = document.getElementById('nextBtn');
const scoreEl = document.getElementById('score');
const takeAgainBtn = document.getElementById('takeAgainBtn');

// ===== Initialize Progress Bar =====
function initProgress() {
    progressContainer.innerHTML = '';
    quizData.forEach(() => {
        const seg = document.createElement('div');
        seg.classList.add('progress-segment');
        progressContainer.appendChild(seg);
    });
}

// ===== Load Current Question =====
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

    updateProgress();
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

    const correct = quizData[currentQuestion].answer;
    Array.from(document.querySelectorAll('#answers button')).forEach(btn => {
        btn.disabled = true;
        if (btn.textContent === correct) btn.classList.add('correct');
    });

    if (selected.textContent !== correct) selected.classList.add('wrong');
    else score++;

    submitBtn.classList.add('hidden');
    nextBtn.classList.remove('hidden');
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

    // Fill progress bar completely
    const segments = document.querySelectorAll('.progress-segment');
    segments.forEach(seg => seg.style.background = '#4CAF50');
}

// ===== Take Quiz Again =====
takeAgainBtn.addEventListener('click', () => {
    currentQuestion = 0;
    score = 0;
    scoreEl.classList.add('hidden');
    takeAgainBtn.classList.add('hidden');
    loadQuestion();
    initProgress();
});

// ===== Initialize Quiz =====
initProgress();
loadQuestion();


