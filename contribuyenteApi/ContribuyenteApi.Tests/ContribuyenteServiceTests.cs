using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;
using ContribuyenteApi.Application.Services;
using ContribuyenteApi.Domain.Interfaces;
using ContribuyenteApi.Domain.Entities;

public class ContribuyenteServiceTests
{
    private readonly Mock<IContribuyenteRepository> _mockRepo;
    private readonly Mock<ILogger<ContribuyenteService>> _mockLogger;
    private readonly ContribuyenteService _sut;

    public ContribuyenteServiceTests()
    {
        _mockRepo = new Mock<IContribuyenteRepository>();
        _mockLogger = new Mock<ILogger<ContribuyenteService>>();
        _sut = new ContribuyenteService(_mockRepo.Object, _mockLogger.Object);
    }

    [Fact]
    public async Task GetDetalleAsync_ReturnCalculatedItbis_Success()
    {
        // Arrange
        var contribuyente = new Contribuyente 
        { 
            RncCedula = "123", 
            Comprobantes = new List<ComprobanteFiscal>
            {
                new() { Ncf = "E1", Itbis18 = 100 },
                new() { Ncf = "E2", Itbis18 = 50 }
            }
        };

        _mockRepo.Setup(r => r.GetWithComprobantesAsync("123", It.IsAny<CancellationToken>()))
                 .ReturnsAsync(contribuyente);

        // Act
        var result = await _sut.GetDetalleAsync("123");

        // Assert
        Assert.True(result.IsSuccess);
        Assert.Equal(150, result.Value!.TotalItbis);
        Assert.Equal(2, result.Value.Comprobantes.Count);
    }
}