// ==========================
//  DOM ELEMENTS
// ==========================
const promptInput = document.getElementById('promptInput');
const generateBtn = document.getElementById('generateBtn');
const imageContainer = document.getElementById('imageContainer');

const generateAvatarBtn = document.getElementById('generateAvatarBtn');
const avatarContainer = document.getElementById('avatarContainer');

const answersContainer = document.getElementById('answers');
const questionElement = document.getElementById('question');
const progressContainer = document.getElementById('progressContainer');
const submitBtn = document.getElementById('submitBtn');
const nextBtn = document.getElementById('nextBtn');
const takeAgainBtn = document.getElementById('takeAgainBtn');
const scoreDiv = document.getElementById('score');

const memoryGrid = document.querySelector('#memoryGame .card-grid');
const memoryTimerDisplay = document.getElementById('memoryTimer');

const sentenceDisplay = document.getElementById('sentenceDisplay');
const typingInput = document.getElementById('typingInput');
const typingScore = document.getElementById('typingScore');
const typingLeaderboard = document.getElementById('typingLeaderboard');

const cleanupTimerDisplay = document.getElementById('cleanupTimer');
const classroomBoard = document.getElementById('classroomBoard');
const basket = document.getElementById('basket');

// ==========================
//  IMAGE GENERATOR
// ==========================
generateBtn.addEventListener('click', async () => {
    const basePrompt = promptInput.value.trim();
    if (!basePrompt) return alert("Enter a prompt!");
    
    const prompt = `${basePrompt}, colonial-era painting, 18th century school scene, wooden desks, quill and ink, historical clothing, warm natural lighting, realistic oil painting style`;

    imageContainer.innerHTML = `
        <div class="spinner-wrapper">
            <div class="spinner"></div>
            <div class="spinner-text">Generating image...</div>
        </div>
    `;

    try {
        const res = await fetch(`https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}`);
        if (!res.ok) throw new Error("Image generation failed");
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        imageContainer.innerHTML = `<img src="${url}" alt="Colonial Image" style="max-width:100%; border-radius:14px;">`;
    } catch (err) {
        imageContainer.innerHTML = `<p style="color:red;">Failed to generate image. Try again.</p>`;
        console.error(err);
    }
});

// ==========================
//  AVATAR GENERATOR
// ==========================
generateAvatarBtn.addEventListener('click', async () => {
    const gender = document.getElementById('genderSelect').value;
    const background = document.getElementById('backgroundSelect').value;
    const outfit = document.getElementById('outfitSelect').value;
    const hat = document.getElementById('hatSelect').value;
    const accessory = document.getElementById('accessorySelect').value;
    const hair = document.getElementById('hairSelect').value;
    const age = document.getElementById('ageSelect').value;
    const race = document.getElementById('raceSelect').value;

    const prompt = `${gender} student, ${age}, ${race}, wearing ${outfit} with ${hat} and ${hair} hair, holding ${accessory}, in a ${background} classroom, 18th century, colonial-era, oil painting, detailed, realistic`;

    avatarContainer.innerHTML = `
        <div class="spinner-wrapper">
            <div class="spinner"></div>
            <div class="spinner-text">Generating avatar...</div>
        </div>
    `;

    try {
        const res = await fetch(`https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}`);
        if (!res.ok) throw new Error("Avatar generation failed");
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        avatarContainer.innerHTML = `<img src="${url}" alt="Colonial Avatar" style="max-width:100%; border-radius:14px;">`;
    } catch (err) {
        avatarContainer.innerHTML = `<p style="color:red;">Failed to generate avatar. Try again.</p>`;
        console.error(err);
    }
});

// ==========================
//  QUIZ
// ==========================
let quizQuestions = [
    {
        q: "When was the Declaration of Independence signed?",
        choices: ["1775", "1776", "1781", "1789"],
        answer: 1
    },
    {
        q: "Which city hosted the first Continental Congress?",
        choices: ["Boston", "Philadelphia", "New York", "Charleston"],
        answer: 1
    }
];

let currentQuestion = 0;
let selectedAnswer = null;

function renderQuiz() {
    const questionObj = quizQuestions[currentQuestion];
    questionElement.textContent = questionObj.q;
    answersContainer.innerHTML = '';
    questionObj.choices.forEach((choice, idx) => {
        const btn = document.createElement('button');
        btn.textContent = choice;
        btn.addEventListener('click', () => {
            selectedAnswer = idx;
            Array.from(answersContainer.children).forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            submitBtn.disabled = false;
        });
        answersContainer.appendChild(btn);
    });
    updateProgressBar();
    submitBtn.disabled = true;
    nextBtn.classList.add('hidden');
}

function updateProgressBar(correct=null) {
    progressContainer.innerHTML = '';
    quizQuestions.forEach((q, idx) => {
        const seg = document.createElement('div');
        seg.classList.add('progress-segment');
        if (idx < currentQuestion) seg.style.backgroundColor = q.userCorrect ? 'var(--correct-color)' : 'var(--wrong-color)';
        if (idx === currentQuestion && correct !== null) seg.style.backgroundColor = correct ? 'var(--correct-color)' : 'var(--wrong-color)';
        progressContainer.appendChild(seg);
    });
}

