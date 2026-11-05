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