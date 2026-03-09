namespace Asisya.Domain.Entities;

public class Employee
{
    public int Id { get; set; }
    public string LastName { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string? Title { get; set; }
    public string? TitleOfCourtesy { get; set; }
    public DateTime? BirthDate { get; set; }
    public DateTime? HireDate { get; set; }
    public string? Address { get; set; }
    public string? City { get; set; }
    public string? Region { get; set; }
    public string? PostalCode { get; set; }
    public string? Country { get; set; }
    public string? HomePhone { get; set; }
    public string? Extension { get; set; }
    public string? Photo { get; set; }         // URL or filename
    public string? Notes { get; set; }
    public int? ReportsTo { get; set; }         // Self-referencing FK (manager)
    public Employee? Manager { get; set; }

    public ICollection<Order> Orders { get; set; } = new List<Order>();
}
