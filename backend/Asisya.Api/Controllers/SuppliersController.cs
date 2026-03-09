using Asisya.Application.DTOs.Supplier;
using Asisya.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Asisya.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class SuppliersController : ControllerBase
{
    private readonly ISupplierRepository _supplierRepository;

    public SuppliersController(ISupplierRepository supplierRepository)
    {
        _supplierRepository = supplierRepository;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var result = await _supplierRepository.GetAllAsync();
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var supplier = await _supplierRepository.GetByIdAsync(id);
        if (supplier == null) return NotFound();
        return Ok(supplier);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateSupplierDto dto)
    {
        var supplier = await _supplierRepository.CreateAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = supplier.Id }, supplier);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] CreateSupplierDto dto)
    {
        try
        {
            var supplier = await _supplierRepository.UpdateAsync(id, dto);
            return Ok(supplier);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var success = await _supplierRepository.DeleteAsync(id);
        if (!success) return NotFound();
        return NoContent();
    }
}
