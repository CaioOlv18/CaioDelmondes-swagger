// Troque a porta abaixo pela mesma que aparece no Swagger da sua API.
const API_URL = "http://localhost:5000/api/Materiais";

let materiais = [];
let modalEdicao;

// Elementos da página
const listaMateriais = document.querySelector("#listaMateriais");
const mensagens = document.querySelector("#mensagens");
const formCadastro = document.querySelector("#formCadastro");
const formEdicao = document.querySelector("#formEdicao");
const tipoCadastro = document.querySelector("#tipoCadastro");

// Mostra mensagens para o usuário
function mostrarMensagem(texto, tipo = "success") {
    mensagens.textContent = "";

    const alerta = document.createElement("div");
    alerta.className = `alert alert-${tipo} alert-dismissible fade show`;
    alerta.setAttribute("role", "alert");
    alerta.textContent = texto;

    const fechar = document.createElement("button");
    fechar.type = "button";
    fechar.className = "btn-close";
    fechar.setAttribute("data-bs-dismiss", "alert");
    fechar.setAttribute("aria-label", "Fechar");

    alerta.appendChild(fechar);
    mensagens.appendChild(alerta);
}

// Faz a requisição e verifica se a resposta deu certo
async function requisicao(url, opcoes = {}) {
    const resposta = await fetch(url, {
        ...opcoes,
        headers: {
            "Content-Type": "application/json",
            ...(opcoes.headers || {})
        }
    });

    if (!resposta.ok) {
        let detalhe = `Erro ${resposta.status}`;
        try {
            const erro = await resposta.json();
            detalhe = erro.message || erro.title || erro.detail || detalhe;
        } catch (e) {
            // Algumas respostas de erro não possuem JSON.
        }
        throw new Error(detalhe);
    }

    if (resposta.status === 204) {
        return null;
    }

    const texto = await resposta.text();
    if (!texto) return null;
    // Algumas rotas retornam JSON e a rota de empréstimo pode retornar texto.
    try { return JSON.parse(texto); }
    catch (e) { return texto; }
}

// Carrega todos os materiais da API
async function carregarMateriais() {
    listaMateriais.textContent = "Carregando materiais...";

    try {
        const dados = await requisicao(API_URL);
        materiais = Array.isArray(dados) ? dados : (dados ? [dados] : []);
        renderizarMateriais();
        atualizarResumo();
    } catch (erro) {
        listaMateriais.textContent = "Não foi possível carregar os materiais. Confira se a API está ligada e se a URL está correta.";
        mostrarMensagem("Erro ao buscar materiais: " + erro.message, "danger");
    }
}

// Aceita os nomes de propriedades mais comuns em JSON de APIs C#
function pegar(material, ...nomes) {
    for (const nome of nomes) {
        if (material[nome] !== undefined && material[nome] !== null) {
            return material[nome];
        }
    }
    return "";
}

function descobrirTipo(material) {
    const tipo = String(pegar(material, "tipo", "Tipo", "$type")).toLowerCase();
    if (tipo.includes("revista") || material.edicao !== undefined || material.Edicao !== undefined ||
        material.mesPublicacao !== undefined || material.MesPublicacao !== undefined) {
        return "revista";
    }
    return "livro";
}

