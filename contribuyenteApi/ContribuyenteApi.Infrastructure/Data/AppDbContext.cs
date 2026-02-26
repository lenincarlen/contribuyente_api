using Microsoft.EntityFrameworkCore;
using ContribuyenteApi.Domain.Entities;

namespace ContribuyenteApi.Infrastructure.Data;

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
