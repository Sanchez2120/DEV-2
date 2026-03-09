using Asisya.Application.DTOs.Order;
using Asisya.Domain.Entities;

namespace Asisya.Application.Interfaces;

public interface IOrderRepository
{
    Task<IEnumerable<OrderDto>> GetAllAsync();
    Task<OrderDto?> GetByIdAsync(int id);
    Task<Domain.Entities.Order> CreateAsync(CreateOrderDto dto);
    Task<bool> DeleteAsync(int id);
}
