using CaioDelmondes.Models;

namespace CaioDelmondes.Repositories;

public class MaterialRepository : IMaterialRepository
{
    // O Dictionary guarda livros e revistas usando a classe-base.
    private readonly Dictionary<int, MaterialBiblioteca> _materiais = new();
    private int _proximoId = 1;

    public MaterialRepository()
    {
        // Alguns dados iniciais para facilitar os primeiros testes.
        Adicionar(new Livro
        {
            Titulo = "Clean Code",
            AnoPublicacao = 2008,
            Autor = "Robert C. Martin",
            Paginas = 464
        });

        Adicionar(new Revista
        {
            Titulo = "Tecnologia e Inovação",
            AnoPublicacao = 2026,
            Edicao = 15,
            MesPublicacao = 11
        });
    }

    private int GerarNovoId()
    {
        // O contador evita repetir um ID mesmo depois de excluir um cadastro.
        return _proximoId++;
    }

    public IEnumerable<MaterialBiblioteca> ObterTodos()
    {
        return _materiais.Values;
    }

    public MaterialBiblioteca? ObterPorId(int id)
    {
        _materiais.TryGetValue(id, out MaterialBiblioteca? material);
        return material;
    }

    public MaterialBiblioteca Adicionar(MaterialBiblioteca material)
    {
        material.Id = GerarNovoId();
        _materiais.Add(material.Id, material);
        return material;
    }

    public bool Atualizar(int id, MaterialBiblioteca material)
    {
        if (!_materiais.ContainsKey(id))
        {
            return false;
        }

        material.Id = id;
        _materiais[id] = material;
        return true;
    }

    public bool Remover(int id)
    {
        return _materiais.Remove(id);
    }
}
