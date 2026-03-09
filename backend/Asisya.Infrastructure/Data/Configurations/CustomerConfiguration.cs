using Asisya.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Asisya.Infrastructure.Data.Configurations;

public class CustomerConfiguration : IEntityTypeConfiguration<Customer>
{
    public void Configure(EntityTypeBuilder<Customer> builder)
    {
        builder.HasKey(c => c.Id);
        builder.Property(c => c.Id).HasMaxLength(5);
        builder.Property(c => c.CompanyName).IsRequired().HasMaxLength(100);
        builder.Property(c => c.ContactName).HasMaxLength(100);
        builder.Property(c => c.Country).HasMaxLength(50);
        builder.Property(c => c.Phone).HasMaxLength(30);
    }
}
