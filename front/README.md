# Front-end da Biblioteca Universitária

Este é o front-end do trabalho de Desenvolvimento Web e Mobile I. A ideia é usar uma página para consultar e gerenciar os livros e as revistas que estão cadastrados na API feita em C#.

## Arquivos

- `index.html`: estrutura da página e formulários.
- `style.css`: alguns estilos para organizar a aparência.
- `script.js`: funções JavaScript que fazem as requisições para a API.

## Como executar

1. Deixe a API da biblioteca na pasta principal do projeto.
2. Abra o projeto no Visual Studio Code.
3. No arquivo `script.js`, confira a constante `API_URL` e coloque o endereço e a porta que aparecem no Swagger da sua API.
4. Execute a API com `dotnet run` na pasta do projeto C#.
5. Abra a pasta `front` e execute o `index.html` com a extensão Live Server.

## Endpoints utilizados

- `GET /api/Materiais`
- `GET /api/Materiais/{id}`
- `POST /api/Materiais/livro`
- `POST /api/Materiais/revista`
- `PUT /api/Materiais/livro/{id}`
- `PUT /api/Materiais/revista/{id}`
- `DELETE /api/Materiais/{id}`
- `GET /api/Materiais/{id}/descricao`
- `POST /api/Materiais/{id}/emprestar`

## Antes de entregar

Confiram os nomes das propriedades dos objetos que a API recebe no Swagger. O JavaScript está enviando os campos `titulo`, `anoPublicacao`, `autor`, `paginas`, `edicao` e `mesPublicacao`. O mês da revista é informado como número de 1 a 12. Se os modelos da API usarem outros nomes ou exigirem outro formato, ajustem os objetos enviados em `script.js`.

Também confiram a resposta do endpoint de descrição e do endpoint de empréstimo, porque os nomes dos campos retornados podem variar conforme o código da API.

## Integrantes

Preencher com os nomes de todos os integrantes da equipe.

## Testes realizados

Preencher depois de testar a aplicação com a API ligada. Expliquem quais cadastros, consultas, edições, exclusões e empréstimos foram testados e se funcionaram.
