
namespace ContribuyenteApi.Domain.Entities;

public class Contribuyente
{
    public string RncCedula { get; set; } = string.Empty;
    public string Nombre { get; set; } = string.Empty;
    public string Tipo { get; set; } = string.Empty;
    public string Estatus { get; set; } = string.Empty;
    
    // Relación 1 a N
    public ICollection<ComprobanteFiscal> Comprobantes { get; set; } = new List<ComprobanteFiscal>();
}