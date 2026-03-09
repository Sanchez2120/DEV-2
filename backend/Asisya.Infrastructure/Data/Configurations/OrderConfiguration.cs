using Asisya.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Asisya.Infrastructure.Data.Configurations;

public class OrderConfiguration : IEntityTypeConfiguration<Order>
{
    public void Configure(EntityTypeBuilder<Order> builder)
    {
        builder.HasKey(o => o.Id);
        builder.Property(o => o.Freight).HasPrecision(18, 2);
        builder.Property(o => o.ShipName).HasMaxLength(100);
        builder.Property(o => o.ShipCountry).HasMaxLength(50);

        builder.HasOne(o => o.Customer)
               .WithMany(c => c.Orders)
               .HasForeignKey(o => o.CustomerId);

        builder.HasOne(o => o.Employee)
               .WithMany(e => e.Orders)
               .HasForeignKey(o => o.EmployeeId);

        builder.HasOne(o => o.Shipper)
               .WithMany(s => s.Orders)
               .HasForeignKey(o => o.ShipperId);
    }
}
