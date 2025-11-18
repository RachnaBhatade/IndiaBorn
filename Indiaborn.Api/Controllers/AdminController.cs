using Indiaborn.Api.Models;
using Indiaborn.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Indiaborn.Api.Controllers;

[ApiController]
[Authorize(Roles = nameof(UserRole.Admin))]
[Route("api/[controller]")]
public class AdminController : ControllerBase
{
    private readonly OrderService _orderService;
    private readonly ProductService _productService;

    public AdminController(OrderService orderService, ProductService productService)
    {
        _orderService = orderService;
        _productService = productService;
    }

    [HttpGet("overview")]
    public async Task<IActionResult> Overview(CancellationToken token)
    {
        var orders = await _orderService.GetAllAsync(token);
        var products = await _productService.GetAsync(token);

        var revenue = orders.Where(o => o.PaymentStatus == PaymentStatus.Captured || o.PaymentStatus == PaymentStatus.Authorized)
            .Sum(o => o.Total);

        return Ok(new
        {
            totalOrders = orders.Count,
            revenue,
            products = products.Count,
            lowInventory = products.Count(p => p.InventoryCount < 5),
            pendingOrders = orders.Count(o => o.Status is OrderStatus.Pending or OrderStatus.PaymentPending)
        });
    }
}