submitBtn.addEventListener('click', () => {
    const questionObj = quizQuestions[currentQuestion];
    const correct = selectedAnswer === questionObj.answer;
    questionObj.userCorrect = correct;

    Array.from(answersContainer.children).forEach((btn, idx) => {
        if (idx === questionObj.answer) btn.classList.add('correct');
        else if (idx === selectedAnswer) btn.classList.add('wrong');
    });

    updateProgressBar(correct);
    nextBtn.classList.remove('hidden');
    submitBtn.disabled = true;
});

nextBtn.addEventListener('click', () => {
    currentQuestion++;
    if (currentQuestion >= quizQuestions.length) {
        scoreDiv.textContent = `Score: ${quizQuestions.filter(q => q.userCorrect).length} / ${quizQuestions.length}`;
        scoreDiv.classList.remove('hidden');
        takeAgainBtn.classList.remove('hidden');
        nextBtn.classList.add('hidden');
    } else {
        renderQuiz();
    }
});

takeAgainBtn.addEventListener('click', () => {
    currentQuestion = 0;
    quizQuestions.forEach(q => delete q.userCorrect);
    renderQuiz();
    scoreDiv.classList.add('hidden');
    takeAgainBtn.classList.add('hidden');
});

renderQuiz();

// ==========================
//  MEMORY MATCH
// ==========================
const emojis = ["📚","🖋️","🧺","⚔️","🪑","🧭","📜","🪶"];
let memoryCards = [];
let flippedCards = [];
let memoryTimer = null;
let memoryStartTime = 0;

function setupMemory() {
    memoryCards = [...emojis, ...emojis];
    memoryCards.sort(() => Math.random()-0.5);
    memoryGrid.innerHTML = '';

    memoryCards.forEach(emoji => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.innerHTML = `
            <div class="card-inner">
                <div class="card-front"></div>
                <div class="card-back">${emoji}</div>
            </div>
        `;
        card.addEventListener('click', () => flipMemoryCard(card));
        memoryGrid.appendChild(card);
    });

    memoryTimerDisplay.textContent = `Time: 0.00s`;
}

function startMemoryTimer() {
    if (memoryTimer) return;
    memoryStartTime = Date.now();
    memoryTimer = setInterval(() => {
        const elapsed = (Date.now() - memoryStartTime)/1000;
        memoryTimerDisplay.textContent = `Time: ${elapsed.toFixed(2)}s`;
    }, 50);
}

function stopMemoryTimer() {
    clearInterval(memoryTimer);
    memoryTimer = null;
}

function flipMemoryCard(card) {
    startMemoryTimer();
    if (card.classList.contains('flipped')) return;
    card.classList.add('flipped');
    flippedCards.push(card);

    if (flippedCards.length === 2) {
        const [a, b] = flippedCards;
        if (a.querySelector('.card-back').textContent === b.querySelector('.card-back').textContent) {
            flippedCards = [];
        } else {
            setTimeout(() => {
                a.classList.remove('flipped');
                b.classList.remove('flipped');
                flippedCards = [];
            }, 800);
        }
    }

    if (document.querySelectorAll('#memoryGame .card:not(.flipped)').length === 0) {
        stopMemoryTimer();
    }
}

setupMemory();

// ==========================
//  TYPING CHALLENGE
// ==========================
const typingSentence = "The students wrote with quills in the 18th century classroom.";
let typingStartTime = null;
let typingTimer = null;

function startTypingTimer() {
    if (typingTimer) return;
    typingStartTime = Date.now();
    typingTimer = setInterval(() => {
        const elapsed = (Date.now() - typingStartTime)/1000;
        typingScore.textContent = `Time: ${elapsed.toFixed(2)}s`;
    }, 50);
}

typingInput.addEventListener('input', () => {
    startTypingTimer();
    const userText = typingInput.value;
    sentenceDisplay.textContent = typingSentence;
    if (userText === typingSentence) {
        clearInterval(typingTimer);
        typingTimer = null;
        typingScore.textContent = `Completed in ${(Date.now() - typingStartTime)/1000}s`;
    }
});

// ==========================
//  CLASSROOM CLEANUP
// ==========================
let cleanupTimer = null;
let cleanupStartTime = null;

function startCleanupTimer() {
    if (cleanupTimer) return;
    cleanupStartTime = Date.now();
    cleanupTimer = setInterval(() => {
        const elapsed = (Date.now() - cleanupStartTime)/1000;
        cleanupTimerDisplay.textContent = `Time: ${elapsed.toFixed(2)}s`;
    }, 50);
}

basket.addEventListener('mousedown', startCleanupTimer);

// ==========================
//  LIGHT/DARK MODE TOGGLE
// ==========================
const modeSwitch = document.getElementById('modeSwitch');
modeSwitch.addEventListener('change', () => {
    document.body.classList.toggle('light-mode', modeSwitch.checked);
});
