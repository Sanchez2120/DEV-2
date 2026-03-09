namespace Asisya.Domain.Entities;

public class Product
{
    public int Id { get; set; }

    // Northwind fields
    public string Name { get; set; } = string.Empty;          // ProductName
    public string? QuantityPerUnit { get; set; }
    public decimal Price { get; set; }                         // UnitPrice
    public int Stock { get; set; }                             // UnitsInStock
    public int UnitsOnOrder { get; set; }
    public int ReorderLevel { get; set; }
    public bool Discontinued { get; set; }

    // Extra (for the technical test)
    public string? Description { get; set; }
    public string? ImageUrl { get; set; }

    public int CategoryId { get; set; }
    public Category Category { get; set; } = null!;

    public int? SupplierId { get; set; }
    public Supplier? Supplier { get; set; }

    public ICollection<OrderDetail> OrderDetails { get; set; } = new List<OrderDetail>();
}
