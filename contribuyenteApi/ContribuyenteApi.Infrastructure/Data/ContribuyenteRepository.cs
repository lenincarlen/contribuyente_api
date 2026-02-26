using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ContribuyenteApi.Domain.Entities;
using ContribuyenteApi.Domain.Interfaces;

namespace ContribuyenteApi.Infrastructure.Data;

public class ContribuyenteRepository : IContribuyenteRepository
{
    private readonly AppDbContext _context;

    public ContribuyenteRepository(AppDbContext context) => _context = context;

    public async Task<IReadOnlyList<Contribuyente>> GetAllAsync(CancellationToken ct = default)
    {
        return await _context.Contribuyentes.AsNoTracking().ToListAsync(ct);
    }

    public async Task<Contribuyente?> GetWithComprobantesAsync(string rncCedula, CancellationToken ct = default)
    {
        return await _context.Contribuyentes
            .AsNoTracking()  // para lecturas optimizadas
            .Include(c => c.Comprobantes)
            .FirstOrDefaultAsync(c => c.RncCedula == rncCedula, ct);
    }
}