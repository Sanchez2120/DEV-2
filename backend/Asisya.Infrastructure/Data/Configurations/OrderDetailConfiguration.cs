using Asisya.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Asisya.Infrastructure.Data.Configurations;

public class OrderDetailConfiguration : IEntityTypeConfiguration<OrderDetail>
{
    public void Configure(EntityTypeBuilder<OrderDetail> builder)
    {
        // Composite primary key
        builder.HasKey(od => new { od.OrderId, od.ProductId });

        builder.Property(od => od.UnitPrice).HasPrecision(18, 2);

        builder.HasOne(od => od.Order)
               .WithMany(o => o.OrderDetails)
               .HasForeignKey(od => od.OrderId);

        builder.HasOne(od => od.Product)
               .WithMany(p => p.OrderDetails)
               .HasForeignKey(od => od.ProductId);
    }
}
