using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using ContribuyenteApi.Application.Common;
using ContribuyenteApi.Application.DTOs;
using ContribuyenteApi.Application.Interfaces;
using ContribuyenteApi.Domain.Interfaces;
using Microsoft.Extensions.Logging;

namespace ContribuyenteApi.Application.Services;

public class ContribuyenteService : IContribuyenteService
{
    private readonly IContribuyenteRepository _repository;
    private readonly ILogger<ContribuyenteService> _logger;

    public ContribuyenteService(IContribuyenteRepository repository, ILogger<ContribuyenteService> logger)
    {
        _repository = repository;
        _logger = logger;
    }

    public async Task<Result<IReadOnlyList<ContribuyenteDto>>> GetAllAsync(CancellationToken ct = default)
    {
        try 
        {
            var data = await _repository.GetAllAsync(ct);
            var dtos = data.Select(c => new ContribuyenteDto(c.RncCedula, c.Nombre, c.Tipo, c.Estatus)).ToList();
            return Result<IReadOnlyList<ContribuyenteDto>>.Success(dtos);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error obteniendo contribuyentes.");
            return Result<IReadOnlyList<ContribuyenteDto>>.Failure("INTERNAL_ERROR");
        }
    }

    public async Task<Result<ContribuyenteDetalleDto>> GetDetalleAsync(string rncCedula, CancellationToken ct = default)
    {
        var data = await _repository.GetWithComprobantesAsync(rncCedula, ct);
        if (data is null) return Result<ContribuyenteDetalleDto>.Failure("NOT_FOUND");

        var comprobantes = data.Comprobantes
            .Select(c => new ComprobanteFiscalDto(c.Ncf, c.Monto, c.Itbis18)).ToList();
        
        var totalItbis = comprobantes.Sum(c => c.Itbis18);
        return Result<ContribuyenteDetalleDto>.Success(new ContribuyenteDetalleDto(data.RncCedula, comprobantes, totalItbis));
    }
}
