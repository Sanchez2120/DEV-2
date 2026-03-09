using Asisya.Domain.Entities;
using Asisya.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Asisya.Infrastructure.Data;

public static class DbSeeder
{
    public static async Task SeedAsync(AppDbContext db)
    {
        // Apply any pending migrations automatically or ensure creation for in-memory
        if (db.Database.IsRelational())
        {
            await db.Database.MigrateAsync();
        }
        else
        {
            await db.Database.EnsureCreatedAsync();
        }

        // --- Seed admin user ---
        if (!await db.Users.AnyAsync())
        {
            db.Users.Add(new User
            {
                Name = "Administrador",
                Email = "admin@asisya.com",
                // Password: Admin123!
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin123!")
            });
            await db.SaveChangesAsync();
        }

        // --- Seed categories ---
        if (!await db.Categories.AnyAsync())
        {
            db.Categories.AddRange(
                new Category { Name = "SERVIDORES", Description = "Servidores físicos y blade para centros de datos" },
                new Category { Name = "CLOUD", Description = "Servicios y soluciones de computación en la nube" },
                new Category { Name = "NETWORKING", Description = "Equipos de red, switches y routers" },
                new Category { Name = "ALMACENAMIENTO", Description = "Discos, NAS y soluciones de almacenamiento" }
            );
            await db.SaveChangesAsync();
        }

        // --- Seed sample products ---
        if (!await db.Products.AnyAsync())
        {
            var categories = await db.Categories.ToListAsync();
            var servidores = categories.First(c => c.Name == "SERVIDORES").Id;
            var cloud = categories.First(c => c.Name == "CLOUD").Id;
            var networking = categories.First(c => c.Name == "NETWORKING").Id;
            var storage = categories.First(c => c.Name == "ALMACENAMIENTO").Id;

            db.Products.AddRange(
                new Product { Name = "Dell PowerEdge R740", Description = "Servidor rack 2U de doble socket", Price = 4599.99m, Stock = 10, CategoryId = servidores },
                new Product { Name = "HPE ProLiant DL380 Gen10", Description = "Servidor montable en rack de alto rendimiento", Price = 5200.00m, Stock = 7, CategoryId = servidores },
                new Product { Name = "AWS EC2 t3.large (1 mes)", Description = "Instancia cloud de propósito general", Price = 60.50m, Stock = 999, CategoryId = cloud },
                new Product { Name = "Azure Virtual Machine B2s", Description = "VM de Azure con 2 vCPUs y 4 GB RAM", Price = 45.00m, Stock = 999, CategoryId = cloud },
                new Product { Name = "Cisco Catalyst 9200", Description = "Switch empresarial de 24 puertos PoE+", Price = 1850.00m, Stock = 15, CategoryId = networking },
                new Product { Name = "Ubiquiti UniFi USW-48", Description = "Switch gestionado 48 puertos Gigabit", Price = 599.00m, Stock = 20, CategoryId = networking },
                new Product { Name = "Synology DS923+", Description = "NAS de 4 bahías para PYME", Price = 599.99m, Stock = 8, CategoryId = storage },
                new Product { Name = "WD Red Pro 4TB", Description = "Disco duro NAS de alta durabilidad", Price = 119.99m, Stock = 30, CategoryId = storage }
            );
            await db.SaveChangesAsync();
        }
    }
}
