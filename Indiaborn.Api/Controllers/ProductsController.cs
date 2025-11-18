using Indiaborn.Api.DTOs;
using Indiaborn.Api.Models;
using Indiaborn.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Indiaborn.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly ProductService _service;

    public ProductsController(ProductService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<ActionResult<List<Product>>> GetAll(CancellationToken token)
        => await _service.GetAsync(token);

    [HttpGet("{id}")]
    public async Task<ActionResult<Product>> GetById(string id, CancellationToken token)
    {
        var product = await _service.GetByIdAsync(id, token);
        return product is null ? NotFound() : product;
    }

    [HttpGet("highlights")]
    public async Task<ActionResult<object>> GetHighlights(CancellationToken token)
    {
        var products = await _service.GetAsync(token);
        return new
        {
            bestSellers = products.Where(p => p.IsBestSeller),
            newArrivals = products.Where(p => p.IsNewArrival),
            onSale = products.Where(p => p.IsOnSale)
        };
    }

    [Authorize(Roles = nameof(UserRole.Admin))]
    [HttpPost]
    public async Task<ActionResult<Product>> Create(ProductRequest request, CancellationToken token)
    {
        var product = await _service.CreateAsync(request, token);
        return CreatedAtAction(nameof(GetById), new { id = product.Id }, product);
    }

    [Authorize(Roles = nameof(UserRole.Admin))]
    [HttpPut("{id}")]
    public async Task<ActionResult<Product>> Update(string id, ProductRequest request, CancellationToken token)
    {
        var updated = await _service.UpdateAsync(id, request, token);
        return updated is null ? NotFound() : updated;
    }

    [Authorize(Roles = nameof(UserRole.Admin))]
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id, CancellationToken token)
    {
        await _service.DeleteAsync(id, token);
        return NoContent();
    }
}

