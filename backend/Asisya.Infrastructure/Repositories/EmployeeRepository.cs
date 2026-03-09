using Asisya.Application.DTOs.Employee;
using Asisya.Application.Interfaces;
using Asisya.Domain.Entities;
using Asisya.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Asisya.Infrastructure.Repositories;

public class EmployeeRepository : IEmployeeRepository
{
    private readonly AppDbContext _context;

    public EmployeeRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<EmployeeDto>> GetAllAsync()
    {
        return await _context.Employees
            .Include(e => e.Manager)
            .Select(e => new EmployeeDto
            {
                Id = e.Id,
                LastName = e.LastName,
                FirstName = e.FirstName,
                Title = e.Title,
                HireDate = e.HireDate,
                City = e.City,
                Country = e.Country,
                ReportsToId = e.ReportsTo,
                ManagerName = e.Manager != null ? $"{e.Manager.FirstName} {e.Manager.LastName}" : null
            })
            .ToListAsync();
    }

    public async Task<EmployeeDto?> GetByIdAsync(int id)
    {
        var e = await _context.Employees
            .Include(e => e.Manager)
            .FirstOrDefaultAsync(e => e.Id == id);
            
        if (e == null) return null;

        return new EmployeeDto
        {
            Id = e.Id,
            LastName = e.LastName,
            FirstName = e.FirstName,
            Title = e.Title,
            HireDate = e.HireDate,
            City = e.City,
            Country = e.Country,
            ReportsToId = e.ReportsTo,
            ManagerName = e.Manager != null ? $"{e.Manager.FirstName} {e.Manager.LastName}" : null
        };
    }

    public async Task<Employee> CreateAsync(CreateEmployeeDto dto)
    {
        var employee = new Employee
        {
            LastName = dto.LastName,
            FirstName = dto.FirstName,
            Title = dto.Title,
            HireDate = dto.HireDate,
            City = dto.City,
            Country = dto.Country,
            ReportsTo = dto.ReportsToId
        };

        _context.Employees.Add(employee);
        await _context.SaveChangesAsync();
        return employee;
    }

    public async Task<Employee> UpdateAsync(int id, CreateEmployeeDto dto)
    {
        var employee = await _context.Employees.FindAsync(id);
        if (employee == null) throw new KeyNotFoundException($"Employee with ID {id} not found.");

        employee.LastName = dto.LastName;
        employee.FirstName = dto.FirstName;
        employee.Title = dto.Title;
        employee.HireDate = dto.HireDate;
        employee.City = dto.City;
        employee.Country = dto.Country;
        employee.ReportsTo = dto.ReportsToId;

        await _context.SaveChangesAsync();
        return employee;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var employee = await _context.Employees.FindAsync(id);
        if (employee == null) return false;

        _context.Employees.Remove(employee);
        await _context.SaveChangesAsync();
        return true;
    }
}
