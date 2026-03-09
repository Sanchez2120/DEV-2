using Asisya.Application.DTOs.Product;
using Asisya.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Asisya.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ProductController : ControllerBase
{
    private readonly IProductRepository _productRepository;

    public ProductController(IProductRepository productRepository)
    {
        _productRepository = productRepository;
    }

    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> GetPaginated([FromQuery] ProductPaginationQuery query)
    {
        var result = await _productRepository.GetPaginatedAsync(query);
        return Ok(result);
    }

    [HttpGet("{id}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetById(int id)
    {
        var product = await _productRepository.GetByIdAsync(id);
        if (product == null) return NotFound();
        return Ok(product);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateProductDto dto)
    {
        var product = await _productRepository.CreateAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = product.Id }, product);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateProductDto dto)
    {
        try
        {
            var product = await _productRepository.UpdateAsync(id, dto);
            return Ok(product);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var success = await _productRepository.DeleteAsync(id);
        if (!success) return NotFound();
        return NoContent();
    }

    [HttpPost("bulk")]
    [AllowAnonymous] // Allow anonymous just for test purposes, or secure it as needed
    public async Task<IActionResult> BulkInsert([FromBody] IEnumerable<CreateProductDto> dtos)
    {
        var success = await _productRepository.BulkInsertAsync(dtos);
        if (!success) return BadRequest("Bulk insert failed.");
        return Ok(new { message = $"Successfully inserted {dtos.Count()} products." });
    }
}
