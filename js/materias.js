// =============================================
// materias.js - página de Matérias
// =============================================

// Pega os elementos da página que vamos usar
const formMateria = document.getElementById("form-materia");
const tabelaMaterias = document.getElementById("tabela-materias");

// Busca as matérias salvas (ou uma lista vazia, se for a primeira vez)
let materias = carregar("materias", []);

// Mostra todas as matérias na tabela
function mostrarMaterias() {
    // Limpa a tabela antes de desenhar de novo
    tabelaMaterias.innerHTML = "";

    // Se não tiver nenhuma matéria, mostra uma mensagem e para por aqui
    if (materias.length === 0) {
        tabelaMaterias.innerHTML = '<tr><td colspan="5">Nenhuma matéria cadastrada ainda.</td></tr>';
        return;
    }

    // Para cada matéria da lista, cria uma linha na tabela
    for (const materia of materias) {
        const linha = document.createElement("tr");

        linha.innerHTML = `
            <td>${materia.nome}</td>
            <td>${materia.professor}</td>
            <td>${materia.dia}</td>
            <td>${materia.horario}</td>
            <td><button class="btn-excluir" onclick="excluirMateria(${materia.id})">Excluir</button></td>
        `;

        tabelaMaterias.appendChild(linha);
    }
}

// Quando o formulário for enviado (botão Adicionar)
formMateria.addEventListener("submit", function (evento) {
    // Impede a página de recarregar
    evento.preventDefault();

    // Monta a matéria com o que foi digitado
    const novaMateria = {
        id: gerarId(),
        nome: document.getElementById("materia-nome").value,
        professor: document.getElementById("materia-professor").value,
        dia: document.getElementById("materia-dia").value,
        horario: document.getElementById("materia-horario").value
    };

    // Coloca na lista, salva e atualiza a tabela
    materias.push(novaMateria);
    salvar("materias", materias);
    mostrarMaterias();

    // Limpa o formulário
    formMateria.reset();
});

// Exclui a matéria que tem esse id
function excluirMateria(id) {
    const confirmou = confirm("Excluir esta matéria?");

    if (!confirmou) {
        return;
    }

    // Fica só com as matérias que têm o id DIFERENTE do que foi excluído
    materias = materias.filter(function (materia) {
        return materia.id !== id;
    });

    salvar("materias", materias);
    mostrarMaterias();
}

// Quando a página abre, mostra as matérias que já estavam salvas
mostrarMaterias();