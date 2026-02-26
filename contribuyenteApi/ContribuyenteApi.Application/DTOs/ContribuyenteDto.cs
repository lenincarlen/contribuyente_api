using System.Collections.Generic;

namespace ContribuyenteApi.Application.DTOs;

public record ContribuyenteDto(string RncCedula, string Nombre, string Tipo, string Estatus);
public record ComprobanteFiscalDto(string Ncf, decimal Monto, decimal Itbis18);
public record ContribuyenteDetalleDto(string RncCedula, IReadOnlyList<ComprobanteFiscalDto> Comprobantes, decimal TotalItbis);