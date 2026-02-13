// ======= Firebase =======
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

// ======= Вопросы =======
let questions = [
    { type:"poem", content:"В тумане раннего утра\nЛистья шепчут свои тайны,\nИ мир тихо дышит вокруг,\nСловно время замедлилось.", answer:"ai" },
    { type:"poem", content:"Осень. Сад опустелый,\nДождик мелкий стучит.\nЛист кружится несмелый,\nИ туман всё молчит.", answer:"human" },
    { type:"poem", content:"Свет фонарей скользит по мостовой,\nНочь прячет города секреты,\nТишина заполняет пустоту,\nИ ветер играет с огнями.", answer:"ai" },
    { type:"poem", content:"Звёзды тихо падают в реку,\nИ отражение их мерцает.\nСквозь ночь проходит лёгкий свет,\nИ сердце к тайне приковано.", answer:"human" },
    { type:"poem", content:"Скрип старых дверей в пустом доме,\nЛампа льёт мягкий свет на пол.\nТеплый запах старых книг и бумаги,\nИ время кажется остановившимся.", answer:"human" },
    { type:"music", audio:"audio/pirates.mp3", answer:"ai" },
    { type:"music", audio:"audio/song1.mp3", answer:"human" },
    { type:"music", audio:"audio/song2.mp3", answer:"ai" },
    { type:"music", audio:"audio/song3.mp3", answer:"human" }
];

questions = questions.sort(()=>Math.random()-0.5);

let currentQuestion = 0;
let score = 0;
let wrongAnswers = [];

// ======= Проверка localStorage =======
window.onload = function(){
    const savedName = localStorage.getItem("username");
    if(savedName){
        window.currentUser = savedName;
        document.getElementById("nameModal").style.display = "none";
        document.getElementById("answerButtons").style.display = "block";
        document.querySelector(".progress-container").style.display = "block";
        showQuestion();
    } else {
        document.getElementById("nameModal").style.display = "flex";
    }
}

// ======= Старт теста =======
function startTest(){
    let username = document.getElementById("username").value.trim();
    if(!username){ alert("Введите имя!"); return; }

    window.currentUser = username;
    localStorage.setItem("username", username);

    document.getElementById("nameModal").style.display="none";
    document.getElementById("answerButtons").style.display="block";
    document.querySelector(".progress-container").style.display="block";

    showQuestion();
}

// ======= Показ вопроса =======
function showQuestion(){
    let q = questions[currentQuestion];
    let contentDiv = document.getElementById("content");
    contentDiv.innerHTML="";

    if(q.type==="poem"){
        let p=document.createElement("p");
        p.style.whiteSpace="pre-line";
        p.innerText=q.content;
        p.classList.add("fade-in");
        contentDiv.appendChild(p);
    }

    if(q.type==="music"){
        let musicDiv = document.createElement("div");
        musicDiv.classList.add("fade-in");
        musicDiv.innerHTML = `
            <div class="music-player">
                <button id="play-pause">▶️</button>
                <div class="music-bar-container">
                    <div class="music-progress-bar"></div>
                </div>
            </div>
            <audio id="audio-player">
                <source src="${q.audio}" type="audio/mpeg">
                Ваш браузер не поддерживает аудио
            </audio>
        `;
        contentDiv.appendChild(musicDiv);

        const audio = document.getElementById("audio-player");
        const playBtn = document.getElementById("play-pause");
        const musicBar = document.querySelector(".music-progress-bar");

        playBtn.addEventListener("click", ()=>{
            if(audio.paused){ audio.play(); playBtn.innerText="⏸"; }
            else { audio.pause(); playBtn.innerText="▶️"; }
        });

        audio.addEventListener("timeupdate", ()=>{
            if(audio.duration){
                const progress = (audio.currentTime/audio.duration)*100;
                musicBar.style.width = progress + "%";
            }
        });

        audio.addEventListener("ended", ()=>{
            playBtn.innerText="▶️";
            musicBar.style.width="100%";
        });
    }

    let progress = (currentQuestion/questions.length)*100;
    document.getElementById("progress-bar").style.width = progress+"%";
}

// ======= Ответ пользователя =======
function answer(userAnswer){
    let q = questions[currentQuestion];
    if(q.answer===userAnswer) score++;
    else wrongAnswers.push({question:q, userAnswer:userAnswer});
    currentQuestion++;
    if(currentQuestion<questions.length) showQuestion();
    else showResult();
}

// ======= Результат =======
function showResult(){
    document.getElementById("content").innerHTML="";
    document.getElementById("subtitle").style.display="none";
    document.getElementById("answerButtons").style.display="none";
    document.querySelector(".progress-container").style.display="none";

    let percentage=Math.round((score/questions.length)*100);
    let resultDiv=document.getElementById("result");
    resultDiv.innerText="Ваш результат: "+percentage+"% правильных ответов";
    resultDiv.classList.add("fade-in");

    // ======= Достижения =======
    let achievements = [];
    if(percentage===100) achievements.push("🏆 Мастер ИИ");
    if(currentQuestion === questions.length && localStorage.getItem("firstRun")!=="done"){
        achievements.push("🌟 Новичок");
        localStorage.setItem("firstRun","done");
    }
    if(score >= questions.length-1) achievements.push("💡 Эксперт различения");

    if(achievements.length>0){
        let achDiv=document.createElement("div");
        achDiv.style.marginTop="20px";
        achDiv.style.fontSize="18px";
        achDiv.innerHTML="<strong>Достижения:</strong><br>"+achievements.join("<br>");
        achDiv.classList.add("slide-up");
        document.querySelector(".container").appendChild(achDiv);
    }

    db.collection("results").add({
        name: window.currentUser,
        score: percentage,
        achievements: achievements,
        date: new Date()
    }).then(()=>console.log("Результат сохранён"))
      .catch(e=>console.error("Ошибка:",e));

    let retryBtn=document.createElement("button");
    retryBtn.innerText="Пройти заново";
    retryBtn.onclick=()=>{
        currentQuestion=0;
        score=0;
        wrongAnswers=[];
        document.getElementById("result").innerText="";
        document.getElementById("subtitle").style.display="block";
        document.getElementById("answerButtons").style.display="block";
        document.querySelector(".progress-container").style.display="block";
        showQuestion();
    };
    retryBtn.classList.add("slide-up");
    document.querySelector(".container").appendChild(retryBtn);

    if(wrongAnswers.length>0){
        console.log("Ошибки пользователя:");
        wrongAnswers.forEach((err,i)=>{
            console.log(`${i+1}) Вопрос:`, err.question, "Ваш ответ:", err.userAnswer);
        });
    }
}