// Cria os cards na tela
function renderizarMateriais() {
    listaMateriais.textContent = "";

    const pesquisa = document.querySelector("#busca").value.toLowerCase();
    const filtrados = materiais.filter(material =>
        String(pegar(material, "titulo", "Titulo", "title", "Title")).toLowerCase().includes(pesquisa)
    );

    if (filtrados.length === 0) {
        const aviso = document.createElement("p");
        aviso.className = "text-center text-secondary py-4";
        aviso.textContent = materiais.length === 0
            ? "Ainda não existem materiais cadastrados."
            : "Nenhum material encontrado nessa pesquisa.";
        listaMateriais.appendChild(aviso);
        return;
    }

    filtrados.forEach(material => {
        const id = pegar(material, "id", "Id");
        const titulo = pegar(material, "titulo", "Titulo", "title", "Title") || "Sem título";
        const ano = pegar(material, "anoPublicacao", "AnoPublicacao", "ano", "Ano");
        const tipo = descobrirTipo(material);

        const coluna = document.createElement("div");
        coluna.className = "col-12 col-md-6 col-xl-4";

        const card = document.createElement("div");
        card.className = "card material-card shadow-sm";

        const corpo = document.createElement("div");
        corpo.className = "card-body";

        const cabecalho = document.createElement("div");
        cabecalho.className = "d-flex justify-content-between gap-2 align-items-start";

        const nome = document.createElement("h3");
        nome.className = "h5";
        nome.textContent = titulo;

        const etiqueta = document.createElement("span");
        etiqueta.className = "badge " + (tipo === "livro" ? "text-bg-primary" : "text-bg-info");
        etiqueta.textContent = tipo === "livro" ? "Livro" : "Revista";

        cabecalho.append(nome, etiqueta);

        const informacoes = document.createElement("p");
        informacoes.className = "text-secondary small mt-2 mb-3";
        informacoes.textContent = `ID: ${id} | Ano: ${ano}`;

        const detalhe = document.createElement("p");
        detalhe.className = "mb-3";
        if (tipo === "livro") {
            detalhe.textContent = `Autor: ${pegar(material, "autor", "Autor") || "Não informado"} | Páginas: ${pegar(material, "paginas", "Paginas") || "Não informado"}`;
        } else {
            detalhe.textContent = `Edição: ${pegar(material, "edicao", "Edicao") || "Não informado"} | Mês: ${pegar(material, "mesPublicacao", "MesPublicacao") || "Não informado"}`;
        }

        const acoes = document.createElement("div");
        acoes.className = "acoes";

        const botaoDescricao = criarBotao("Descrição", "btn-outline-secondary", () => consultarDescricao(id));
        const botaoEmprestimo = criarBotao("Emprestar", "btn-outline-success", () => emprestarMaterial(id));
        const botaoEditar = criarBotao("Editar", "btn-outline-primary", () => abrirEdicao(material));
        const botaoExcluir = criarBotao("Excluir", "btn-outline-danger", () => excluirMaterial(id));

        acoes.append(botaoDescricao, botaoEmprestimo, botaoEditar, botaoExcluir);
        corpo.append(cabecalho, informacoes, detalhe, acoes);
        card.appendChild(corpo);
        coluna.appendChild(card);
        listaMateriais.appendChild(coluna);
    });
}

function criarBotao(texto, classe, acao) {
    const botao = document.createElement("button");
    botao.type = "button";
    botao.className = `btn btn-sm ${classe}`;
    botao.textContent = texto;
    botao.addEventListener("click", acao);
    return botao;
}

function atualizarResumo() {
    const livros = materiais.filter(item => descobrirTipo(item) === "livro").length;
    document.querySelector("#totalMateriais").textContent = materiais.length;
    document.querySelector("#totalLivros").textContent = livros;
    document.querySelector("#totalRevistas").textContent = materiais.length - livros;
}

// Mostra os campos correspondentes ao tipo escolhido
function atualizarCamposCadastro() {
    const ehLivro = tipoCadastro.value === "livro";

    document.querySelectorAll(".campo-livro").forEach(campo => campo.classList.toggle("d-none", !ehLivro));
    document.querySelectorAll(".campo-revista").forEach(campo => campo.classList.toggle("d-none", ehLivro));

    document.querySelector("#autorCadastro").required = ehLivro;
    document.querySelector("#paginasCadastro").required = ehLivro;
    document.querySelector("#edicaoCadastro").required = !ehLivro;
    document.querySelector("#mesCadastro").required = !ehLivro;
}

