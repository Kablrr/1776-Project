// ===== Element References =====
const promptInput = document.getElementById("promptInput");
const generateBtn = document.getElementById("generateBtn");
const imageContainer = document.getElementById("imageContainer");

const generateAvatarBtn = document.getElementById("generateAvatarBtn");
const avatarContainer = document.getElementById("avatarContainer");

const questionEl = document.getElementById("question");
const answersEl = document.getElementById("answers");
const submitBtn = document.getElementById("submitBtn");
const nextBtn = document.getElementById("nextBtn");
const takeAgainBtn = document.getElementById("takeAgainBtn");
const scoreEl = document.getElementById("score");
const progressContainer = document.getElementById("progressContainer");

const memoryGrid = document.querySelector("#memoryGame .card-grid");
const memoryTimerEl = document.getElementById("memoryTimer");
const memoryLeaderboardEl = document.getElementById("memoryLeaderboard");
const resetMemoryBtn = document.getElementById("resetMemoryBtn");

const sentenceDisplay = document.getElementById("sentenceDisplay");
const typingInput = document.getElementById("typingInput");
const typingScore = document.getElementById("typingScore");
const typingLeaderboard = document.getElementById("typingLeaderboard");
const typingResetBtn = document.getElementById("resetTypingBtn");

const classroomBoard = document.getElementById("classroomBoard");
const basket = document.getElementById("basket");
const cleanupTimerEl = document.getElementById("cleanupTimer");
const cleanupLeaderboardEl = document.getElementById("cleanupLeaderboard");
const resetCleanupBtn = document.getElementById("resetCleanupBtn");

const cursorGlow = document.getElementById("cursorGlow");
const modeSwitch = document.getElementById("modeSwitch");
const fullscreenBtn = document.getElementById("fullscreenBtn");

// ===== Audio Helper =====
function playSfx(src) {
  const sound = new Audio(src);
  sound.play();
}

// ===== Light/Dark Mode =====
modeSwitch.addEventListener("change", () => {
  document.body.classList.toggle("light-mode", modeSwitch.checked);
});

// ===== AI Image Generator =====
generateBtn.addEventListener("click", async () => {
  const userPrompt = promptInput.value.trim();
  if (!userPrompt) return;

  const prompt = `${userPrompt}, colonial-era scene, historical clothing, wooden desks, parchment and quills, oil painting style, early American 18th century, realistic lighting`;

  imageContainer.innerHTML = `<div class="spinner-wrapper"><div class="spinner"></div><div class="spinner-text">Generating image...</div></div>`;

  try {
    const response = await fetch(`https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}`);
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    imageContainer.innerHTML = `<img src="${url}" alt="Generated Colonial Scene">`;
  } catch {
    imageContainer.innerHTML = `<p style="color:red;">Error generating image. Try again.</p>`;
  }
});

// ===== Avatar Generator =====
generateAvatarBtn.addEventListener("click", async () => {
  const selections = ["genderSelect","backgroundSelect","outfitSelect","hatSelect","accessorySelect","hairSelect","ageSelect","raceSelect"]
    .map(id => document.getElementById(id).value);
  const [gender, background, outfit, hat, accessory, hair, age, race] = selections;

  const avatarPrompt = `A ${age} ${gender} with ${hair} hair, wearing ${outfit} and ${hat}, holding ${accessory}, background: ${background}, heritage: ${race}, colonial-era 1770s American style, oil painting, realistic`;

  avatarContainer.innerHTML = `<div class="spinner-wrapper"><div class="spinner"></div><div class="spinner-text">Generating avatar...</div></div>`;

  try {
    const response = await fetch(`https://image.pollinations.ai/prompt/${encodeURIComponent(avatarPrompt)}`);
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    avatarContainer.innerHTML = `<img src="${url}" alt="Generated Avatar">`;
  } catch {
    avatarContainer.innerHTML = `<p style="color:red;">Error generating avatar. Try again.</p>`;
  }
});

// ===== Quiz =====
let currentQuestion = 0;
let userScore = 0;
const quizData = [
  { q: "Which year did the American Declaration of Independence occur?", a: ["1775","1776","1781","1789"], correct:1 },
  { q: "Who was the primary author of the Declaration of Independence?", a: ["George Washington","Thomas Jefferson","Benjamin Franklin","John Adams"], correct:1 },
  { q: "What was a common school supply in 1776?", a: ["Tablet","Parchment and Quill","Notebook","Chalkboard"], correct:1 },
  { q: "Which city hosted the signing of the Declaration of Independence?", a: ["New York","Philadelphia","Boston","Washington D.C."], correct:1 },
  { q: "What was the original purpose of colonial schools?", a: ["Trade skills","Religious instruction","Sports","Art"], correct:1 },
  { q: "Which famous figure was known as the 'Father of the Constitution'?", a: ["Thomas Jefferson","George Washington","James Madison","Benjamin Franklin"], correct:2 },
  { q: "What writing instrument was commonly used in 1776?", a: ["Ballpoint pen","Pencil","Quill and ink","Marker"], correct:2 },
  { q: "Which event sparked the American Revolutionary War?", a: ["Boston Tea Party","Signing of Declaration","Battle of Yorktown","Stamp Act"], correct:0 }
];
quizData.sort(() => Math.random() - 0.5);

