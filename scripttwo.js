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

// ---- Unlock audio ----
let audioUnlocked = false;
function unlockAudio() {
  if (audioUnlocked) return;
  [correctSound, wrongSound, completeSound].forEach(s => {
    s.play().then(() => { s.pause(); s.currentTime = 0; }).catch(()=>{});
  });
  audioUnlocked = true;
  document.removeEventListener('click', unlockAudio);
  document.removeEventListener('keydown', unlockAudio);
}
document.addEventListener('click', unlockAudio);
document.addEventListener('keydown', unlockAudio);

function playSound(sound){
  sound.currentTime = 0;
  sound.play().catch(()=>{});
}

// ================= SPINNER =================
function createSpinner(text='May take a moment to generate...'){
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
  if(!userPrompt) return alert('Enter a colonial scene!');
  const prompt = `Colonial American scene, 1776. ${userPrompt}. Historical realism, 18th century atmosphere, oil painting.`;

  imageContainer.innerHTML = '';
  const spinner = createSpinner();
  imageContainer.appendChild(spinner);

  const img = new Image();
  img.style.maxWidth = '300px';
  img.style.borderRadius = '12px';
  img.onload = () => { spinner.remove(); imageContainer.appendChild(img); playSound(completeSound); };
  img.onerror = () => { spinner.remove(); alert('Failed to generate image.'); };
  img.src = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}`;
});

// ================= AVATAR GENERATOR =================
const generateAvatarBtn = document.getElementById('generateAvatarBtn');
const avatarContainer = document.getElementById('avatarContainer');

generateAvatarBtn.addEventListener('click', () => {
  const fields = ['gender','background','outfit','hat','accessory','hair','age','race'];
  const values = fields.map(f=>document.getElementById(f+'Select').value);
  const [gender, background, outfit, hat, accessory, hair, age, heritage] = values;

  const prompt = `Colonial American portrait 1776. ${age} ${gender} of ${heritage} heritage, wearing ${outfit} and ${hat}. Oil painting.`;

  avatarContainer.innerHTML='';
  const spinner = createSpinner();
  avatarContainer.appendChild(spinner);

  const img = new Image();
  img.style.maxWidth='220px';
  img.onload = () => { spinner.remove(); avatarContainer.appendChild(img); playSound(completeSound); };
  img.src = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}`;
});

// ================= QUIZ =================
const quizData = [
  {q:"Year Declaration of Independence was signed?", o:["1775","1776","1777","1781"], a:"1776"},
  {q:"Commander of Continental Army?", o:["Thomas Jefferson","Benjamin Franklin","George Washington","John Adams"], a:"George Washington"},
  {q:"Document ending Revolutionary War?", o:["Bill of Rights","Treaty of Paris","Articles of Confederation","Constitution"], a:"Treaty of Paris"},
  {q:"Which city was first capital of USA?", o:["Philadelphia","New York","Boston","Washington DC"], a:"New York"},
  {q:"Who wrote most of the Declaration?", o:["Jefferson","Adams","Washington","Franklin"], a:"Jefferson"}
];

let currentQuestion=0, quizScore=0;
const questionEl=document.getElementById('question');
const answersEl=document.getElementById('answers');
const submitBtn=document.getElementById('submitBtn');
const scoreEl=document.getElementById('score');

function loadQuestion(){
  submitBtn.disabled=true;
  const q = quizData[currentQuestion];
  questionEl.textContent=q.q;
  answersEl.innerHTML='';
  q.o.forEach(opt=>{
    const btn=document.createElement('button');
    btn.textContent=opt;
    btn.onclick=()=>{
      document.querySelectorAll('#answers button').forEach(b=>b.classList.remove('selected'));
      btn.classList.add('selected');
      submitBtn.disabled=false;
    };
    answersEl.appendChild(btn);
  });
}

submitBtn.onclick = () => {
  const selected = document.querySelector('#answers button.selected');
  if(!selected) return;
  const correct = selected.textContent===quizData[currentQuestion].a;
  playSound(correct? correctSound: wrongSound);
  quizScore += correct?1:0;
  currentQuestion++;
  if(currentQuestion>=quizData.length){
    questionEl.textContent='Quiz Completed!';
    answersEl.innerHTML='';
    scoreEl.textContent=`Score: ${quizScore}/${quizData.length}`;
    scoreEl.classList.remove('hidden');
    playSound(completeSound);
  } else loadQuestion();
};

loadQuestion();

// ================= MEMORY MATCH =================
const memoryEmojis=['📚','✒️','📜','🖋️','🗺️','🏮','🎩','⚔️'];
const memoryGrid=document.querySelector('#memoryGame .card-grid');
const memoryTimer=document.getElementById('memoryTimer');
const memoryLeaderboard=document.getElementById('memoryLeaderboard');

let memoryFlipped=[], memoryMatches=0;
let memoryStart=null, memoryInterval=null, memoryBest=null;

function startMemoryTimer(){
  memoryStart=Date.now();
  memoryInterval=setInterval(()=>{
    const t=((Date.now()-memoryStart)/1000).toFixed(2);
    memoryTimer.textContent=`Time: ${t}s`;
  },50);
}

