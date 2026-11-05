// =============================================
// geral.js - funções usadas por todas as páginas
// =============================================

// ----- Guardar e buscar dados no navegador -----

// Busca um dado salvo no navegador.
// Se ainda não existir nada salvo com esse nome, devolve o valorPadrao.
function carregar(chave, valorPadrao) {
    const texto = localStorage.getItem(chave);

    if (texto === null) {
        return valorPadrao;
    }

    return JSON.parse(texto);
}

// Salva um dado no navegador com um nome (chave).
function salvar(chave, valor) {
    const texto = JSON.stringify(valor);
    localStorage.setItem(chave, texto);
}

// ----- Funções de apoio -----

// Cria um número diferente para cada item (matéria, tarefa, anotação).
// Funciona como o "código" de cada um, igual a um id de banco de dados.
function gerarId() {
    return Date.now();
}

// Transforma "2026-11-10" em "10/11/2026"
function formatarData(dataTexto) {
    const partes = dataTexto.split("-");
    return partes[2] + "/" + partes[1] + "/" + partes[0];
}

// ----- Datas -----

// Devolve a data de hoje no formato "2026-11-05"
function dataDeHoje() {
    const hoje = new Date();
    const ano = hoje.getFullYear();
    const mes = String(hoje.getMonth() + 1).padStart(2, "0");
    const dia = String(hoje.getDate()).padStart(2, "0");
    return ano + "-" + mes + "-" + dia;
}

// ----- Matérias (usadas em Tarefas, Anotações e Pomodoro) -----

// Coloca as matérias salvas como opções de um <select>
function preencherSelectMaterias(idDoSelect) {
    const select = document.getElementById(idDoSelect);
    const materias = carregar("materias", []);

    for (const materia of materias) {
        const opcao = document.createElement("option");
        opcao.value = materia.id;
        opcao.textContent = materia.nome;
        select.appendChild(opcao);
    }
}

// Devolve o nome da matéria a partir do id dela
function buscarNomeMateria(materiaId) {
    const materias = carregar("materias", []);

    const materia = materias.find(function (m) {
        return m.id === materiaId;
    });

    if (materia === undefined) {
        return "Sem matéria";
    }

    return materia.nome;
}

// ----- Prazos -----

// Quantos dias faltam de hoje até a data de entrega
function calcularDiasRestantes(dataEntrega) {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    const entrega = new Date(dataEntrega + "T00:00:00");

    const umDiaEmMs = 1000 * 60 * 60 * 24;
    return Math.round((entrega - hoje) / umDiaEmMs);
}

// Qual cor o prazo deve ter
function corDoPrazo(dias) {
    if (dias <= 2) {
        return "vermelho";
    }
    if (dias <= 5) {
        return "amarelo";
    }
    return "verde";
}

// O texto que aparece na tarefa
function textoDoPrazo(dias) {
    if (dias < 0) {
        return "Atrasada há " + Math.abs(dias) + " dia(s)";
    }
    if (dias === 0) {
        return "Vence hoje";
    }
    if (dias === 1) {
        return "Vence amanhã";
    }
    return "Faltam " + dias + " dias";
}