function renderQuestion() {
  const q = quizData[currentQuestion];
  questionEl.textContent = q.q;
  answersEl.innerHTML = "";

  const answers = q.a.map((text, idx) => ({ text, isCorrect: idx === q.correct })).sort(() => Math.random() - 0.5);

  answers.forEach(a => {
    const btn = document.createElement("button");
    btn.textContent = a.text;
    btn.dataset.correct = a.isCorrect;
    btn.addEventListener("click", () => {
      Array.from(answersEl.children).forEach(b => b.classList.remove("selected"));
      btn.classList.add("selected");
      submitBtn.disabled = false;
    });
    answersEl.appendChild(btn);
  });

  submitBtn.disabled = true;
  nextBtn.classList.add("hidden");
}
renderQuestion();

submitBtn.addEventListener("click", () => {
  const selected = Array.from(answersEl.children).find(b => b.classList.contains("selected"));
  if (!selected) return;

  const isCorrect = selected.dataset.correct === "true";
  if(isCorrect){
    playSfx("correct.mp3");
    userScore++;
    selected.classList.add("correct");
  } else {
    playSfx("wrong.mp3");
    selected.classList.add("wrong");
  }

  Array.from(answersEl.children).forEach(b => {
    if(b.dataset.correct === "true") b.classList.add("correct");
  });

  progressContainer.innerHTML = "";
  quizData.forEach((_, i) => {
    const seg = document.createElement("div");
    seg.classList.add("progress-segment");
    if(i < currentQuestion + 1){
      seg.style.backgroundColor = i < userScore ? "var(--correct-color)" : "var(--wrong-color)";
    }
    progressContainer.appendChild(seg);
  });

  nextBtn.classList.remove("hidden");
  submitBtn.disabled = true;
});

nextBtn.addEventListener("click", () => {
  currentQuestion++;
  if(currentQuestion >= quizData.length){
    questionEl.textContent = "Quiz Completed!";
    answersEl.innerHTML = "";
    nextBtn.classList.add("hidden");
    scoreEl.textContent = `Score: ${userScore} / ${quizData.length}`;
    scoreEl.classList.remove("hidden");
    takeAgainBtn.classList.remove("hidden");
    playSfx("complete.mp3");
  } else renderQuestion();
});

takeAgainBtn.addEventListener("click", () => {
  currentQuestion = 0;
  userScore = 0;
  scoreEl.classList.add("hidden");
  takeAgainBtn.classList.add("hidden");
  quizData.sort(() => Math.random() - 0.5);
  renderQuestion();
});

// ===== Memory Match =====
const emojiCards = ["📜","🖋️","🎓","📚","🏺","🪑","🕯️","🔔"];
let memoryCards = [], flipped = [], memoryStarted=false, memoryTime=0, memoryTimer=null, memoryBestTime=null;

function startMemoryTimer(){
  if(memoryStarted) return;
  memoryStarted=true;
  memoryTime=0;
  memoryTimer=setInterval(()=>{
    memoryTime+=0.01;
    memoryTimerEl.textContent=`Time: ${memoryTime.toFixed(2)}s`;
  },10);
}

function setupMemory(){
  memoryCards=[...emojiCards,...emojiCards].sort(()=>0.5-Math.random());
  memoryGrid.innerHTML=""; flipped=[];
  memoryCards.forEach(emoji=>{
    const card=document.createElement("div");
    card.className="card";
    card.innerHTML=`<div class="card-inner"><div class="card-front"></div><div class="card-back">${emoji}</div></div>`;
    card.addEventListener("click",()=>{
      startMemoryTimer();
      if(card.classList.contains("flipped") || flipped.length===2) return;
      card.classList.add("flipped");
      flipped.push({card,emoji});
      if(flipped.length===2){
        if(flipped[0].emoji===flipped[1].emoji){
          playSfx("correct.mp3");
          flipped=[];
        } else {
          playSfx("wrong.mp3");
          setTimeout(()=>{
            flipped[0].card.classList.remove("flipped");
            flipped[1].card.classList.remove("flipped");
            flipped=[];
          },500);
        }
        if(document.querySelectorAll("#memoryGame .card.flipped").length===memoryCards.length){
          clearInterval(memoryTimer);
          if(memoryBestTime===null||memoryTime<memoryBestTime){
            memoryBestTime=memoryTime;
            memoryLeaderboardEl.textContent=`Best: ${memoryBestTime.toFixed(2)} s`;
          }
          playSfx("complete.mp3");
        }
      }
    });
    memoryGrid.appendChild(card);
  });
}
setupMemory();
resetMemoryBtn.addEventListener("click", ()=>{
  clearInterval(memoryTimer);
  memoryStarted=false; memoryTime=0;
  memoryTimerEl.textContent="Time: 0.00s";
  setupMemory();
});

