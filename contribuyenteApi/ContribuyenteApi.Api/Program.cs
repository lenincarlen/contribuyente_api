using ContribuyenteApi.Infrastructure;
using ContribuyenteApi.Application;
using ContribuyenteApi.Application.Interfaces;
using ContribuyenteApi.Infrastructure.Data;

var builder = WebApplication.CreateBuilder(args);

// Logger global 
builder.Logging.ClearProviders();
builder.Logging.AddConsole();

// Registro de servicios por capas (DI Modular)
builder.Services.AddInfrastructureServices(builder.Configuration);
builder.Services.AddApplicationServices();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:3000") // Puerto específico asignado al Frontend
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// --- Seed Data (Datos de prueba en memoria) ---
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    context.Database.EnsureCreated();
    
    if (!context.Contribuyentes.Any())
    {
        var c1 = new ContribuyenteApi.Domain.Entities.Contribuyente { RncCedula = "98754321012", Nombre = "JUAN PEREZ", Tipo = "PERSONA FISICA", Estatus = "activo" };
        var c2 = new ContribuyenteApi.Domain.Entities.Contribuyente { RncCedula = "123456789", Nombre = "FARMACIA TU SALUD", Tipo = "PERSONA JURIDICA", Estatus = "inactivo" };
        
        context.Contribuyentes.AddRange(c1, c2);
        
        context.ComprobantesFiscales.AddRange(
            new ContribuyenteApi.Domain.Entities.ComprobanteFiscal { Ncf = "E310000000001", RncCedula = "98754321012", Monto = 200.00m, Itbis18 = 36.00m },
            new ContribuyenteApi.Domain.Entities.ComprobanteFiscal { Ncf = "E310000000002", RncCedula = "98754321012", Monto = 1000.00m, Itbis18 = 180.00m }
        );
        
        context.SaveChanges();
    }
}

app.UseCors("AllowFrontend");

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