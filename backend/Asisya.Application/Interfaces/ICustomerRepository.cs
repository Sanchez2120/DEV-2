using Asisya.Application.DTOs.Customer;
using Asisya.Domain.Entities;

namespace Asisya.Application.Interfaces;

public interface ICustomerRepository
{
    Task<IEnumerable<CustomerDto>> GetAllAsync();
    Task<CustomerDto?> GetByIdAsync(string id);
    Task<Customer> CreateAsync(CreateCustomerDto dto);
    Task<Customer> UpdateAsync(string id, CreateCustomerDto dto);
    Task<bool> DeleteAsync(string id);
}
