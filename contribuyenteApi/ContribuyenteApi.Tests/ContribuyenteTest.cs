using Moq;
using ContribuyenteApi.Application.Services;
using ContribuyenteApi.Domain.Interfaces;
using ContribuyenteApi.Domain.Entities;
using ContribuyenteApi.Application.DTOs;
using Microsoft.Extensions.Logging;
using ContribuyenteApi.Application.Interfaces;

namespace ContribuyenteApi.Tests;

public class ContribuyenteTest
{
    private readonly Mock<IContribuyenteRepository> _repositoryMock;
    private readonly Mock<ILogger<ContribuyenteService>> _loggerMock;
    private readonly IContribuyenteService _service;

    public ContribuyenteTest()
    {
        _repositoryMock = new Mock<IContribuyenteRepository>();
        _loggerMock = new Mock<ILogger<ContribuyenteService>>();
        _service = new ContribuyenteService(_repositoryMock.Object, _loggerMock.Object);
    }

    [Fact]
    public async Task GetAllAsync_DebeRetornarExito_CuandoExistanDatos()
    {
        // Arrange
        var contribuyentes = new List<Contribuyente>
        {
            new Contribuyente { RncCedula = "98754321012", Nombre = "JUAN PEREZ", Tipo = "PERSONA FISICA", Estatus = "activo" }
        };
        _repositoryMock.Setup(repo => repo.GetAllAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync(contribuyentes);

        // Act
        var result = await _service.GetAllAsync();

        // Assert
        Assert.True(result.IsSuccess);
        Assert.Single(result.Value);
        Assert.Equal("JUAN PEREZ", result.Value[0].Nombre);
    }

    [Fact]
    public async Task GetDetalleAsync_DebeRetornarExito_CuandoContribuyenteExiste()
    {
        // Arrange
        var rnc = "98754321012";
        var contribuyente = new Contribuyente 
        { 
            RncCedula = rnc, 
            Nombre = "JUAN PEREZ",
            Comprobantes = new List<ComprobanteFiscal>
            {
                new ComprobanteFiscal { Ncf = "E310000000001", Monto = 200m, Itbis18 = 36m }
            }
        };
        
        _repositoryMock.Setup(repo => repo.GetWithComprobantesAsync(rnc, It.IsAny<CancellationToken>()))
            .ReturnsAsync(contribuyente);

        // Act
        var result = await _service.GetDetalleAsync(rnc);

        // Assert
        Assert.True(result.IsSuccess);
        Assert.Equal(36m, result.Value.TotalItbis);
        Assert.Single(result.Value.Comprobantes);
    }

    [Fact]
    public async Task GetDetalleAsync_DebeRetornarFallo_CuandoNoExiste()
    {
        // Arrange
        var rnc = "000000000";
        _repositoryMock.Setup(repo => repo.GetWithComprobantesAsync(rnc, It.IsAny<CancellationToken>()))
            .ReturnsAsync((Contribuyente?)null);

        // Act
        var result = await _service.GetDetalleAsync(rnc);

        // Assert
        Assert.False(result.IsSuccess);
        Assert.Equal("NOT_FOUND", result.Error);
    }
}
