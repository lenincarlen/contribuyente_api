# Guía de Implementación: Prueba Técnica DGII

## Arquitectura y Estrategia

Basado en `dotnet-backend-patterns` y principios SOLID. Se aplicará **Clean Architecture** para garantizar separación de responsabilidades, mantenibilidad y testabilidad.

| Capa | Responsabilidad | Patrones / Herramientas |
|---|---|---|
| **Domain** | Lógica de negocio core, entidades. | POCOs, sin dependencias externas. |
| **Application** | Casos de uso, DTOs, validaciones. | Result Pattern, FluentValidation. |
| **Infrastructure** | Acceso a datos, configuración externa. | EF Core (SQL), Repositories, IOptions. |
| **Api** | Puntos de entrada HTTP, Inyección de Dependencias. | Minimal APIs, Global Exception Handling. |
| **Frontend** | Interfaz de usuario dinámica. | React (Vite), TypeScript, Tailwind CSS. |

---

## Paso 1: Inicialización del Proyecto y Solución

Crear solución y estructurar las capas del backend.

```bash
# Crear solución
dotnet new sln -n ContribuyenteApi

# Crear proyectos backend
dotnet new classlib -n ContribuyenteApi.Domain
dotnet new classlib -n ContribuyenteApi.Application
dotnet new classlib -n ContribuyenteApi.Infrastructure
dotnet new webapi -n ContribuyenteApi.Api
dotnet new xunit -n ContribuyenteApi.Tests

# Agregar a la solución
dotnet sln add ContribuyenteApi.Domain ContribuyenteApi.Application ContribuyenteApi.Infrastructure ContribuyenteApi.Api ContribuyenteApi.Tests

# Configurar referencias (Dependencias de Clean Architecture)
dotnet add ContribuyenteApi.Application reference ContribuyenteApi.Domain
dotnet add ContribuyenteApi.Infrastructure reference ContribuyenteApi.Application
dotnet add ContribuyenteApi.Api reference ContribuyenteApi.Infrastructure ContribuyenteApi.Application
dotnet add ContribuyenteApi.Tests reference ContribuyenteApi.Api ContribuyenteApi.Application ContribuyenteApi.Domain ContribuyenteApi.Infrastructure
```

### ¿Por qué?
Garantiza la Regla de Dependencia de Clean Architecture. `Api` e `Infrastructure` dependen de `Application`, y `Application` de `Domain`. 

---

## Paso 2: Capa Domain (Entidades e Interfaces)

Define la lógica pura. No debe depender del exterior.

### 2.1. Crear estructura de carpetas
Ejecutar desde terminal estando en la raíz:
```bash
mkdir -p ContribuyenteApi.Domain/Entities
mkdir -p ContribuyenteApi.Domain/Interfaces
```

### 2.2. Entidad: Contribuyente
Crea el archivo `Contribuyente.cs` en la carpeta `Entities`.

`ContribuyenteApi.Domain/Entities/Contribuyente.cs`
```csharp
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
```

### 2.3. Entidad: ComprobanteFiscal
Crea el archivo `ComprobanteFiscal.cs` en la carpeta `Entities`.

`ContribuyenteApi.Domain/Entities/ComprobanteFiscal.cs`
```csharp
namespace ContribuyenteApi.Domain.Entities;

public class ComprobanteFiscal
{
    public string Ncf { get; set; } = string.Empty;
    public string RncCedula { get; set; } = string.Empty;
    public decimal Monto { get; set; }
    public decimal Itbis18 { get; set; }
    
    // Relación N a 1
    public Contribuyente? Contribuyente { get; set; }
}
```

### 2.4. Interfaz: IContribuyenteRepository
Crea el archivo `IContribuyenteRepository.cs` en la carpeta `Interfaces`. Esto permite Inversión de Dependencias (SOLID).

