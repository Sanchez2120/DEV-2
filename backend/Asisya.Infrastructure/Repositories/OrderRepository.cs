using Asisya.Application.DTOs.Order;
using Asisya.Application.Interfaces;
using Asisya.Domain.Entities;
using Asisya.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Asisya.Infrastructure.Repositories;

public class OrderRepository : IOrderRepository
{
    private readonly AppDbContext _context;

    public OrderRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<OrderDto>> GetAllAsync()
    {
        return await _context.Orders
            .Include(o => o.Customer)
            .Include(o => o.Employee)
            .Include(o => o.Shipper)
            .Include(o => o.OrderDetails)
                .ThenInclude(od => od.Product)
            .Select(o => new OrderDto
            {
                Id = o.Id,
                CustomerId = o.CustomerId,
                CustomerName = o.Customer.CompanyName,
                EmployeeId = o.EmployeeId,
                EmployeeName = $"{o.Employee.FirstName} {o.Employee.LastName}",
                ShipperId = o.ShipperId,
                ShipperName = o.Shipper.CompanyName,
                OrderDate = o.OrderDate,
                Freight = o.Freight,
                Details = o.OrderDetails.Select(od => new OrderDetailDto
                {
                    ProductId = od.ProductId,
                    ProductName = od.Product.Name,
                    UnitPrice = od.UnitPrice,
                    Quantity = od.Quantity,
                    Discount = (float)od.Discount
                }).ToList()
            })
            .ToListAsync();
    }

    public async Task<OrderDto?> GetByIdAsync(int id)
    {
        var o = await _context.Orders
            .Include(o => o.Customer)
            .Include(o => o.Employee)
            .Include(o => o.Shipper)
            .Include(o => o.OrderDetails)
                .ThenInclude(od => od.Product)
            .FirstOrDefaultAsync(o => o.Id == id);
            
        if (o == null) return null;

        return new OrderDto
        {
            Id = o.Id,
            CustomerId = o.CustomerId,
            CustomerName = o.Customer.CompanyName,
            EmployeeId = o.EmployeeId,
            EmployeeName = $"{o.Employee.FirstName} {o.Employee.LastName}",
            ShipperId = o.ShipperId,
            ShipperName = o.Shipper.CompanyName,
            OrderDate = o.OrderDate,
            Freight = o.Freight,
            Details = o.OrderDetails.Select(od => new OrderDetailDto
            {
                ProductId = od.ProductId,
                ProductName = od.Product.Name,
                UnitPrice = od.UnitPrice,
                Quantity = od.Quantity,
                Discount = (float)od.Discount
            }).ToList()
        };
    }

    public async Task<Order> CreateAsync(CreateOrderDto dto)
    {
        var order = new Order
        {
            CustomerId = dto.CustomerId,
            EmployeeId = dto.EmployeeId,
            ShipperId = dto.ShipperId,
            OrderDate = DateTime.UtcNow,
            Freight = dto.Freight,
            OrderDetails = dto.Details.Select(d => new OrderDetail
            {
                ProductId = d.ProductId,
                Quantity = d.Quantity,
                UnitPrice = d.UnitPrice,
                Discount = d.Discount
            }).ToList()
        };

        _context.Orders.Add(order);
        await _context.SaveChangesAsync();
        return order;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var order = await _context.Orders.FindAsync(id);
        if (order == null) return false;

        _context.Orders.Remove(order);
        await _context.SaveChangesAsync();
        return true;
    }
}
