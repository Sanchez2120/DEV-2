using Asisya.Application.DTOs.Shipper;
using Asisya.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Asisya.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ShippersController : ControllerBase
{
    private readonly IShipperRepository _shipperRepository;

    public ShippersController(IShipperRepository shipperRepository)
    {
        _shipperRepository = shipperRepository;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var result = await _shipperRepository.GetAllAsync();
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var shipper = await _shipperRepository.GetByIdAsync(id);
        if (shipper == null) return NotFound();
        return Ok(shipper);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateShipperDto dto)
    {
        var shipper = await _shipperRepository.CreateAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = shipper.Id }, shipper);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] CreateShipperDto dto)
    {
        try
        {
            var shipper = await _shipperRepository.UpdateAsync(id, dto);
            return Ok(shipper);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var success = await _shipperRepository.DeleteAsync(id);
        if (!success) return NotFound();
        return NoContent();
    }
}
