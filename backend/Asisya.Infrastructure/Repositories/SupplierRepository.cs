using Asisya.Application.DTOs.Supplier;
using Asisya.Application.Interfaces;
using Asisya.Domain.Entities;
using Asisya.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Asisya.Infrastructure.Repositories;

public class SupplierRepository : ISupplierRepository
{
    private readonly AppDbContext _context;

    public SupplierRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<SupplierDto>> GetAllAsync()
    {
        return await _context.Suppliers
            .Select(s => new SupplierDto
            {
                Id = s.Id,
                CompanyName = s.CompanyName,
                ContactName = s.ContactName,
                ContactTitle = s.ContactTitle,
                City = s.City,
                Country = s.Country,
                Phone = s.Phone
            })
            .ToListAsync();
    }

    public async Task<SupplierDto?> GetByIdAsync(int id)
    {
        var s = await _context.Suppliers.FindAsync(id);
        if (s == null) return null;

        return new SupplierDto
        {
            Id = s.Id,
            CompanyName = s.CompanyName,
            ContactName = s.ContactName,
            ContactTitle = s.ContactTitle,
            City = s.City,
            Country = s.Country,
            Phone = s.Phone
        };
    }

    public async Task<Supplier> CreateAsync(CreateSupplierDto dto)
    {
        var supplier = new Supplier
        {
            CompanyName = dto.CompanyName,
            ContactName = dto.ContactName,
            ContactTitle = dto.ContactTitle,
            City = dto.City,
            Country = dto.Country,
            Phone = dto.Phone
        };

        _context.Suppliers.Add(supplier);
        await _context.SaveChangesAsync();
        return supplier;
    }

    public async Task<Supplier> UpdateAsync(int id, CreateSupplierDto dto)
    {
        var supplier = await _context.Suppliers.FindAsync(id);
        if (supplier == null) throw new KeyNotFoundException($"Supplier with ID {id} not found.");

        supplier.CompanyName = dto.CompanyName;
        supplier.ContactName = dto.ContactName;
        supplier.ContactTitle = dto.ContactTitle;
        supplier.City = dto.City;
        supplier.Country = dto.Country;
        supplier.Phone = dto.Phone;

        await _context.SaveChangesAsync();
        return supplier;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var supplier = await _context.Suppliers.FindAsync(id);
        if (supplier == null) return false;

        _context.Suppliers.Remove(supplier);
        await _context.SaveChangesAsync();
        return true;
    }
}
