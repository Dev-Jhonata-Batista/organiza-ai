// =============================================
// pomodoro.js - cronômetro de estudo e pausa
// =============================================

const textoTempo = document.getElementById("pomodoro-tempo");
const textoFase = document.getElementById("pomodoro-fase");

let segundos = 0;       // quantos segundos faltam
let estudando = true;   // true = hora de estudar, false = hora da pausa
let relogio = null;     // o relógio que roda a cada segundo
let horaDoFim = 0;      // o momento exato em que o tempo acaba

// Mostra o tempo no formato 25:00
function mostrarTempo() {
    const minutos = Math.floor(segundos / 60);
    const resto = segundos % 60;
    textoTempo.textContent = String(minutos).padStart(2, "0") + ":" + String(resto).padStart(2, "0");
}

// Prepara o cronômetro para a fase atual (estudo ou pausa)
function prepararFase() {
    if (estudando) {
        segundos = document.getElementById("minutos-estudo").value * 60;
        textoFase.textContent = "Hora de estudar";
        textoFase.classList.remove("fase-pausa");
    } else {
        segundos = document.getElementById("minutos-pausa").value * 60;
        textoFase.textContent = "Hora da pausa";
        textoFase.classList.add("fase-pausa");
    }
    mostrarTempo();
}

// Roda a cada segundo enquanto o cronômetro está ligado
function contar() {
    segundos = Math.round((horaDoFim - Date.now()) / 1000);

    if (segundos <= 0) {
        pausar();
        alert("O tempo acabou!");
        estudando = !estudando; // troca: estudo vira pausa, pausa vira estudo
        prepararFase();
        return;
    }

    mostrarTempo();
}

// Botão Iniciar
function iniciar() {
    if (relogio !== null) {
        return; // já está rodando, não liga outro relógio
    }
    horaDoFim = Date.now() + segundos * 1000;
    relogio = setInterval(contar, 1000);
}

// Botão Pausar
function pausar() {
    clearInterval(relogio);
    relogio = null;
}

// Botão Zerar (também roda quando a pessoa muda os minutos)
function zerar() {
    pausar();
    estudando = true;
    prepararFase();
}

// Quando a página abre
prepararFase();