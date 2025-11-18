using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Indiaborn.Api.Controllers;

[ApiController]
[Authorize(Roles = "Admin")]
[Route("api/[controller]")]
public class UploadController : ControllerBase
{
    private readonly IWebHostEnvironment _env;
    private readonly ILogger<UploadController> _logger;

    public UploadController(IWebHostEnvironment env, ILogger<UploadController> logger)
    {
        _env = env;
        _logger = logger;
    }

    [HttpPost("image")]
    public async Task<IActionResult> UploadImage(IFormFile file, CancellationToken token)
    {
        if (file == null || file.Length == 0)
            return BadRequest("No file uploaded.");

        var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".webp" };
        var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
        if (!allowedExtensions.Contains(extension))
            return BadRequest("Invalid file type. Only JPG, PNG, and WebP are allowed.");

        if (file.Length > 5 * 1024 * 1024) // 5MB limit
            return BadRequest("File size exceeds 5MB limit.");

        var webRoot = _env.WebRootPath ?? Path.Combine(AppContext.BaseDirectory, "wwwroot");
        var uploadsDir = Path.Combine(webRoot, "assets", "products");
        Directory.CreateDirectory(uploadsDir);

        var fileName = $"{Guid.NewGuid()}{extension}";
        var filePath = Path.Combine(uploadsDir, fileName);

        try
        {
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream, token);
            }

            var url = $"/assets/products/{fileName}";
            return Ok(new { url, fileName });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error uploading file {FileName}", file.FileName);
            return StatusCode(500, "Error saving file.");
        }
    }
}

