using Microsoft.EntityFrameworkCore;
using ContribuyenteApi.Infrastructure.Data;
using ContribuyenteApi.Domain.Interfaces;
using ContribuyenteApi.Application.Services;

var builder = WebApplication.CreateBuilder(args);

// Logger global 
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