// Cadastra livro ou revista
async function cadastrarMaterial(evento) {
    evento.preventDefault();

    const tipo = tipoCadastro.value;
    const titulo = document.querySelector("#tituloCadastro").value.trim();
    const ano = Number(document.querySelector("#anoCadastro").value);

    if (!titulo || !Number.isInteger(ano) || ano < 1 || ano > 2100) {
        mostrarMensagem("Preencha o título e informe um ano válido.", "warning");
        return;
    }

    let dados;
    let endpoint;

    if (tipo === "livro") {
        const autor = document.querySelector("#autorCadastro").value.trim();
        const paginas = Number(document.querySelector("#paginasCadastro").value);

        if (!autor || !Number.isInteger(paginas) || paginas < 1) {
            mostrarMensagem("Informe o autor e um número de páginas válido.", "warning");
            return;
        }

        dados = { titulo: titulo, anoPublicacao: ano, autor: autor, paginas: paginas };
        endpoint = `${API_URL}/livro`;
    } else {
        const edicao = Number(document.querySelector("#edicaoCadastro").value);
        const mes = Number(document.querySelector("#mesCadastro").value);

        if (!Number.isInteger(edicao) || edicao < 1 || !Number.isInteger(mes) || mes < 1 || mes > 12) {
            mostrarMensagem("Informe a edição e um mês entre 1 e 12.", "warning");
            return;
        }

        dados = { titulo: titulo, anoPublicacao: ano, edicao: edicao, mesPublicacao: mes };
        endpoint = `${API_URL}/revista`;
    }

    try {
        await requisicao(endpoint, { method: "POST", body: JSON.stringify(dados) });
        formCadastro.reset();
        atualizarCamposCadastro();
        mostrarMensagem("Material cadastrado com sucesso!");
        await carregarMateriais();
    } catch (erro) {
        mostrarMensagem("Não foi possível cadastrar: " + erro.message, "danger");
    }
}

// Consulta um material específico pelo ID
async function consultarPorId() {
    const id = document.querySelector("#consultaId").value;
    const resultado = document.querySelector("#resultadoId");

    if (!id || Number(id) < 1) {
        mostrarMensagem("Digite um ID válido para consultar.", "warning");
        return;
    }

    resultado.textContent = "Consultando...";
    try {
        const material = await requisicao(`${API_URL}/${id}`);
        resultado.textContent = "";
        const caixa = document.createElement("div");
        caixa.className = "alert alert-info";
        caixa.textContent = `Material encontrado: ${pegar(material, "titulo", "Titulo", "title", "Title") || "Sem título"} (ID: ${pegar(material, "id", "Id") || id})`;
        resultado.appendChild(caixa);
    } catch (erro) {
        resultado.textContent = "";
        mostrarMensagem("Não foi possível consultar esse material: " + erro.message, "danger");
    }
}

// Consulta a descrição e o prazo de empréstimo
async function consultarDescricao(id) {
    try {
        const dados = await requisicao(`${API_URL}/${id}/descricao`);
        const tipo = pegar(dados, "tipo", "Tipo") || "Não informado";
        const descricao = pegar(dados, "descricao", "Descricao") || "Não informada";
        const prazo = pegar(dados, "prazoEmprestimo", "PrazoEmprestimo", "prazo", "Prazo");
        mostrarMensagem(`Tipo: ${tipo}. Descrição: ${descricao}. Prazo de empréstimo: ${prazo || "Não informado"} dias.`, "info");
    } catch (erro) {
        mostrarMensagem("Erro ao consultar descrição: " + erro.message, "danger");
    }
}

// Tenta realizar o empréstimo
async function emprestarMaterial(id) {
    if (!confirm("Deseja tentar realizar o empréstimo deste material?")) {
        return;
    }

    try {
        const resposta = await requisicao(`${API_URL}/${id}/emprestar`, { method: "POST" });
        const mensagem = typeof resposta === "string" ? resposta : pegar(resposta || {}, "mensagem", "Mensagem", "message", "Message");
        mostrarMensagem(mensagem || "Solicitação de empréstimo realizada.", "success");
    } catch (erro) {
        mostrarMensagem("Não foi possível realizar o empréstimo: " + erro.message, "danger");
    }
}