`ContribuyenteApi.Domain/Interfaces/IContribuyenteRepository.cs`
```csharp
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace ContribuyenteApi.Domain.Interfaces;

public interface IContribuyenteRepository
{
    Task<IReadOnlyList<Contribuyente>> GetAllAsync(CancellationToken ct = default);
    Task<Contribuyente?> GetWithComprobantesAsync(string rncCedula, CancellationToken ct = default);
}
```

---

## Paso 3: Capa Application (Casos de Uso y Patrón Result)

Implementar el **Result Pattern** recomendado en `dotnet-backend-patterns` para evitar excepciones en el flujo de control.

`ContribuyenteApi.Application/Common/Result.cs`
```csharp
public class Result<T>
{
    public bool IsSuccess { get; }
    public T? Value { get; }
    public string? Error { get; }

    private Result(bool isSuccess, T? value, string? error)
    {
        IsSuccess = isSuccess;
        Value = value;
        Error = error;
    }

    public static Result<T> Success(T value) => new(true, value, null);
    public static Result<T> Failure(string error) => new(false, default, error);
}
```

`ContribuyenteApi.Application/DTOs/ContribuyenteDto.cs`
```csharp
public record ContribuyenteDto(string RncCedula, string Nombre, string Tipo, string Estatus);
public record ComprobanteFiscalDto(string Ncf, decimal Monto, decimal Itbis18);
public record ContribuyenteDetalleDto(string RncCedula, IReadOnlyList<ComprobanteFiscalDto> Comprobantes, decimal TotalItbis);
```

`ContribuyenteApi.Application/Services/ContribuyenteService.cs`
```csharp
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
```

### ¿Por qué?
El `Result Pattern` maneja respuestas de manera funcional, reduciendo bloques `try/catch` en la capa de la API e impulsando código resiliente. Separar DTOs previene fuga de datos de infraestructura hacia el cliente HTTP.

---

## Paso 4: Capa Infrastructure (EF Core)

Instalar paquetes necesarios.
```bash
dotnet add ContribuyenteApi.Infrastructure package Microsoft.EntityFrameworkCore.SqlServer
dotnet add ContribuyenteApi.Infrastructure package Microsoft.EntityFrameworkCore.Design
```

`ContribuyenteApi.Infrastructure/Data/AppDbContext.cs`
```csharp
public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Contribuyente> Contribuyentes => Set<Contribuyente>();
    public DbSet<ComprobanteFiscal> ComprobantesFiscales => Set<ComprobanteFiscal>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Contribuyente>().HasKey(c => c.RncCedula);
        modelBuilder.Entity<ComprobanteFiscal>().HasKey(c => c.Ncf);
        
        modelBuilder.Entity<ComprobanteFiscal>()
            .HasOne(c => c.Contribuyente)
            .WithMany(c => c.Comprobantes)
            .HasForeignKey(c => c.RncCedula);
    }
}
```

`ContribuyenteApi.Infrastructure/Data/ContribuyenteRepository.cs`
```csharp
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
            .AsNoTracking()  // para lecturas optimizada
            .Include(c => c.Comprobantes)
            .FirstOrDefaultAsync(c => c.RncCedula == rncCedula, ct);
    }
}
```

### ¿Por qué?
Uso de `AsNoTracking()` para lecturas optimizadas, una de las directrices clave de performance.

---

## Paso 5: Capa API (Endpoints e Inyección)

Configurar Inyección de Dependencias centralizada.

