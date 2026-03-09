using Asisya.Application.DTOs.Category;
using Asisya.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Asisya.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class CategoryController : ControllerBase
{
    private readonly ICategoryRepository _categoryRepository;
    private readonly IWebHostEnvironment _env;

    // Allowed image MIME types and max size (5 MB)
    private static readonly HashSet<string> AllowedMimeTypes =
        ["image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml"];
    private static readonly HashSet<string> AllowedExtensions =
        [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"];
    private const long MaxFileSizeBytes = 5 * 1024 * 1024; // 5 MB

    public CategoryController(ICategoryRepository categoryRepository, IWebHostEnvironment env)
    {
        _categoryRepository = categoryRepository;
        _env = env;
    }

    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> GetAll()
    {
        var categories = await _categoryRepository.GetAllAsync();
        return Ok(categories);
    }

    [HttpGet("{id}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetById(int id)
    {
        var category = await _categoryRepository.GetByIdAsync(id);
        if (category == null) return NotFound();
        return Ok(category);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateCategoryDto dto)
    {
        var category = await _categoryRepository.CreateAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = category.Id }, category);
    }

    /// <summary>
    /// Upload an image for a category.
    /// Allowed formats: JPG, JPEG, PNG, GIF, WEBP, SVG.
    /// Maximum file size: 5 MB.
    /// </summary>
    [HttpPost("{id}/image")]
    [Consumes("multipart/form-data")]
    public async Task<IActionResult> UploadImage(int id, IFormFile file)
    {
        // Validate category exists
        var category = await _categoryRepository.GetByIdAsync(id);
        if (category == null) return NotFound(new { message = "Categoría no encontrada." });

        // Validate file present
        if (file == null || file.Length == 0)
            return BadRequest(new { message = "No se proporcionó ningún archivo." });

        // Validate size
        if (file.Length > MaxFileSizeBytes)
            return BadRequest(new { message = $"El archivo supera el tamaño máximo permitido de 5 MB." });

        // Validate MIME type
        if (!AllowedMimeTypes.Contains(file.ContentType.ToLower()))
            return BadRequest(new { message = "Formato no permitido. Use JPG, PNG, GIF, WEBP o SVG." });

        // Validate extension
        var ext = Path.GetExtension(file.FileName).ToLower();
        if (!AllowedExtensions.Contains(ext))
            return BadRequest(new { message = "Extensión de archivo no permitida." });

        // Save file to wwwroot/images/categories/
        var uploadsDir = Path.Combine(_env.WebRootPath ?? "wwwroot", "images", "categories");
        Directory.CreateDirectory(uploadsDir);

        var fileName = $"category_{id}_{Guid.NewGuid():N}{ext}";
        var filePath = Path.Combine(uploadsDir, fileName);

        await using var stream = System.IO.File.Create(filePath);
        await file.CopyToAsync(stream);

        // Build the public URL
        var imageUrl = $"/images/categories/{fileName}";

        // Persist in database
        await _categoryRepository.UpdateImageUrlAsync(id, imageUrl);

        return Ok(new { imageUrl, message = "Imagen subida exitosamente." });
    }
}
