using ContribuyenteApi.Domain.Interfaces;
using ContribuyenteApi.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace ContribuyenteApi.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructureServices(this IServiceCollection services, IConfiguration configuration)
    {
        // Config base datos (In-Memory)
        services.AddDbContext<AppDbContext>(opts => 
            opts.UseInMemoryDatabase("DgiiDb"));

        // Inyección de dependencias de Repositorios
        services.AddScoped<IContribuyenteRepository, ContribuyenteRepository>();

        return services;
    }
}
