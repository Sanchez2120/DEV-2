namespace Asisya.Domain.Entities;

public class Order
{
    public int Id { get; set; }
    public string CustomerId { get; set; } = string.Empty;
    public int EmployeeId { get; set; }
    public int ShipperId { get; set; }              // ShipVia in Northwind
    public DateTime OrderDate { get; set; }
    public DateTime? RequiredDate { get; set; }
    public DateTime? ShippedDate { get; set; }
    public decimal Freight { get; set; }
    public string? ShipName { get; set; }
    public string? ShipAddress { get; set; }
    public string? ShipCity { get; set; }
    public string? ShipRegion { get; set; }
    public string? ShipPostalCode { get; set; }
    public string? ShipCountry { get; set; }

    public Customer Customer { get; set; } = null!;
    public Employee Employee { get; set; } = null!;
    public Shipper Shipper { get; set; } = null!;
    public ICollection<OrderDetail> OrderDetails { get; set; } = new List<OrderDetail>();
}
