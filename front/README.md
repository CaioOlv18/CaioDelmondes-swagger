# Front-end da Biblioteca Universitária

## Sobre o projeto

Esse projeto foi desenvolvido para a atividade da disciplina de Desenvolvimento Web e Mobile I.

A ideia foi criar um site para facilitar o uso da nossa Biblioteca Universitária. Por meio dele, é possível visualizar os livros e revistas cadastrados, fazer consultas, adicionar novos materiais, editar informações, excluir materiais e realizar empréstimos.

O site funciona junto com uma API que foi desenvolvida em C#. O front-end é a parte que aparece para o usuário, enquanto a API fica responsável por receber as informações e realizar as operações.

## Arquivos da pasta Front

Dentro da pasta `front`, temos três arquivos principais:

### index.html

Esse arquivo é a estrutura principal do site. É nele que ficam os elementos que aparecem na tela, como os títulos, botões, formulários e campos onde o usuário coloca as informações.

Resumindo, o HTML é a base da página e organiza tudo que aparece no site.

### style.css

Esse arquivo é responsável pela aparência do site. Nele colocamos as cores, os tamanhos, os espaços entre os elementos e a organização da página.

O CSS serve para deixar o site mais bonito, organizado e fácil de usar, inclusive em telas menores.

### script.js

Esse arquivo é responsável pelas funções do site. É nele que usamos JavaScript para fazer as ações funcionarem.

Por exemplo, quando queremos cadastrar um livro, o JavaScript pega as informações preenchidas e envia para a API. A API recebe esses dados e retorna uma resposta.

Algumas das funções feitas nesse arquivo são:

- Mostrar os livros e as revistas cadastrados.
- Procurar um material pelo seu ID.
- Cadastrar novos livros.
- Cadastrar novas revistas.
- Editar as informações dos materiais.
- Excluir materiais cadastrados.
- Consultar a descrição e o prazo de um material.
- Fazer o empréstimo de um material.

Também é pelo JavaScript que aparecem as mensagens informando se uma operação deu certo ou se aconteceu algum erro.

## Como executar o projeto

Para abrir o site e conseguir utilizar suas funções, primeiro precisamos iniciar a API.

1. Abra a pasta principal do projeto no Visual Studio Code.
2. Abra o terminal na pasta onde está o arquivo `CaioDelmondes.csproj`.
3. Digite o seguinte comando:

```bash
dotnet run
```

4. Aguarde até aparecer no terminal a mensagem informando que a API foi iniciada.
5. Abra o arquivo `script.js`, que fica dentro da pasta `front`.
6. Confira se o endereço da API está correto na constante `API_URL`.

No nosso teste, utilizamos este endereço:

```javascript
const API_URL = "http://localhost:5000/api/Materiais";
```

Se a porta mudar, será necessário atualizar esse endereço.

7. Depois, abra a pasta `front` no Visual Studio Code.
8. Clique com o botão direito no arquivo `index.html` e escolha a opção **Open with Live Server**.
9. O site será aberto no navegador.

**Atenção:** para o site funcionar corretamente, é necessário deixar a API ligada no terminal enquanto estiver utilizando a página.

## Endpoints utilizados

Os endpoints são os caminhos que o front-end utiliza para conversar com a API.

No nosso projeto, utilizamos os seguintes:

| Método | Endpoint | O que faz |
|---|---|---|
| GET | `/api/Materiais` | Mostra todos os materiais cadastrados |
| GET | `/api/Materiais/{id}` | Procura um material pelo ID |
| POST | `/api/Materiais/livro` | Cadastra um livro |
| POST | `/api/Materiais/revista` | Cadastra uma revista |
| PUT | `/api/Materiais/livro/{id}` | Edita um livro |
| PUT | `/api/Materiais/revista/{id}` | Edita uma revista |
| DELETE | `/api/Materiais/{id}` | Exclui um material |
| GET | `/api/Materiais/{id}/descricao` | Mostra a descrição do material |
| POST | `/api/Materiais/{id}/emprestar` | Realiza o empréstimo |

Os métodos também têm suas funções. O GET serve para buscar informações, o POST para cadastrar ou realizar uma operação, o PUT para editar e o DELETE para excluir.

## Informações dos cadastros

No cadastro de livros, são utilizadas informações como título, ano de publicação, autor e quantidade de páginas.

No cadastro de revistas, são utilizadas informações como título, ano de publicação, edição e mês de publicação.

O mês da revista deve ser informado com um número de 1 até 12.

É importante que os nomes dos campos enviados pelo JavaScript sejam iguais aos que a API espera receber. Caso contrário, pode acontecer algum erro na hora de cadastrar ou editar um material.

## Tecnologias utilizadas

Durante o desenvolvimento do projeto, utilizamos:

- **HTML:** para criar a estrutura do site.
- **CSS:** para organizar a aparência e as cores da página.
- **JavaScript:** para fazer as funções do site e a comunicação com a API.
- **C#:** linguagem utilizada para desenvolver a API.
- **ASP.NET:** utilizado para criar e disponibilizar a API.
- **Visual Studio Code:** programa utilizado para escrever e organizar os códigos.
- **Live Server:** extensão utilizada para abrir o site no navegador.
- **Git e GitHub:** utilizados para salvar e compartilhar o projeto.

## Integrantes

Caio delmondes de oliveira

## Testes realizados

Durante o desenvolvimento, testamos a comunicação entre o front-end e a API.

Primeiro, iniciamos a API pelo terminal utilizando o comando `dotnet run`. Depois, abrimos o arquivo `index.html` pelo Live Server.

Também configuramos o endereço da API no arquivo `script.js` para que o site conseguisse buscar as informações.

As outras funcionalidades, como cadastro, edição, exclusão e empréstimo, devem ser testadas e registradas pela equipe de acordo com os resultados obtidos.

## Conclusão

Com esse trabalho, conseguimos aprender um pouco mais sobre como criar um site utilizando HTML, CSS e JavaScript e como fazer esse site se comunicar com uma API feita em C#.

Foi uma oportunidade de colocar em prática o que aprendemos durante as aulas e entender melhor como as partes de um sistema trabalham juntas.

O objetivo foi criar uma página simples, onde o usuário consiga consultar e gerenciar os livros e as revistas da biblioteca de uma forma mais fácil.