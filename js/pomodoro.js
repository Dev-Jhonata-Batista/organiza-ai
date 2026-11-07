// =============================================
// pomodoro.js - página do Pomodoro
// =============================================

// Tempos em segundos (25 minutos e 5 minutos)
const TEMPO_ESTUDO = 25 * 60;
const TEMPO_PAUSA = 5 * 60;

// Elementos da página
const textoFase = document.getElementById("pomodoro-fase");
const textoTempo = document.getElementById("pomodoro-tempo");
const textoHoje = document.getElementById("pomodoros-hoje");
const selectMateria = document.getElementById("pomodoro-materia");

// Situação atual do cronômetro
let fase = "estudo";                  // "estudo" ou "pausa"
let segundosRestantes = TEMPO_ESTUDO;
let horaDoFim = null;                 // momento exato em que o tempo acaba
let intervalo = null;                 // o "relógio" que roda a cada segundo

preencherSelectMaterias("pomodoro-materia");

// Mostra o tempo no formato 25:00
function mostrarTempo() {
    const minutos = Math.floor(segundosRestantes / 60);
    const segundos = segundosRestantes % 60;

    const texto = String(minutos).padStart(2, "0") + ":" + String(segundos).padStart(2, "0");

    textoTempo.textContent = texto;
    document.title = texto + " | Pomodoro";
}

// Mostra quantos Pomodoros foram feitos hoje
function mostrarPomodorosDeHoje() {
    const pomodoros = carregar("pomodoros", []);

    const deHoje = pomodoros.filter(function (p) {
        return p.data === dataDeHoje();
    });

    textoHoje.textContent = deHoje.length;
}

// Roda a cada segundo enquanto o cronômetro está ligado
function contar() {
    segundosRestantes = Math.round((horaDoFim - Date.now()) / 1000);

    if (segundosRestantes <= 0) {
        segundosRestantes = 0;
        mostrarTempo();
        terminarFase();
        return;
    }

    mostrarTempo();
}

// Liga o cronômetro
function iniciar() {
    // Se já estiver rodando, não faz nada
    if (intervalo !== null) {
        return;
    }

    horaDoFim = Date.now() + segundosRestantes * 1000;
    intervalo = setInterval(contar, 1000);
}

// Pausa o cronômetro (o tempo que falta continua guardado)
function pausar() {
    clearInterval(intervalo);
    intervalo = null;
}

// Volta para o começo do estudo
function zerar() {
    pausar();
    mudarFase("estudo");
}

// Troca entre estudo e pausa
function mudarFase(novaFase) {
    fase = novaFase;

    if (fase === "estudo") {
        segundosRestantes = TEMPO_ESTUDO;
        textoFase.textContent = "Hora de estudar";
        textoFase.classList.remove("fase-pausa");
    } else {
        segundosRestantes = TEMPO_PAUSA;
        textoFase.textContent = "Hora da pausa";
        textoFase.classList.add("fase-pausa");
    }

    mostrarTempo();
}

// Quando o tempo acaba
function terminarFase() {
    pausar();

    if (fase === "estudo") {
        registrarPomodoro();
        alert("Pomodoro concluído! Você ganhou " + XP_POMODORO + " XP. Hora da pausa.");
        mudarFase("pausa");
    } else {
        alert("A pausa acabou! Bora estudar de novo?");
        mudarFase("estudo");
    }
}

// Salva o Pomodoro feito e dá os pontos
function registrarPomodoro() {
    const valorMateria = selectMateria.value;
    let materiaId = null;

    if (valorMateria !== "") {
        materiaId = Number(valorMateria);
    }

    const pomodoros = carregar("pomodoros", []);

    pomodoros.push({
        id: gerarId(),
        materiaId: materiaId,
        data: dataDeHoje(),
        minutos: 25
    });

    salvar("pomodoros", pomodoros);
    ganharXP(XP_POMODORO);
    mostrarPomodorosDeHoje();
}

// Liga cada botão à sua função
document.getElementById("btn-iniciar").addEventListener("click", iniciar);
document.getElementById("btn-pausar").addEventListener("click", pausar);
document.getElementById("btn-zerar").addEventListener("click", zerar);

// Quando a página abre
mostrarTempo();
mostrarPomodorosDeHoje();