// ===== Typing Challenge =====
let currentSentence = "", lastSentence = "", typingStarted=false, typingStartTime=0, typingBestTime=null, typingTimer=null;

async function fetchRandomSentence(){
  sentenceDisplay.textContent="Loading prompt...";
  typingInput.disabled=true;
  typingInput.value="";
  typingScore.textContent="Time: 0.00s";

  try{
    const randomSeed=Math.floor(Math.random()*10000);
    const prompt=`Write a 7-12 word colonial-era sentence about school life in 1776. Variation: ${randomSeed}`;
    const response=await fetch(`https://text.pollinations.ai/${encodeURIComponent(prompt)}`);
    let aiText=await response.text();
    const words=aiText.trim().split(/\s+/).slice(0,12);
    currentSentence=words.join(" ")||"Students in 1776 wrote with quills on parchment.";
    if(currentSentence === lastSentence) currentSentence += " (again)";
    lastSentence = currentSentence;
  } catch { currentSentence="Students in 1776 wrote with quills on parchment."; }

  sentenceDisplay.textContent=currentSentence;
  typingInput.disabled=false;
  typingStarted=false;
  typingStartTime=0;
  clearInterval(typingTimer);
  typingScore.textContent="Time: 0.00s";
}

function resetTypingChallenge(){
  clearInterval(typingTimer);
  fetchRandomSentence();
}

["paste","copy","cut","drop"].forEach(evt=>typingInput.addEventListener(evt,e=>e.preventDefault()));

typingInput.addEventListener("input",()=>{
  if(!typingStarted && typingInput.value.length>0){
    typingStarted=true;
    typingStartTime=Date.now();
    typingTimer=setInterval(()=>{
      const elapsed=(Date.now()-typingStartTime)/1000;
      typingScore.textContent=`Time: ${elapsed.toFixed(2)}s`;
    },10);
  }
  if(typingInput.value.length===0 && typingStarted){
    clearInterval(typingTimer);
    typingStarted=false;
    typingScore.textContent="Time: 0.00s";
  }
  if(typingInput.value===currentSentence){
    clearInterval(typingTimer);
    const elapsed=(Date.now()-typingStartTime)/1000;
    typingScore.textContent=`Time: ${elapsed.toFixed(2)}s`;
    if(typingBestTime===null||elapsed<typingBestTime){
      typingBestTime=elapsed;
      typingLeaderboard.textContent=`Best: ${typingBestTime.toFixed(2)} s`;
    }
    typingInput.disabled=true;
    setTimeout(()=>{ typingStarted=false; fetchRandomSentence(); },1000);
  }
});

typingResetBtn.addEventListener("click", resetTypingChallenge);
fetchRandomSentence();

// ===== Classroom Cleanup =====
let cleanupStarted=false, cleanupTime=0, cleanupTimer=null, cleanupBestTime=null, itemsInPlay=[]; 
const classroomItems=["📚","🖋️","🕯️","📜","🪑","🏺"];

classroomBoard.style.backgroundImage="url('https://image.slidesdocs.com/responsive-images/background/classroom-clock-powerpoint-background_d7e0458f21__960_540.jpg')";
classroomBoard.style.backgroundSize="cover";
classroomBoard.style.backgroundPosition="center";
classroomBoard.style.userSelect="none";

function startCleanupTimer(){
  if(cleanupStarted) return;
  cleanupStarted=true;
  cleanupTime=0;
  cleanupTimer=setInterval(()=>{
    cleanupTime+=0.01;
    cleanupTimerEl.textContent=`Time: ${cleanupTime.toFixed(2)}s`;
  },10);
}

