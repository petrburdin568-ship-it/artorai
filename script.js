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

// Вопросы
let questions = [
  {
    type: "poem",
    content:
      "В тумане раннего утра\nЛистья шепчут свои тайны,\nИ мир тихо дышит вокруг,\nСловно время замедлилось.",
    answer: "ai"
  },
  {
    type: "poem",
    content:
      "Осень. Сад опустелый,\nДождик мелкий стучит.\nЛист кружится несмелый,\nИ туман всё молчит.",
    answer: "human"
  },
  {
    type: "poem",
    content:
      "Свет фонарей скользит по мостовой,\nНочь прячет города секреты,\nТишина заполняет пустоту,\nИ ветер играет с огнями.",
    answer: "ai"
  },
  {
    type: "poem",
    content:
      "Звёзды тихо падают в реку,\nИ отражение их мерцает.\nСквозь ночь проходит лёгкий свет,\nИ сердце к тайне приковано.",
    answer: "human"
  },
  {
    type: "poem",
    content:
      "Скрип старых дверей в пустом доме,\nЛампа льёт мягкий свет на пол.\nТёплый запах старых книг и бумаги,\nИ время кажется остановившимся.",
    answer: "human"
  },
  { type: "music", audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", answer: "ai" },
  { type: "music", audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3", answer: "human" },
  { type: "music", audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3", answer: "ai" },
  { type: "music", audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3", answer: "human" },
  {
    type: "image",
    image: "image/imagesart-ai-1.jpg.png",
    caption: "Посмотрите на изображение и выберите вариант:",
    answer: "ai"
  },
  {
    type: "image",
    image: "image/imagesart-human-1.jpg.webp",
    caption: "Посмотрите на изображение и выберите вариант:",
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

  if (percentage === 100) unlocked.push("Идеальная точность");
  if (percentage >= 80) unlocked.push("Детектив контента");
  if (percentage >= 60) unlocked.push("Внимательный игрок");
  if (hasImageQuestions && imageMistakes === 0) unlocked.push("Острый глаз");
  if (hasMusicQuestions && musicMistakes === 0) unlocked.push("Идеальный слух");
  if (unlocked.length === 0) unlocked.push("Первый пройденный тест");

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
    alert("Введите имя!");
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
      <p style="margin-bottom:12px; font-size:18px;">Слушайте аудио и выберите вариант:</p>
      <audio controls class="fade-in">
        <source src="${q.audio}" type="audio/mpeg">
        Тег audio не поддерживается вашим браузером.
      </audio>
    `;
    contentDiv.appendChild(audioBox);
  }

  if (q.type === "image") {
    const imageBox = document.createElement("div");
    imageBox.innerHTML = `
      <p style="margin-bottom:12px; font-size:18px;">${q.caption || "Посмотрите на изображение и выберите вариант:"}</p>
      <img src="${q.image}" alt="Вопрос с изображением" class="question-image fade-in">
    `;
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
  resultDiv.innerText = "Ваш результат: " + percentage + "% правильных ответов";
  resultDiv.classList.add("fade-in");

  const achievements = getUnlockedAchievements(percentage);
  const achContainer = document.createElement("div");
  achContainer.classList.add("achievements");
  achContainer.innerHTML = "<strong>Достижения:</strong>";
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
    .then(() => console.log("Результат сохранён"))
    .catch((e) => console.error("Ошибка:", e));

  const retryBtn = document.createElement("button");
  retryBtn.innerText = "Пройти заново";
  retryBtn.onclick = () => resetAndStartRound();
  retryBtn.classList.add("slide-up", "retry-button");
  document.querySelector(".container").appendChild(retryBtn);

  if (wrongAnswers.length > 0) {
    console.log("Ошибки пользователя:");
    wrongAnswers.forEach((err, i) => {
      console.log(`${i + 1}) Вопрос:`, err.question, "Ваш ответ:", err.userAnswer);
    });
  }
}

initApp();
