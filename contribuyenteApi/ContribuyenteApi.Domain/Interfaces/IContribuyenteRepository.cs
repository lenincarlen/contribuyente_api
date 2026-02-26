using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using ContribuyenteApi.Domain.Entities;

namespace ContribuyenteApi.Domain.Interfaces;

public interface IContribuyenteRepository
{
    Task<IReadOnlyList<Contribuyente>> GetAllAsync(CancellationToken ct = default);
    Task<Contribuyente?> GetWithComprobantesAsync(string rncCedula, CancellationToken ct = default);
}