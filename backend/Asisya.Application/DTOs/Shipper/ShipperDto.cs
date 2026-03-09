namespace Asisya.Application.DTOs.Shipper;

public class ShipperDto
{
    public int Id { get; set; }
    public string CompanyName { get; set; } = string.Empty;
    public string? Phone { get; set; }
}

public class CreateShipperDto
{
    public string CompanyName { get; set; } = string.Empty;
    public string? Phone { get; set; }
}
