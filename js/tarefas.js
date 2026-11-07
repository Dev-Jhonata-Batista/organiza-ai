// =============================================
// tarefas.js - lista de tarefas com cores de prazo
// =============================================

// Busca as tarefas salvas no navegador. Se não tiver nada, começa com uma lista vazia.
let tarefas = JSON.parse(localStorage.getItem("tarefas")) || [];

const formulario = document.getElementById("form-tarefa");
const lista = document.getElementById("lista-tarefas");

// Calcula quantos dias faltam até a data de entrega
function diasRestantes(data) {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    const entrega = new Date(data + "T00:00:00");

    return Math.round((entrega - hoje) / 86400000); // 86400000 = milissegundos de um dia
}

// Escolhe a cor conforme os dias que faltam
function corDoPrazo(dias) {
    if (dias <= 2) {
        return "vermelho";
    }
    if (dias <= 5) {
        return "amarelo";
    }
    return "verde";
}

// Salva no navegador e atualiza a tela
function salvar() {
    localStorage.setItem("tarefas", JSON.stringify(tarefas));
    mostrarTarefas();
}

// Mostra todas as tarefas na lista
function mostrarTarefas() {
    lista.innerHTML = "";

    if (tarefas.length === 0) {
        lista.innerHTML = "<li>Nenhuma tarefa cadastrada.</li>";
    }

    for (let i = 0; i < tarefas.length; i++) {
        const tarefa = tarefas[i];
        const dias = diasRestantes(tarefa.data);
        const cor = corDoPrazo(dias);

        let texto = "Faltam " + dias + " dia(s)";
        if (dias < 0) {
            texto = "Atrasada";
        }

        let classeFeita = "";
        if (tarefa.feita) {
            classeFeita = "tarefa-feita";
        }

        lista.innerHTML += `
            <li class="item tarefa tarefa-${cor} ${classeFeita}">
                <strong>${tarefa.titulo}</strong>
                <span class="item-detalhes">${tarefa.materia} · ${tarefa.tipo} · Entrega: ${tarefa.data.split("-").reverse().join("/")}</span>
                <span class="prazo-${cor}">${texto}</span>
                <div>
                    <button class="btn-concluir" onclick="marcarFeita(${i})">Feita</button>
                    <button class="btn-excluir" onclick="excluir(${i})">Excluir</button>
                </div>
            </li>
        `;
    }
}

// Adiciona uma tarefa quando o formulário é enviado
formulario.addEventListener("submit", function (evento) {
    evento.preventDefault(); // impede a página de recarregar

    tarefas.push({
        titulo: document.getElementById("tarefa-titulo").value,
        materia: document.getElementById("tarefa-materia").value,
        tipo: document.getElementById("tarefa-tipo").value,
        data: document.getElementById("tarefa-data").value,
        feita: false
    });

    formulario.reset();
    salvar();
});

// Marca ou desmarca a tarefa como feita
function marcarFeita(i) {
    tarefas[i].feita = !tarefas[i].feita;
    salvar();
}

// Remove a tarefa da lista
function excluir(i) {
    tarefas.splice(i, 1);
    salvar();
}

// Mostra as tarefas quando a página abre
mostrarTarefas();