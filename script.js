
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
    { type:"music", audio:"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", answer:"ai" },
    { type:"music", audio:"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3", answer:"human" },
    { type:"music", audio:"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3", answer:"ai" },
    { type:"music", audio:"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3", answer:"human" }
];

// Перемешиваем
questions = questions.sort(()=>Math.random()-0.5);

let currentQuestion = 0;
let score = 0;
let wrongAnswers = [];

// ======= Старт теста =======
function startTest(){
    const username = document.getElementById("username").value.trim();
    if(!username){ alert("Введите имя!"); return; }
    window.currentUser = username;

    // Скрываем модальное окно
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
        let audioBox=document.createElement("div");
        audioBox.innerHTML=`
            <p style="margin-bottom:12px; font-size:18px;">Слушайте аудио и выберите вариант:</p>
            <audio controls class="fade-in">
                <source src="${q.audio}" type="audio/mpeg">
                Тег audio не поддерживается вашим браузером.
            </audio>
        `;
        contentDiv.appendChild(audioBox);
    }

    document.querySelectorAll("#answerButtons button").forEach(btn=>btn.classList.add("slide-up"));

    // Обновляем прогресс
    let progress = ((currentQuestion)/questions.length)*100;
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

    // Сохраняем результат в Firebase
    db.collection("results").add({
        name: window.currentUser,
        score: percentage,
        date: new Date()
    }).then(()=>console.log("Результат сохранён")).catch(e=>console.error("Ошибка:",e));

    // Кнопка повторного прохождения
    let retryBtn=document.createElement("button");
    retryBtn.innerText="Пройти заново";
    retryBtn.onclick=()=>location.reload();
    retryBtn.classList.add("slide-up");
    document.querySelector(".container").appendChild(retryBtn);

    // Показываем ошибки пользователя в консоли
    if(wrongAnswers.length>0){
        console.log("Ошибки пользователя:");
        wrongAnswers.forEach((err,i)=>{
            console.log(`${i+1}) Вопрос:`, err.question, "Ваш ответ:", err.userAnswer);
        });
    }
}






