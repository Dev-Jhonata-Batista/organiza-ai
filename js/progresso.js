// =============================================
// progresso.js - página de Progresso
// =============================================

const progresso = carregarProgresso();
const nivel = calcularNivel(progresso.xp);
const proximo = proximoNivel(progresso.xp);

// Nível e pontos
document.getElementById("progresso-nivel").textContent = nivel.nome;
document.getElementById("progresso-xp").textContent = progresso.xp;

// Barra de progresso e texto do próximo nível
const barra = document.getElementById("barra-preenchida");
const textoProximo = document.getElementById("texto-proximo-nivel");

if (proximo === null) {
    // Já está no último nível
    barra.style.width = "100%";
    textoProximo.textContent = "Você chegou ao nível máximo!";
} else {
    // Quanto já andou dentro do nível atual
    const xpNoNivel = progresso.xp - nivel.xpMinimo;
    const xpDoNivel = proximo.xpMinimo - nivel.xpMinimo;
    const porcentagem = (xpNoNivel / xpDoNivel) * 100;

    barra.style.width = porcentagem + "%";
    textoProximo.textContent = "Faltam " + (proximo.xpMinimo - progresso.xp) + " XP para chegar a " + proximo.nome + ".";
}

// Dias seguidos e recorde
document.getElementById("progresso-dias").textContent = diasSeguidosAtuais(progresso);
document.getElementById("progresso-recorde").textContent = progresso.recorde;

// Resumo
const tarefas = carregar("tarefas", []);
const tarefasConcluidas = tarefas.filter(function (t) {
    return t.concluida === true;
});
const pomodoros = carregar("pomodoros", []);

document.getElementById("total-tarefas").textContent = tarefasConcluidas.length;
document.getElementById("total-pomodoros").textContent = pomodoros.length;
document.getElementById("total-minutos").textContent = pomodoros.length * 25;