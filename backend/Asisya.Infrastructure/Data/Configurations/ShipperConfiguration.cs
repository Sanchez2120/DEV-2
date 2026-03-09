using Asisya.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Asisya.Infrastructure.Data.Configurations;

public class ShipperConfiguration : IEntityTypeConfiguration<Shipper>
{
    public void Configure(EntityTypeBuilder<Shipper> builder)
    {
        builder.HasKey(s => s.Id);
        builder.Property(s => s.CompanyName).IsRequired().HasMaxLength(100);
        builder.Property(s => s.Phone).HasMaxLength(30);
    }
}
