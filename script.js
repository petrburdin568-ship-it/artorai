// Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAkUy0ypM4Chg9Pim2PaAd2dJyQURyisfc",
  authDomain: "artotai.firebaseapp.com",
  projectId: "artotai",
  storageBucket: "artotai.firebasestorage.app",
  messagingSenderId: "643723224513",
  appId: "1:643723224513:web:1288944ca9e33ed2847b40",
  measurementId: "G-02J5X0DRGL"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const USERNAME_STORAGE_KEY = "artorai_username";

// Р’РѕРїСЂРѕСЃС‹
let questions = [
  {
    type: "poem",
    content:
      "Р’ С‚СѓРјР°РЅРµ СЂР°РЅРЅРµРіРѕ СѓС‚СЂР°\nР›РёСЃС‚СЊСЏ С€РµРїС‡СѓС‚ СЃРІРѕРё С‚Р°Р№РЅС‹,\nР РјРёСЂ С‚РёС…Рѕ РґС‹С€РёС‚ РІРѕРєСЂСѓРі,\nРЎР»РѕРІРЅРѕ РІСЂРµРјСЏ Р·Р°РјРµРґР»РёР»РѕСЃСЊ.",
    answer: "ai"
  },
  {
    type: "poem",
    content:
      "РћСЃРµРЅСЊ. РЎР°Рґ РѕРїСѓСЃС‚РµР»С‹Р№,\nР”РѕР¶РґРёРє РјРµР»РєРёР№ СЃС‚СѓС‡РёС‚.\nР›РёСЃС‚ РєСЂСѓР¶РёС‚СЃСЏ РЅРµСЃРјРµР»С‹Р№,\nР С‚СѓРјР°РЅ РІСЃС‘ РјРѕР»С‡РёС‚.",
    answer: "human"
  },
  {
    type: "poem",
    content:
      "РЎРІРµС‚ С„РѕРЅР°СЂРµР№ СЃРєРѕР»СЊР·РёС‚ РїРѕ РјРѕСЃС‚РѕРІРѕР№,\nРќРѕС‡СЊ РїСЂСЏС‡РµС‚ РіРѕСЂРѕРґР° СЃРµРєСЂРµС‚С‹,\nРўРёС€РёРЅР° Р·Р°РїРѕР»РЅСЏРµС‚ РїСѓСЃС‚РѕС‚Сѓ,\nР РІРµС‚РµСЂ РёРіСЂР°РµС‚ СЃ РѕРіРЅСЏРјРё.",
    answer: "ai"
  },
  {
    type: "poem",
    content:
      "Р—РІС‘Р·РґС‹ С‚РёС…Рѕ РїР°РґР°СЋС‚ РІ СЂРµРєСѓ,\nР РѕС‚СЂР°Р¶РµРЅРёРµ РёС… РјРµСЂС†Р°РµС‚.\nРЎРєРІРѕР·СЊ РЅРѕС‡СЊ РїСЂРѕС…РѕРґРёС‚ Р»С‘РіРєРёР№ СЃРІРµС‚,\nР СЃРµСЂРґС†Рµ Рє С‚Р°Р№РЅРµ РїСЂРёРєРѕРІР°РЅРѕ.",
    answer: "human"
  },
  {
    type: "poem",
    content:
      "РЎРєСЂРёРї СЃС‚Р°СЂС‹С… РґРІРµСЂРµР№ РІ РїСѓСЃС‚РѕРј РґРѕРјРµ,\nР›Р°РјРїР° Р»СЊС‘С‚ РјСЏРіРєРёР№ СЃРІРµС‚ РЅР° РїРѕР».\nРўС‘РїР»С‹Р№ Р·Р°РїР°С… СЃС‚Р°СЂС‹С… РєРЅРёРі Рё Р±СѓРјР°РіРё,\nР РІСЂРµРјСЏ РєР°Р¶РµС‚СЃСЏ РѕСЃС‚Р°РЅРѕРІРёРІС€РёРјСЃСЏ.",
    answer: "human"
  },
  { type: "music", audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", answer: "ai" },
  { type: "music", audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3", answer: "human" },
  { type: "music", audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3", answer: "ai" },
  { type: "music", audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3", answer: "human" },
  {
    type: "image",
    image: "image/ai1.png",
    caption: "РџРѕСЃРјРѕС‚СЂРёС‚Рµ РЅР° РёР·РѕР±СЂР°Р¶РµРЅРёРµ Рё РІС‹Р±РµСЂРёС‚Рµ РІР°СЂРёР°РЅС‚:",
    answer: "ai"
  },
  {
    type: "image",
    image: "image/human1.webp",
    caption: "РџРѕСЃРјРѕС‚СЂРёС‚Рµ РЅР° РёР·РѕР±СЂР°Р¶РµРЅРёРµ Рё РІС‹Р±РµСЂРёС‚Рµ РІР°СЂРёР°РЅС‚:",
    answer: "human"
  }
];

questions = questions.sort(() => Math.random() - 0.5);

let currentQuestion = 0;
let score = 0;
let wrongAnswers = [];

function resetAndStartRound() {
  currentQuestion = 0;
  score = 0;
  wrongAnswers = [];
  questions = questions.sort(() => Math.random() - 0.5);

  document.getElementById("content").innerHTML = "";
  document.getElementById("result").innerHTML = "";
  document.getElementById("subtitle").style.display = "block";
  document.getElementById("answerButtons").style.display = "block";
  document.querySelector(".progress-container").style.display = "block";
  document.getElementById("progress-bar").style.width = "0%";
  document.getElementById("nameModal").style.display = "none";

  document.querySelectorAll(".achievements, .retry-button").forEach((el) => el.remove());
  showQuestion();
}

function getUnlockedAchievements(percentage) {
  const unlocked = [];
  const hasImageQuestions = questions.some((q) => q.type === "image");
  const hasMusicQuestions = questions.some((q) => q.type === "music");
  const imageMistakes = wrongAnswers.filter((err) => err.question.type === "image").length;
  const musicMistakes = wrongAnswers.filter((err) => err.question.type === "music").length;

  if (percentage === 100) unlocked.push("РРґРµР°Р»СЊРЅР°СЏ С‚РѕС‡РЅРѕСЃС‚СЊ");
  if (percentage >= 80) unlocked.push("Р”РµС‚РµРєС‚РёРІ РєРѕРЅС‚РµРЅС‚Р°");
  if (percentage >= 60) unlocked.push("Р’РЅРёРјР°С‚РµР»СЊРЅС‹Р№ РёРіСЂРѕРє");
  if (hasImageQuestions && imageMistakes === 0) unlocked.push("РћСЃС‚СЂС‹Р№ РіР»Р°Р·");
  if (hasMusicQuestions && musicMistakes === 0) unlocked.push("РРґРµР°Р»СЊРЅС‹Р№ СЃР»СѓС…");
  if (unlocked.length === 0) unlocked.push("РџРµСЂРІС‹Р№ РїСЂРѕР№РґРµРЅРЅС‹Р№ С‚РµСЃС‚");

  return unlocked;
}

function restoreSavedUser() {
  const savedName = localStorage.getItem(USERNAME_STORAGE_KEY);
  if (!savedName) return;

  window.currentUser = savedName;
  const usernameInput = document.getElementById("username");
  if (usernameInput) usernameInput.value = savedName;
  resetAndStartRound();
}

function initApp() {
  const savedName = localStorage.getItem(USERNAME_STORAGE_KEY);
  const nameModal = document.getElementById("nameModal");
  const answerButtons = document.getElementById("answerButtons");
  const progressContainer = document.querySelector(".progress-container");

  if (!savedName) {
    if (nameModal) nameModal.style.display = "flex";
    if (answerButtons) answerButtons.style.display = "none";
    if (progressContainer) progressContainer.style.display = "none";
    return;
  }

  restoreSavedUser();
}

function startTest() {
  const username = document.getElementById("username").value.trim();
  if (!username) {
    alert("Р’РІРµРґРёС‚Рµ РёРјСЏ!");
    return;
  }

  window.currentUser = username;
  localStorage.setItem(USERNAME_STORAGE_KEY, username);
  resetAndStartRound();
}

function showQuestion() {
  const q = questions[currentQuestion];
  const contentDiv = document.getElementById("content");
  contentDiv.innerHTML = "";

  if (q.type === "poem") {
    const p = document.createElement("p");
    p.style.whiteSpace = "pre-line";
    p.innerText = q.content;
    p.classList.add("fade-in");
    contentDiv.appendChild(p);
  }

  if (q.type === "music") {
    const audioBox = document.createElement("div");
    audioBox.innerHTML = `
      <p style="margin-bottom:12px; font-size:18px;">РЎР»СѓС€Р°Р№С‚Рµ Р°СѓРґРёРѕ Рё РІС‹Р±РµСЂРёС‚Рµ РІР°СЂРёР°РЅС‚:</p>
      <audio controls class="fade-in">
        <source src="${q.audio}" type="audio/mpeg">
        РўРµРі audio РЅРµ РїРѕРґРґРµСЂР¶РёРІР°РµС‚СЃСЏ РІР°С€РёРј Р±СЂР°СѓР·РµСЂРѕРј.
      </audio>
    `;
    contentDiv.appendChild(audioBox);
  }

  if (q.type === "image") {
    const imageBox = document.createElement("div");
    const caption = q.caption || "Look at the image and choose:";
    const normalized = (q.image || "").replace(/^\.?\//, "");
    const tried = new Set();
    const imageCandidates = [
      q.image,
      "./" + normalized,
      "/" + normalized,
      normalized.replace(/^image\//, "images/"),
      "./" + normalized.replace(/^image\//, "images/"),
      normalized.split("/").pop(),
      "./" + normalized.split("/").pop()
    ].filter((src) => src && !tried.has(src) && tried.add(src));

    imageBox.innerHTML = `<p style="margin-bottom:12px; font-size:18px;">${caption}</p>`;
    const img = document.createElement("img");
    img.alt = "Question image";
    img.className = "question-image fade-in";

    let candidateIndex = 0;
    img.onerror = function () {
      candidateIndex++;
      if (candidateIndex < imageCandidates.length) {
        img.src = imageCandidates[candidateIndex];
        return;
      }
      imageBox.innerHTML += '<p style="color:#ff6b6b; margin-top:10px;">Image failed to load.</p>';
      console.error("Image load failed for all paths:", imageCandidates);
    };

    img.src = imageCandidates[0];
    imageBox.appendChild(img);
    contentDiv.appendChild(imageBox);
  }

  document.querySelectorAll("#answerButtons button").forEach((btn) => btn.classList.add("slide-up"));
  const progress = (currentQuestion / questions.length) * 100;
  document.getElementById("progress-bar").style.width = progress + "%";
}

function answer(userAnswer) {
  const q = questions[currentQuestion];
  if (q.answer === userAnswer) score++;
  else wrongAnswers.push({ question: q, userAnswer: userAnswer });

  currentQuestion++;
  if (currentQuestion < questions.length) showQuestion();
  else showResult();
}

function showResult() {
  document.getElementById("content").innerHTML = "";
  document.getElementById("subtitle").style.display = "none";
  document.getElementById("answerButtons").style.display = "none";
  document.querySelector(".progress-container").style.display = "none";

  const percentage = Math.round((score / questions.length) * 100);
  const resultDiv = document.getElementById("result");
  resultDiv.innerText = "Р’Р°С€ СЂРµР·СѓР»СЊС‚Р°С‚: " + percentage + "% РїСЂР°РІРёР»СЊРЅС‹С… РѕС‚РІРµС‚РѕРІ";
  resultDiv.classList.add("fade-in");

  const achievements = getUnlockedAchievements(percentage);
  const achContainer = document.createElement("div");
  achContainer.classList.add("achievements");
  achContainer.innerHTML = "<strong>Р”РѕСЃС‚РёР¶РµРЅРёСЏ:</strong>";
  document.querySelector(".container").appendChild(achContainer);

  achievements.forEach((ach, index) => {
    const item = document.createElement("div");
    item.classList.add("achievement-item");
    item.innerText = ach;
    item.style.animationDelay = index * 0.4 + "s";
    achContainer.appendChild(item);
  });

  db.collection("results")
    .add({
      name: window.currentUser,
      score: percentage,
      date: new Date()
    })
    .then(() => console.log("Р РµР·СѓР»СЊС‚Р°С‚ СЃРѕС…СЂР°РЅС‘РЅ"))
    .catch((e) => console.error("РћС€РёР±РєР°:", e));

  const retryBtn = document.createElement("button");
  retryBtn.innerText = "РџСЂРѕР№С‚Рё Р·Р°РЅРѕРІРѕ";
  retryBtn.onclick = () => resetAndStartRound();
  retryBtn.classList.add("slide-up", "retry-button");
  document.querySelector(".container").appendChild(retryBtn);

  if (wrongAnswers.length > 0) {
    console.log("РћС€РёР±РєРё РїРѕР»СЊР·РѕРІР°С‚РµР»СЏ:");
    wrongAnswers.forEach((err, i) => {
      console.log(`${i + 1}) Р’РѕРїСЂРѕСЃ:`, err.question, "Р’Р°С€ РѕС‚РІРµС‚:", err.userAnswer);
    });
  }
}

initApp();

