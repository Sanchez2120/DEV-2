using Asisya.Application.DTOs.Supplier;
using Asisya.Domain.Entities;

namespace Asisya.Application.Interfaces;

public interface ISupplierRepository
{
    Task<IEnumerable<SupplierDto>> GetAllAsync();
    Task<SupplierDto?> GetByIdAsync(int id);
    Task<Supplier> CreateAsync(CreateSupplierDto dto);
    Task<Supplier> UpdateAsync(int id, CreateSupplierDto dto);
    Task<bool> DeleteAsync(int id);
}
