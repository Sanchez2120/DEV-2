using System;
using System.Collections.Generic;

namespace Asisya.Application.DTOs.Order;

public class OrderDto
{
    public int Id { get; set; }
    public string CustomerId { get; set; } = string.Empty;
    public string? CustomerName { get; set; }
    public int EmployeeId { get; set; }
    public string? EmployeeName { get; set; }
    public int ShipperId { get; set; }
    public string? ShipperName { get; set; }
    public DateTime OrderDate { get; set; }
    public decimal Freight { get; set; }

    public IEnumerable<OrderDetailDto> Details { get; set; } = new List<OrderDetailDto>();
}

public class OrderDetailDto
{
    public int ProductId { get; set; }
    public string? ProductName { get; set; }
    public decimal UnitPrice { get; set; }
    public short Quantity { get; set; }
    public float Discount { get; set; }
}

public class CreateOrderDto
{
    public string CustomerId { get; set; } = string.Empty;
    public int EmployeeId { get; set; }
    public int ShipperId { get; set; }
    public decimal Freight { get; set; }
    public IEnumerable<CreateOrderDetailDto> Details { get; set; } = new List<CreateOrderDetailDto>();
}

public class CreateOrderDetailDto
{
    public int ProductId { get; set; }
    public short Quantity { get; set; }
    public decimal UnitPrice { get; set; }
    public float Discount { get; set; }
}
