using Asisya.Application.DTOs.Shipper;
using Asisya.Application.Interfaces;
using Asisya.Domain.Entities;
using Asisya.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Asisya.Infrastructure.Repositories;

public class ShipperRepository : IShipperRepository
{
    private readonly AppDbContext _context;

    public ShipperRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<ShipperDto>> GetAllAsync()
    {
        return await _context.Shippers
            .Select(s => new ShipperDto
            {
                Id = s.Id,
                CompanyName = s.CompanyName,
                Phone = s.Phone
            })
            .ToListAsync();
    }

    public async Task<ShipperDto?> GetByIdAsync(int id)
    {
        var s = await _context.Shippers.FindAsync(id);
        if (s == null) return null;

        return new ShipperDto
        {
            Id = s.Id,
            CompanyName = s.CompanyName,
            Phone = s.Phone
        };
    }

    public async Task<Shipper> CreateAsync(CreateShipperDto dto)
    {
        var shipper = new Shipper
        {
            CompanyName = dto.CompanyName,
            Phone = dto.Phone
        };

        _context.Shippers.Add(shipper);
        await _context.SaveChangesAsync();
        return shipper;
    }

    public async Task<Shipper> UpdateAsync(int id, CreateShipperDto dto)
    {
        var shipper = await _context.Shippers.FindAsync(id);
        if (shipper == null) throw new KeyNotFoundException($"Shipper with ID {id} not found.");

        shipper.CompanyName = dto.CompanyName;
        shipper.Phone = dto.Phone;

        await _context.SaveChangesAsync();
        return shipper;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var shipper = await _context.Shippers.FindAsync(id);
        if (shipper == null) return false;

        _context.Shippers.Remove(shipper);
        await _context.SaveChangesAsync();
        return true;
    }
}
