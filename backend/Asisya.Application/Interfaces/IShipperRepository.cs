using Asisya.Application.DTOs.Shipper;
using Asisya.Domain.Entities;

namespace Asisya.Application.Interfaces;

public interface IShipperRepository
{
    Task<IEnumerable<ShipperDto>> GetAllAsync();
    Task<ShipperDto?> GetByIdAsync(int id);
    Task<Shipper> CreateAsync(CreateShipperDto dto);
    Task<Shipper> UpdateAsync(int id, CreateShipperDto dto);
    Task<bool> DeleteAsync(int id);
}
