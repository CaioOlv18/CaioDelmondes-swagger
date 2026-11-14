namespace CaioDelmondes.Models;

public abstract class MaterialBiblioteca
{
    public int Id { get; set; }
    public string Titulo { get; set; } = string.Empty;
    public int AnoPublicacao { get; set; }

    // Cada tipo de material define seu próprio prazo.
    public abstract int CalcularPrazo();

    // Descrição padrão, que pode ser alterada nas classes filhas.
    public virtual string Descricao()
    {
        return $"Material: {Titulo}";
    }
}
