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

// Transforma uma data em texto no formato "2026-11-05"
function dataParaTexto(data) {
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, "0");
    const dia = String(data.getDate()).padStart(2, "0");
    return ano + "-" + mes + "-" + dia;
}

// Data de hoje, ex.: "2026-11-05"
function dataDeHoje() {
    return dataParaTexto(new Date());
}

// Data de ontem, ex.: "2026-11-04"
function dataDeOntem() {
    const ontem = new Date();
    ontem.setDate(ontem.getDate() - 1);
    return dataParaTexto(ontem);
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

// ----- Pontos (XP), níveis e dias seguidos -----

const XP_TAREFA = 20;
const XP_POMODORO = 10;

const NIVEIS = [
    { nome: "Calouro", xpMinimo: 0 },
    { nome: "Veterano", xpMinimo: 100 },
    { nome: "Monitor", xpMinimo: 250 },
    { nome: "Formando", xpMinimo: 500 },
    { nome: "Mestre", xpMinimo: 1000 }
];

// Busca o progresso salvo (ou começa do zero)
function carregarProgresso() {
    return carregar("progresso", {
        xp: 0,
        diasSeguidos: 0,
        recorde: 0,
        ultimoDiaEstudo: null
    });
}

// Descobre o nível atual a partir dos pontos
function calcularNivel(xp) {
    let nivelAtual = NIVEIS[0];

    for (const nivel of NIVEIS) {
        if (xp >= nivel.xpMinimo) {
            nivelAtual = nivel;
        }
    }

    return nivelAtual;
}

// Descobre o próximo nível (ou null, se já estiver no último)
function proximoNivel(xp) {
    for (const nivel of NIVEIS) {
        if (xp < nivel.xpMinimo) {
            return nivel;
        }
    }

    return null;
}

// Atualiza a sequência de dias seguidos estudando
function atualizarDiasSeguidos(progresso) {
    const hoje = dataDeHoje();

    // Já estudou hoje: não muda nada
    if (progresso.ultimoDiaEstudo === hoje) {
        return;
    }

    if (progresso.ultimoDiaEstudo === dataDeOntem()) {
        // Estudou ontem: a sequência continua
        progresso.diasSeguidos = progresso.diasSeguidos + 1;
    } else {
        // Primeira vez ou ficou um dia sem estudar: começa de novo
        progresso.diasSeguidos = 1;
    }

    progresso.ultimoDiaEstudo = hoje;

    // Bateu o recorde?
    if (progresso.diasSeguidos > progresso.recorde) {
        progresso.recorde = progresso.diasSeguidos;
    }
}

// Dias seguidos para mostrar na tela.
// Se o último estudo foi antes de ontem, a sequência já foi perdida.
function diasSeguidosAtuais(progresso) {
    if (progresso.ultimoDiaEstudo === dataDeHoje() || progresso.ultimoDiaEstudo === dataDeOntem()) {
        return progresso.diasSeguidos;
    }

    return 0;
}

// Dá pontos ao estudante (usado ao concluir tarefa e Pomodoro)
function ganharXP(quantidade) {
    const progresso = carregarProgresso();
    const nivelAntes = calcularNivel(progresso.xp);

    progresso.xp = progresso.xp + quantidade;
    atualizarDiasSeguidos(progresso);
    salvar("progresso", progresso);

    const nivelDepois = calcularNivel(progresso.xp);

    if (nivelDepois.nome !== nivelAntes.nome) {
        alert("Parabéns! Você subiu para o nível " + nivelDepois.nome + "!");
    }
}