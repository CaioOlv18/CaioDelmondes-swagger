# Sistema de Gerenciamento de Biblioteca

**Aluno:** Caio Delmondes de Oliveira

## Sobre o projeto

Neste trabalho, desenvolvi uma API para organizar os materiais de uma biblioteca. Com ela, é possível cadastrar livros e revistas, consultar os materiais cadastrados, alterar informações e excluir materiais.

Durante o desenvolvimento, utilizei alguns conceitos de programação orientada a objetos que foram estudados na disciplina, como herança, classe abstrata, interface e polimorfismo.

Também utilizei o padrão Repository para organizar o acesso aos dados. Os materiais ficam armazenados em memória enquanto a aplicação está funcionando.

## Tecnologias utilizadas

- C#
- ASP.NET Core Web API
- .NET 10
- Swagger
- Dictionary para armazenar os materiais

## Como executar o projeto

1. Ter o SDK do .NET 10 instalado.
2. Abrir a pasta do projeto no Visual Studio Code.
3. Abrir o terminal.
4. Executar os comandos abaixo, um de cada vez:

```bash
dotnet restore
```

Depois:

```bash
dotnet run
```

5. Quando a API iniciar, copiar o endereço que aparecer no terminal e acrescentar `/swagger` no final para abrir a documentação.

## Rotas da API

| Método | Rota | Função |
|---|---|---|
| GET | `/api/Materiais` | Listar todos os materiais |
| GET | `/api/Materiais/{id}` | Buscar material pelo ID |
| POST | `/api/Materiais/livro` | Cadastrar um livro |
| POST | `/api/Materiais/revista` | Cadastrar uma revista |
| PUT | `/api/Materiais/livro/{id}` | Atualizar um livro |
| PUT | `/api/Materiais/revista/{id}` | Atualizar uma revista |
| DELETE | `/api/Materiais/{id}` | Excluir um material |
| GET | `/api/Materiais/{id}/descricao` | Mostrar a descrição do material |
| POST | `/api/Materiais/{id}/emprestar` | Testar o empréstimo |

## Exemplos de testes

### Cadastrar um livro

Na rota `POST /api/Materiais/livro`, utilizar este JSON:

```json
{
  "titulo": "O Programador Pragmático",
  "anoPublicacao": 1999,
  "autor": "Andrew Hunt",
  "paginas": 352
}
```

### Cadastrar uma revista

Na rota `POST /api/Materiais/revista`, utilizar:

```json
{
  "titulo": "Revista de Tecnologia",
  "anoPublicacao": 2026,
  "edicao": 20,
  "mesPublicacao": 11
}
```

### Testar as validações

Também é possível testar o que acontece quando são enviados dados incorretos.

Por exemplo:
- Cadastrar um livro com páginas igual a zero.
- Cadastrar uma revista com mês igual a 13.
- Buscar um material com um ID que não existe.

A API deve retornar os códigos de erro correspondentes.

### Testar o polimorfismo

As rotas de descrição permitem verificar que cada tipo de material possui um prazo de empréstimo diferente:

- Livro: 14 dias.
- Revista: 7 dias.

### Testar a interface

A rota de empréstimo permite verificar se o material implementa a interface `IEmprestimo`.

O livro implementa essa interface, enquanto a revista não implementa.

## Observação sobre o armazenamento

Os materiais são guardados em memória usando um `Dictionary`. Isso significa que, quando a aplicação é encerrada, os materiais cadastrados durante a execução são perdidos.

O repositório foi configurado como Singleton para manter a mesma instância durante a execução da aplicação.

## Integrantes

- Caio Delmondes de Oliveira