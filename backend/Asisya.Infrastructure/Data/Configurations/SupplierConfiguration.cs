using Asisya.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Asisya.Infrastructure.Data.Configurations;

public class SupplierConfiguration : IEntityTypeConfiguration<Supplier>
{
    public void Configure(EntityTypeBuilder<Supplier> builder)
    {
        builder.HasKey(s => s.Id);
        builder.Property(s => s.CompanyName).IsRequired().HasMaxLength(100);
        builder.Property(s => s.ContactName).HasMaxLength(100);
        builder.Property(s => s.Country).HasMaxLength(50);
        builder.Property(s => s.Phone).HasMaxLength(30);
    }
}
