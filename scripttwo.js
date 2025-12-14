// ===== Cursor Glow =====
const cursorGlow = document.getElementById('cursorGlow');
document.addEventListener('mousemove', e => {
  cursorGlow.style.top = e.clientY + 'px';
  cursorGlow.style.left = e.clientX + 'px';
});

// ===== Text-to-Image Generator =====
const generateBtn = document.getElementById('generateBtn');
const promptInput = document.getElementById('promptInput');
const imageContainer = document.getElementById('imageContainer');
const loadingText = document.getElementById('loadingText');

generateBtn.addEventListener('click', () => {
  const userPrompt = promptInput.value.trim();
  if (!userPrompt) return alert('Enter a colonial scene!');

  imageContainer.innerHTML = '';
  loadingText.classList.remove('hidden');
  loadingText.textContent = 'Generating image...';

  const prompt = `Student in 1776 classroom, ${userPrompt}, colonial style, historical accuracy`;

  const img = new Image();
  img.src = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}`;
  img.alt = prompt;
  img.style.border = '2px solid #4b2e2a';
  img.style.borderRadius = '12px';
  img.onload = () => loadingText.classList.add('hidden');
  img.onerror = () => {
    loadingText.classList.add('hidden');
    alert('Failed to generate image. Try again.');
  };

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

  const prompt = `1776 student avatar, gender: ${gender}, background: ${background}, outfit: ${outfit}, hat: ${hat}, accessory: ${accessory}, hair: ${hair}, age: ${age}, heritage: ${race}, colonial style, historical accuracy`;

  const img = new Image();
  img.src = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}`;
  img.alt = 'Colonial Avatar';
  img.style.border = '2px solid #4b2e2a';
  img.style.borderRadius = '12px';
  img.onload = () => avatarLoading.classList.add('hidden');
  img.onerror = () => {
    avatarLoading.classList.add('hidden');
    alert('Failed to generate avatar. Try again.');
  };

  avatarContainer.appendChild(img);
});
