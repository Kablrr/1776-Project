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
