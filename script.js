// ======= Вопросы =======
let questions = [

    // ======= Стихи =======
    {
        type: "poem",
        content: "В тумане раннего утра\nЛистья шепчут свои тайны,\nИ мир тихо дышит вокруг,\nСловно время замедлилось.",
        answer: "ai"
    },
    {
        type: "poem",
        content: "Осень. Сад опустелый,\nДождик мелкий стучит.\nЛист кружится несмелый,\nИ туман всё молчит.",
        answer: "human"
    },
    {
        type: "poem",
        content: "Свет фонарей скользит по мостовой,\nНочь прячет города секреты,\nТишина заполняет пустоту,\nИ ветер играет с огнями.",
        answer: "ai"
    },
    {
        type: "poem",
        content: "Звёзды тихо падают в реку,\nИ отражение их мерцает.\nСквозь ночь проходит лёгкий свет,\nИ сердце к тайне приковано.",
        answer: "human"
    },

    // ======= Музыка =======
    {
        type: "music",
        audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        answer: "ai"
    },
    {
        type: "music",
        audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
        answer: "human"
    },
    {
        type: "music",
        audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
        answer: "ai"
    },
    {
        type: "music",
        audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
        answer: "human"
    }
];

// ======= Перемешивание =======
questions = questions.sort(() => Math.random() - 0.5);

let currentQuestion = 0;
let score = 0;

// ======= Начало теста =======
function startTest() {
    document.getElementById("startBtn").style.display = "none";
    document.getElementById("answerButtons").style.display = "block";
    document.querySelector(".progress-container").style.display = "block";
    showQuestion();
}

// ======= Показ вопроса =======
function showQuestion() {
    let q = questions[currentQuestion];
    let contentDiv = document.getElementById("content");
    contentDiv.innerHTML = "";

    // Стих
    if (q.type === "poem") {
        let p = document.createElement("p");
        p.style.whiteSpace = "pre-line";
        p.innerText = q.content;
        p.classList.add("fade-in");
        contentDiv.appendChild(p);
    }

    // Музыка
    if (q.type === "music") {
        let audioBox = document.createElement("div");
        audioBox.innerHTML = `
            <p style="margin-bottom: 12px; font-size: 18px;">Слушайте аудио и выберите вариант:</p>
            <audio controls class="fade-in">
                <source src="${q.audio}" type="audio/mpeg">
                Тег audio не поддерживается вашим браузером.
            </audio>
        `;
        contentDiv.appendChild(audioBox);
    }

    document.querySelectorAll("#answerButtons button").forEach(btn => {
        btn.classList.add("slide-up");
    });

    // Обновляем прогресс-бар
    let progress = (currentQuestion / questions.length) * 100;
    document.getElementById("progress-bar").style.width = progress + "%";
}

// ======= Ответ пользователя =======
function answer(userAnswer) {
    if (questions[currentQuestion].answer === userAnswer) score++;
    currentQuestion++;

    if (currentQuestion < questions.length) showQuestion();
    else showResult();
}

// ======= Показ результата =======
function showResult() {
    document.getElementById("content").innerHTML = "";
    document.getElementById("subtitle").style.display = "none";
    document.getElementById("answerButtons").style.display = "none";
    document.querySelector(".progress-container").style.display = "none";

    let percentage = Math.round((score / questions.length) * 100);
    let resultDiv = document.getElementById("result");
    resultDiv.innerText = "Ваш результат: " + percentage + "% правильных ответов";
    resultDiv.classList.add("fade-in");

    let retryBtn = document.createElement("button");
    retryBtn.innerText = "Пройти заново";
    retryBtn.onclick = () => location.reload();
    retryBtn.classList.add("slide-up");
    document.querySelector(".container").appendChild(retryBtn);
}





