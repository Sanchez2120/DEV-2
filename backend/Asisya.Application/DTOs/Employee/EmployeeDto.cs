using System;

namespace Asisya.Application.DTOs.Employee;

public class EmployeeDto
{
    public int Id { get; set; }
    public string LastName { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string? Title { get; set; }
    public DateTime? HireDate { get; set; }
    public string? City { get; set; }
    public string? Country { get; set; }
    public int? ReportsToId { get; set; }
    public string? ManagerName { get; set; }
}

public class CreateEmployeeDto
{
    public string LastName { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string? Title { get; set; }
    public DateTime? HireDate { get; set; }
    public string? City { get; set; }
    public string? Country { get; set; }
    public int? ReportsToId { get; set; }
}
