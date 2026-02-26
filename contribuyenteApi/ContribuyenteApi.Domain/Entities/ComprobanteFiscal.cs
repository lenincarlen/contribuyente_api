namespace ContribuyenteApi.Domain.Entities;

public class ComprobanteFiscal 
{
    public string Ncf { get; set; } = string.Empty;
    public string RncCedula { get; set; } = string.Empty;
    public decimal Monto { get; set; }
    public decimal Itbis18 { get; set; }

    // Relacion
    public Contribuyente? Contribuyente { get; set; }
}