// Preenche o modal com os dados atuais
function abrirEdicao(material) {
    const tipo = descobrirTipo(material);
    document.querySelector("#idEdicao").value = pegar(material, "id", "Id");
    document.querySelector("#tipoEdicao").value = tipo;
    document.querySelector("#tituloEdicao").value = pegar(material, "titulo", "Titulo", "title", "Title");
    document.querySelector("#anoEdicao").value = pegar(material, "anoPublicacao", "AnoPublicacao", "ano", "Ano");

    document.querySelector("#camposEdicaoLivro").classList.toggle("d-none", tipo !== "livro");
    document.querySelector("#camposEdicaoRevista").classList.toggle("d-none", tipo !== "revista");

    document.querySelector("#autorEdicao").value = pegar(material, "autor", "Autor");
    document.querySelector("#paginasEdicao").value = pegar(material, "paginas", "Paginas");
    document.querySelector("#edicaoEdicao").value = pegar(material, "edicao", "Edicao");
    document.querySelector("#mesEdicao").value = pegar(material, "mesPublicacao", "MesPublicacao");

    modalEdicao.show();
}

// Salva as alterações usando PUT
async function salvarEdicao(evento) {
    evento.preventDefault();

    const id = document.querySelector("#idEdicao").value;
    const tipo = document.querySelector("#tipoEdicao").value;
    const titulo = document.querySelector("#tituloEdicao").value.trim();
    const ano = Number(document.querySelector("#anoEdicao").value);

    if (!titulo || !Number.isInteger(ano) || ano < 1 || ano > 2100) {
        mostrarMensagem("Confira o título e o ano de publicação.", "warning");
        return;
    }

    let dados;
    let endpoint;

    if (tipo === "livro") {
        const autor = document.querySelector("#autorEdicao").value.trim();
        const paginas = Number(document.querySelector("#paginasEdicao").value);
        if (!autor || !Number.isInteger(paginas) || paginas < 1) {
            mostrarMensagem("Confira o autor e o número de páginas.", "warning");
            return;
        }
        dados = { titulo: titulo, anoPublicacao: ano, autor: autor, paginas: paginas };
        endpoint = `${API_URL}/livro/${id}`;
    } else {
        const edicao = Number(document.querySelector("#edicaoEdicao").value);
        const mes = Number(document.querySelector("#mesEdicao").value);
        if (!Number.isInteger(edicao) || edicao < 1 || !Number.isInteger(mes) || mes < 1 || mes > 12) {
            mostrarMensagem("Confira a edição e informe um mês entre 1 e 12.", "warning");
            return;
        }
        dados = { titulo: titulo, anoPublicacao: ano, edicao: edicao, mesPublicacao: mes };
        endpoint = `${API_URL}/revista/${id}`;
    }

    try {
        await requisicao(endpoint, { method: "PUT", body: JSON.stringify(dados) });
        modalEdicao.hide();
        mostrarMensagem("Material atualizado com sucesso!");
        await carregarMateriais();
    } catch (erro) {
        mostrarMensagem("Não foi possível atualizar: " + erro.message, "danger");
    }
}

// Exclui um material depois da confirmação
async function excluirMaterial(id) {
    if (!confirm("Tem certeza que deseja excluir este material?")) {
        return;
    }

    try {
        await requisicao(`${API_URL}/${id}`, { method: "DELETE" });
        mostrarMensagem("Material excluído com sucesso!");
        await carregarMateriais();
    } catch (erro) {
        mostrarMensagem("Não foi possível excluir: " + erro.message, "danger");
    }
}

// Eventos
tipoCadastro.addEventListener("change", atualizarCamposCadastro);
formCadastro.addEventListener("submit", cadastrarMaterial);
formEdicao.addEventListener("submit", salvarEdicao);
document.querySelector("#btnAtualizar").addEventListener("click", carregarMateriais);
document.querySelector("#btnConsultarId").addEventListener("click", consultarPorId);
document.querySelector("#busca").addEventListener("input", renderizarMateriais);

// Inicia a tela
document.addEventListener("DOMContentLoaded", () => {
    modalEdicao = new bootstrap.Modal(document.querySelector("#modalEdicao"));
    atualizarCamposCadastro();
    carregarMateriais();
});
