using Asisya.Application.DTOs.Customer;
using Asisya.Application.Interfaces;
using Asisya.Domain.Entities;
using Asisya.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Asisya.Infrastructure.Repositories;

public class CustomerRepository : ICustomerRepository
{
    private readonly AppDbContext _context;

    public CustomerRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<CustomerDto>> GetAllAsync()
    {
        return await _context.Customers
            .Select(c => new CustomerDto
            {
                Id = c.Id,
                CompanyName = c.CompanyName,
                ContactName = c.ContactName,
                City = c.City,
                Country = c.Country,
                Phone = c.Phone
            })
            .ToListAsync();
    }

    public async Task<CustomerDto?> GetByIdAsync(string id)
    {
        var c = await _context.Customers.FindAsync(id);
        if (c == null) return null;

        return new CustomerDto
        {
            Id = c.Id,
            CompanyName = c.CompanyName,
            ContactName = c.ContactName,
            City = c.City,
            Country = c.Country,
            Phone = c.Phone
        };
    }

    public async Task<Customer> CreateAsync(CreateCustomerDto dto)
    {
        var customer = new Customer
        {
            Id = dto.Id.ToUpper(), // CustomerID generally is 5 uppercase letters
            CompanyName = dto.CompanyName,
            ContactName = dto.ContactName,
            City = dto.City,
            Country = dto.Country,
            Phone = dto.Phone
        };

        _context.Customers.Add(customer);
        await _context.SaveChangesAsync();
        return customer;
    }

    public async Task<Customer> UpdateAsync(string id, CreateCustomerDto dto)
    {
        var customer = await _context.Customers.FindAsync(id);
        if (customer == null) throw new KeyNotFoundException($"Customer with ID {id} not found.");

        customer.CompanyName = dto.CompanyName;
        customer.ContactName = dto.ContactName;
        customer.City = dto.City;
        customer.Country = dto.Country;
        customer.Phone = dto.Phone;

        await _context.SaveChangesAsync();
        return customer;
    }

    public async Task<bool> DeleteAsync(string id)
    {
        var customer = await _context.Customers.FindAsync(id);
        if (customer == null) return false;

        _context.Customers.Remove(customer);
        await _context.SaveChangesAsync();
        return true;
    }
}
