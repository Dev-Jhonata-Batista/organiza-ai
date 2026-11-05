// =============================================
// tarefas.js - página de Tarefas
// =============================================

const formTarefa = document.getElementById("form-tarefa");
const listaPendentes = document.getElementById("lista-pendentes");
const listaConcluidas = document.getElementById("lista-concluidas");

let tarefas = carregar("tarefas", []);

// Coloca as matérias cadastradas no campo "Matéria"
preencherSelectMaterias("tarefa-materia");

// Mostra as tarefas nas duas listas
function mostrarTarefas() {
    listaPendentes.innerHTML = "";
    listaConcluidas.innerHTML = "";

    // Separa as pendentes das concluídas
    const pendentes = tarefas.filter(function (tarefa) {
        return tarefa.concluida === false;
    });

    const concluidas = tarefas.filter(function (tarefa) {
        return tarefa.concluida === true;
    });

    // Ordena as pendentes: a que vence primeiro fica em cima
    pendentes.sort(function (a, b) {
        return calcularDiasRestantes(a.dataEntrega) - calcularDiasRestantes(b.dataEntrega);
    });

    // ----- Lista de pendentes -----
    if (pendentes.length === 0) {
        listaPendentes.innerHTML = "<li>Nenhuma tarefa pendente.</li>";
    }

    for (const tarefa of pendentes) {
        const dias = calcularDiasRestantes(tarefa.dataEntrega);
        const cor = corDoPrazo(dias);

        const item = document.createElement("li");
        item.className = "item tarefa tarefa-" + cor;

        item.innerHTML = `
            <strong>${tarefa.titulo}</strong>
            <span class="item-detalhes">${buscarNomeMateria(tarefa.materiaId)} · ${tarefa.tipo} · Entrega: ${formatarData(tarefa.dataEntrega)}</span>
            <span class="prazo-${cor}">${textoDoPrazo(dias)}</span>
            <div>
                <button class="btn-concluir" onclick="concluirTarefa(${tarefa.id})">Concluir</button>
                <button class="btn-excluir" onclick="excluirTarefa(${tarefa.id})">Excluir</button>
            </div>
        `;

        listaPendentes.appendChild(item);
    }

    // ----- Lista de concluídas -----
    if (concluidas.length === 0) {
        listaConcluidas.innerHTML = "<li>Nenhuma tarefa concluída ainda.</li>";
    }

    for (const tarefa of concluidas) {
        const item = document.createElement("li");
        item.className = "item tarefa tarefa-concluida";

        item.innerHTML = `
            <strong>${tarefa.titulo}</strong>
            <span class="item-detalhes">${buscarNomeMateria(tarefa.materiaId)} · ${tarefa.tipo} · Concluída em ${formatarData(tarefa.dataConclusao)}</span>
            <div>
                <button class="btn-excluir" onclick="excluirTarefa(${tarefa.id})">Excluir</button>
            </div>
        `;

        listaConcluidas.appendChild(item);
    }
}

// Quando o formulário for enviado (botão Adicionar)
formTarefa.addEventListener("submit", function (evento) {
    evento.preventDefault();

    // A matéria vem como texto. Se for "", é "Sem matéria"
    const valorMateria = document.getElementById("tarefa-materia").value;
    let materiaId = null;

    if (valorMateria !== "") {
        materiaId = Number(valorMateria);
    }

    const novaTarefa = {
        id: gerarId(),
        titulo: document.getElementById("tarefa-titulo").value,
        materiaId: materiaId,
        tipo: document.getElementById("tarefa-tipo").value,
        dataEntrega: document.getElementById("tarefa-data").value,
        concluida: false,
        dataConclusao: null
    };

    tarefas.push(novaTarefa);
    salvar("tarefas", tarefas);
    mostrarTarefas();

    formTarefa.reset();
});

// Marca a tarefa como feita
function concluirTarefa(id) {
    const tarefa = tarefas.find(function (t) {
        return t.id === id;
    });

    tarefa.concluida = true;
    tarefa.dataConclusao = dataDeHoje();

    salvar("tarefas", tarefas);
    ganharXP(XP_TAREFA);
    mostrarTarefas();
}

// Exclui a tarefa
function excluirTarefa(id) {
    const confirmou = confirm("Excluir esta tarefa?");

    if (!confirmou) {
        return;
    }

    tarefas = tarefas.filter(function (t) {
        return t.id !== id;
    });

    salvar("tarefas", tarefas);
    mostrarTarefas();
}

// Quando a página abre, mostra as tarefas salvas
mostrarTarefas();
