// ApplicationDbContext.cs
using LawnSensei.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace LawnSensei.Server.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<OnboardingData> OnboardingData { get; set; }

        // Add DbSet properties here for future entities
    }
}