`ContribuyenteApi.Api/Program.cs`
```csharp
var builder = WebApplication.CreateBuilder(args);

// Logger global (Serilog o similar recomendado en apps pro, aquí default provider)
builder.Logging.ClearProviders();
builder.Logging.AddConsole();

// Config base datos (In-Memory o SQL Server)
builder.Services.AddDbContext<AppDbContext>(opts => 
    opts.UseSqlServer(builder.Configuration.GetConnectionString("Default")));

// Inyección de dependencias (Scoped por request HTTP)
builder.Services.AddScoped<IContribuyenteRepository, ContribuyenteRepository>();
builder.Services.AddScoped<IContribuyenteService, ContribuyenteService>();

builder.Services.AddCors();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

app.UseCors(b => b.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());

// Manejo global de excepciones (Middleware nativo de Minimal APIs)
app.UseExceptionHandler(exceptionHandlerApp =>
{
    exceptionHandlerApp.Run(async context =>
    {
        context.Response.StatusCode = StatusCodes.Status500InternalServerError;
        await context.Response.WriteAsJsonAsync(new { Error = "Ha ocurrido un error inesperado." });
    });
});

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Endpoints
app.MapGet("/api/contribuyentes", async (IContribuyenteService service, CancellationToken ct) =>
{
    var result = await service.GetAllAsync(ct);
    return result.IsSuccess ? Results.Ok(result.Value) : Results.StatusCode(500);
});

app.MapGet("/api/contribuyentes/{rnc}/detalles", async (string rnc, IContribuyenteService service, CancellationToken ct) =>
{
    var result = await service.GetDetalleAsync(rnc, ct);
    if (!result.IsSuccess) return result.Error == "NOT_FOUND" ? Results.NotFound() : Results.StatusCode(500);
    return Results.Ok(result.Value);
});

app.Run();
```

### ¿Por qué?
Uso estricto de **Minimal APIs** + `CancellationToken` asíncrono pasivo de principio a fin, evitando bloques síncronos peligrosos e integrando la Inyección de Dependencias vía constructores de métodos.

---

## Paso 6: Tests Unitarios (xUnit + Moq)

```bash
dotnet add ContribuyenteApi.Tests package Moq
```

`ContribuyenteApi.Tests/ContribuyenteServiceTests.cs`
```csharp
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
```

---

## Paso 7: Frontend (React TypeScript)

```bash
npm create vite@latest contribuyente-frontend -- --template react-ts
cd dgii-frontend
npm install react-router-dom axios tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

Estructura básica de componentes `src/`:
- `services/api.ts`: Centralización de llamadas Axios. Tipado fuerte basado en los DTOs del backend.
- `pages/ListadoContribuyentes.tsx`: Fetch a `/api/contribuyentes`.
- `pages/DetalleContribuyente.tsx`: Fetch a `/api/contribuyentes/{rnc}/detalles`. Agrega sumatoria en UI si el backend no la envía (aunque nuestro C# manda `TotalItbis`). Muestra tabla estructurada.

*Nota:* Interfaz tipo master-detail de alto rendimiento usando `useEffect` y manejando estados `loading` / `error`.

---

## Paso 8: Dockerización (Punto Extra)

`Dockerfile` en raíz de backend:
```dockerfile
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 80

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["ContribuyenteApi.Api/ContribuyenteApi.Api.csproj", "ContribuyenteApi.Api/"]
# ... (Copiar test, domain, app, infra proj)
RUN dotnet restore "ContribuyenteApi.Api/ContribuyenteApi.Api.csproj"
COPY . .
WORKDIR "/src/ContribuyenteApi.Api"
RUN dotnet build -c Release -o /app/build

FROM build AS publish
RUN dotnet publish -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "ContribuyenteApi.Api.dll"]
```

`docker-compose.yml`:
```yaml
version: '3.8'
services:
  db:
    image: mcr.microsoft.com/mssql/server:2022-latest
    environment:
      SA_PASSWORD: "Your_password123"
      ACCEPT_EULA: "Y"
    ports:
      - "1433:1433"
  api:
    build: .
    ports:
      - "8080:80"
    depends_on:
      - db
    environment:
      ConnectionStrings__Default: "Server=db;Database=DgiiDb;User=sa;Password=Your_password123;TrustServerCertificate=True"
```

### ¿Por qué?
Aislar el ecosistema garantiza que la app levante en cualquier lugar con un solo `docker-compose up`. La variable de entorno sobreescribe el `appsettings.json` mediante la convención `__` de .NET (Options Pattern).
