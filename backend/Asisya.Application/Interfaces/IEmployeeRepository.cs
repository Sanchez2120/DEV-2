using Asisya.Application.DTOs.Employee;
using Asisya.Domain.Entities;

namespace Asisya.Application.Interfaces;

public interface IEmployeeRepository
{
    Task<IEnumerable<EmployeeDto>> GetAllAsync();
    Task<EmployeeDto?> GetByIdAsync(int id);
    Task<Domain.Entities.Employee> CreateAsync(CreateEmployeeDto dto);
    Task<Domain.Entities.Employee> UpdateAsync(int id, CreateEmployeeDto dto);
    Task<bool> DeleteAsync(int id);
}
