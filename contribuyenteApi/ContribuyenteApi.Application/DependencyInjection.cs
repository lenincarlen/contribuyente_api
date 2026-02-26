using ContribuyenteApi.Application.Interfaces;
using ContribuyenteApi.Application.Services;
using Microsoft.Extensions.DependencyInjection;

namespace ContribuyenteApi.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services)
    {
        services.AddScoped<IContribuyenteService, ContribuyenteService>();
        return services;
    }
}