function updateMemoryLeaderboard(time){
  if(memoryBest===null||time<memoryBest) memoryBest=time;
  memoryLeaderboard.textContent=`Best: ${memoryBest.toFixed(2)}s`;
}

function initMemoryGame(){
  memoryGrid.innerHTML='';
  memoryFlipped=[];
  memoryMatches=0;
  clearInterval(memoryInterval);
  memoryStart=null;
  memoryTimer.textContent='Time: 0.00s';
  [...memoryEmojis,...memoryEmojis].sort(()=>Math.random()-0.5).forEach(e=>{
    const card=document.createElement('div');
    card.className='card';
    card.dataset.value=e;
    card.innerHTML=`<div class="card-inner"><div class="card-front">?</div><div class="card-back">${e}</div></div>`;
    card.onclick=()=>flipCard(card);
    memoryGrid.appendChild(card);
  });
}

function flipCard(card){
  if(memoryFlipped.length===2||card.classList.contains('flipped')) return;
  if(!memoryStart) startMemoryTimer();
  card.classList.add('flipped');
  memoryFlipped.push(card);
  if(memoryFlipped.length===2){
    setTimeout(()=>{
      const [a,b]=memoryFlipped;
      if(a.dataset.value===b.dataset.value){
        memoryMatches++;
        if(memoryMatches===memoryEmojis.length){
          clearInterval(memoryInterval);
          const time=(Date.now()-memoryStart)/1000;
          updateMemoryLeaderboard(time);
          playSound(completeSound);
        }
      } else { a.classList.remove('flipped'); b.classList.remove('flipped'); }
      memoryFlipped=[];
    },700);
  }
}
initMemoryGame();

// ================= TYPING GAME =================
const typingQuote="Learn your lessons well in the colonial classroom.";
const sentenceDisplay=document.getElementById('sentenceDisplay');
const typingInput=document.getElementById('typingInput');
const typingScore=document.getElementById('typingScore');
const typingLeaderboard=document.getElementById('typingLeaderboard');
let typingStart=null, typingInterval=null, typingBest=null;

sentenceDisplay.textContent=typingQuote;

typingInput.addEventListener('input',()=>{
  if(!typingStart){
    typingStart=Date.now();
    typingInterval=setInterval(()=>{
      typingScore.textContent=`Time: ${((Date.now()-typingStart)/1000).toFixed(2)}s`;
    },50);
  }
  if(typingInput.value===typingQuote){
    clearInterval(typingInterval);
    const finalTime=(Date.now()-typingStart)/1000;
    typingScore.textContent=`Time: ${finalTime.toFixed(2)}s ✅`;
    if(typingBest===null||finalTime<typingBest) typingBest=finalTime;
    typingLeaderboard.textContent=`Best: ${typingBest.toFixed(2)}s`;
    playSound(completeSound);
    typingInput.disabled=true;
  }
});

// ================= CLASSROOM CLEANUP =================
const cleanupBoard=document.getElementById('classroomBoard');
const cleanupTimer=document.getElementById('cleanupTimer');
const cleanupLeaderboard=document.getElementById('cleanupLeaderboard');
const basket=document.getElementById('basket');
const resetCleanupBtn=document.getElementById('resetCleanupBtn');

let cleanupStart=null, cleanupInterval=null, cleanupBest=null;

function startCleanupTimer(){
  cleanupStart=Date.now();
  cleanupInterval=setInterval(()=>{
    cleanupTimer.textContent=`Time: ${((Date.now()-cleanupStart)/1000).toFixed(2)}s`;
  },50);
}

function resetCleanup(){
  cleanupBoard.querySelectorAll('.clutter-item').forEach(el=>el.remove());
  ['📚','📜','🖋️','🎩','🗺️'].forEach(item=>{
    const el=document.createElement('div');
    el.textContent=item;
    el.className='clutter-item';
    el.draggable=true;
    el.style.left=Math.random()*300+'px';
    el.style.top=Math.random()*200+'px';
    el.ondragstart=()=>{ if(!cleanupStart) startCleanupTimer(); };
    cleanupBoard.appendChild(el);
  });
  cleanupStart=null;
  clearInterval(cleanupInterval);
  cleanupTimer.textContent='Time: 0.00s';
}

basket.ondragover=e=>e.preventDefault();
basket.ondrop=()=>{
  const item=cleanupBoard.querySelector('.clutter-item');
  if(item) item.remove();
  if(!cleanupBoard.querySelector('.clutter-item')){
    clearInterval(cleanupInterval);
    const finalTime=(Date.now()-cleanupStart)/1000;
    if(cleanupBest===null||finalTime<cleanupBest) cleanupBest=finalTime;
    cleanupLeaderboard.textContent=`Best: ${cleanupBest.toFixed(2)}s`;
    playSound(completeSound);
  }
};

resetCleanupBtn.onclick=resetCleanup;
resetCleanup();

// ================= LIGHT / DARK MODE =================
const modeSwitch=document.getElementById('modeSwitch');
modeSwitch.onchange=()=>{ document.body.classList.toggle('light-mode', modeSwitch.checked); };
