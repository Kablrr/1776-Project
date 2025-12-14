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
  const prompt = promptInput.value.trim();
  if(!prompt) return alert('Enter a colonial scene!');

  imageContainer.innerHTML = '';
  loadingText.classList.remove('hidden');
  loadingText.textContent = 'Generating image...';

  const img = new Image();
  // Add random seed to prevent caching and force a new image
  img.src = `https://image.pollinations.ai/prompt/1776+colonial+scene,+${encodeURIComponent(prompt)}?width=400&height=300&seed=${Date.now()}`;
  img.alt = prompt;
  img.style.border = '2px solid #4b2e2a';
  img.style.borderRadius = '12px';

  // Only hide loading when image finishes loading or errors
  img.onload = () => {
    loadingText.classList.add('hidden');
  };
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

  const prompt = `Colonial avatar, gender: ${gender}, background: ${background}, outfit: ${outfit}, hat: ${hat}, accessory: ${accessory}, hair: ${hair}, age: ${age}, heritage: ${race}`;

  const img = new Image();
  img.src = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=250&height=250&seed=${Date.now()}`;
  img.alt = 'Colonial Avatar';
  img.style.border = '2px solid #4b2e2a';
  img.style.borderRadius = '12px';

  img.onload = () => {
    avatarLoading.classList.add('hidden');
  };
  img.onerror = () => {
    avatarLoading.classList.add('hidden');
    alert('Failed to generate avatar. Try again.');
  };

  avatarContainer.appendChild(img);
});