function enableDrag(item){
  // Desktop drag
  item.addEventListener("mousedown", e=>{
    e.preventDefault();
    startCleanupTimer();
    const boardRect=classroomBoard.getBoundingClientRect();
    const offsetX=e.clientX-item.getBoundingClientRect().left;
    const offsetY=e.clientY-item.getBoundingClientRect().top;

    function onMouseMove(e){
      let x=e.clientX-boardRect.left-offsetX;
      let y=e.clientY-boardRect.top-offsetY;
      item.style.left=`${Math.max(0,Math.min(x,boardRect.width-item.offsetWidth))}px`;
      item.style.top=`${Math.max(0,Math.min(y,boardRect.height-item.offsetHeight))}px`;
    }

    function onMouseUp(){
      document.removeEventListener("mousemove",onMouseMove);
      document.removeEventListener("mouseup",onMouseUp);
      checkDrop(item);
    }

    document.addEventListener("mousemove",onMouseMove);
    document.addEventListener("mouseup",onMouseUp);
  });

  // Touch drag
  item.addEventListener("touchstart", e=>{
    e.preventDefault();
    startCleanupTimer();
    const touch=e.touches[0];
    const boardRect=classroomBoard.getBoundingClientRect();
    const offsetX=touch.clientX-item.getBoundingClientRect().left;
    const offsetY=touch.clientY-item.getBoundingClientRect().top;

    function onTouchMove(e){
      const touch=e.touches[0];
      let x=touch.clientX-boardRect.left-offsetX;
      let y=touch.clientY-boardRect.top-offsetY;
      item.style.left=`${Math.max(0,Math.min(x,boardRect.width-item.offsetWidth))}px`;
      item.style.top=`${Math.max(0,Math.min(y,boardRect.height-item.offsetHeight))}px`;
    }

    function onTouchEnd(){
      document.removeEventListener("touchmove",onTouchMove);
      document.removeEventListener("touchend",onTouchEnd);
      checkDrop(item);
    }

    document.addEventListener("touchmove",onTouchMove);
    document.addEventListener("touchend",onTouchEnd);
  });
}

function checkDrop(item){
  const basketRect=basket.getBoundingClientRect();
  const itemRect=item.getBoundingClientRect();
  const overlapX=itemRect.left+itemRect.width/2>basketRect.left && itemRect.left+itemRect.width/2<basketRect.right;
  const overlapY=itemRect.top+itemRect.height/2>basketRect.top && itemRect.top+itemRect.height/2<basketRect.bottom;
  if(overlapX && overlapY){
    classroomBoard.removeChild(item);
    itemsInPlay=itemsInPlay.filter(i=>i!==item);
    if(itemsInPlay.length===0){
      clearInterval(cleanupTimer);
      if(cleanupBestTime===null || cleanupTime<cleanupBestTime){
        cleanupBestTime=cleanupTime;
        cleanupLeaderboardEl.textContent=`Best: ${cleanupBestTime.toFixed(2)} s`;
      }
    }
  }
}

function resetCleanup(){
  clearInterval(cleanupTimer);
  cleanupStarted=false;
  cleanupTime=0;
  cleanupTimerEl.textContent="Time: 0.00s";
  itemsInPlay.forEach(i=>classroomBoard.removeChild(i));
  itemsInPlay=[];

  classroomItems.forEach(emoji=>{
    const item=document.createElement("div");
    item.classList.add("clutter-item");
    item.textContent=emoji;
    item.style.position="absolute";
    item.style.fontSize="32px";
    item.style.cursor="grab";

    requestAnimationFrame(()=>{
      const rect=classroomBoard.getBoundingClientRect();
      item.style.left=`${Math.random()*(rect.width-40)}px`;
      item.style.top=`${Math.random()*(rect.height-40)}px`;
    });

    enableDrag(item);
    classroomBoard.appendChild(item);
    itemsInPlay.push(item);
  });
}

resetCleanupBtn.addEventListener("click", resetCleanup);
resetCleanup();

// ===== Cursor Glow =====
document.addEventListener("mousemove", e => {
  const x=e.clientX+window.scrollX;
  const y=e.clientY+window.scrollY;
  cursorGlow.style.left=`${x}px`;
  cursorGlow.style.top=`${y}px`;
  cursorGlow.style.zIndex=9999;
});

// ===== Fullscreen =====
fullscreenBtn.addEventListener("click", ()=>{
  if(!document.fullscreenElement){
    document.documentElement.requestFullscreen().then(()=>fullscreenBtn.textContent="Exit Fullscreen");
  } else {
    document.exitFullscreen().then(()=>fullscreenBtn.textContent="Enter Fullscreen");
  }
});

document.addEventListener("fullscreenchange", ()=>{
  if(!document.fullscreenElement) fullscreenBtn.textContent="Enter Fullscreen";
});

window.scrollTo(0,0);
