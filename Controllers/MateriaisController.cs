using CaioDelmondes.Models;
using CaioDelmondes.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace CaioDelmondes.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MateriaisController : ControllerBase
{
    private readonly IMaterialRepository _repository;

    public MateriaisController(IMaterialRepository repository)
    {
        _repository = repository;
    }

    [HttpGet]
    public ActionResult<IEnumerable<MaterialBiblioteca>> ObterTodos()
    {
        return Ok(_repository.ObterTodos());
    }

    [HttpGet("{id}")]
    public ActionResult<MaterialBiblioteca> ObterPorId(int id)
    {
        var material = _repository.ObterPorId(id);

        if (material == null)
        {
            return NotFound("Material não encontrado.");
        }

        return Ok(material);
    }

    [HttpPost("livro")]
    public ActionResult<Livro> CadastrarLivro([FromBody] Livro livro)
    {
        if (string.IsNullOrWhiteSpace(livro.Titulo))
            return BadRequest("O título é obrigatório.");

        if (livro.AnoPublicacao < 0)
            return BadRequest("O ano de publicação não pode ser menor que zero.");

        if (string.IsNullOrWhiteSpace(livro.Autor))
            return BadRequest("O autor é obrigatório.");

        if (livro.Paginas <= 0)
            return BadRequest("O número de páginas deve ser maior que zero.");

        var novoLivro = (Livro)_repository.Adicionar(livro);
        return CreatedAtAction(nameof(ObterPorId), new { id = novoLivro.Id }, novoLivro);
    }

    [HttpPost("revista")]
    public ActionResult<Revista> CadastrarRevista([FromBody] Revista revista)
    {
        if (string.IsNullOrWhiteSpace(revista.Titulo))
            return BadRequest("O título é obrigatório.");

        if (revista.AnoPublicacao < 0)
            return BadRequest("O ano de publicação não pode ser menor que zero.");

        if (revista.Edicao <= 0)
            return BadRequest("A edição deve ser maior que zero.");

        if (revista.MesPublicacao < 1 || revista.MesPublicacao > 12)
            return BadRequest("O mês de publicação deve estar entre 1 e 12.");

        var novaRevista = (Revista)_repository.Adicionar(revista);
        return CreatedAtAction(nameof(ObterPorId), new { id = novaRevista.Id }, novaRevista);
    }

    [HttpPut("livro/{id}")]
    public IActionResult AtualizarLivro(int id, [FromBody] Livro livro)
    {
        if (string.IsNullOrWhiteSpace(livro.Titulo))
            return BadRequest("O título é obrigatório.");

        if (livro.AnoPublicacao < 0)
            return BadRequest("O ano de publicação não pode ser menor que zero.");

        if (string.IsNullOrWhiteSpace(livro.Autor))
            return BadRequest("O autor é obrigatório.");

        if (livro.Paginas <= 0)
            return BadRequest("O número de páginas deve ser maior que zero.");

        var materialAtual = _repository.ObterPorId(id);
        if (materialAtual == null || materialAtual is not Livro)
            return NotFound("Livro não encontrado.");

        livro.Id = id;
        _repository.Atualizar(id, livro);
        return Ok(livro);
    }

    [HttpPut("revista/{id}")]
    public IActionResult AtualizarRevista(int id, [FromBody] Revista revista)
    {
        if (string.IsNullOrWhiteSpace(revista.Titulo))
            return BadRequest("O título é obrigatório.");

        if (revista.AnoPublicacao < 0)
            return BadRequest("O ano de publicação não pode ser menor que zero.");

        if (revista.Edicao <= 0)
            return BadRequest("A edição deve ser maior que zero.");

        if (revista.MesPublicacao < 1 || revista.MesPublicacao > 12)
            return BadRequest("O mês de publicação deve estar entre 1 e 12.");

        var materialAtual = _repository.ObterPorId(id);
        if (materialAtual == null || materialAtual is not Revista)
            return NotFound("Revista não encontrada.");

        revista.Id = id;
        _repository.Atualizar(id, revista);
        return Ok(revista);
    }

    [HttpDelete("{id}")]
    public IActionResult Remover(int id)
    {
        if (!_repository.Remover(id))
            return NotFound("Material não encontrado.");

        return NoContent();
    }

    [HttpGet("{id}/descricao")]
    public IActionResult ObterDescricao(int id)
    {
        var material = _repository.ObterPorId(id);

        if (material == null)
            return NotFound("Material não encontrado.");

        // A mesma chamada funciona para Livro e Revista (polimorfismo).
        string tipo = material is Livro ? "Livro" : "Revista";

        return Ok(new
        {
            material.Id,
            Tipo = tipo,
            Descricao = material.Descricao(),
            PrazoEmprestimo = material.CalcularPrazo()
        });
    }

    [HttpPost("{id}/emprestar")]
    public IActionResult Emprestar(int id)
    {
        var material = _repository.ObterPorId(id);

        if (material == null)
            return NotFound("Material não encontrado.");

        if (material is not IEmprestimo emprestimo)
            return BadRequest("Este material não possui a opção de empréstimo.");

        return Ok(emprestimo.Emprestar());
    }
}
