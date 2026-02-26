using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using ContribuyenteApi.Application.Common;
using ContribuyenteApi.Application.DTOs;

namespace ContribuyenteApi.Application.Interfaces;

public interface IContribuyenteService
{
    Task<Result<IReadOnlyList<ContribuyenteDto>>> GetAllAsync(CancellationToken ct = default);
    Task<Result<ContribuyenteDetalleDto>> GetDetalleAsync(string rncCedula, CancellationToken ct = default);
}
