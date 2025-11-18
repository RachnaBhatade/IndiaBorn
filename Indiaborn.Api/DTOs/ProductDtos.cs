using System.ComponentModel.DataAnnotations;
using Indiaborn.Api.Models;

namespace Indiaborn.Api.DTOs;

public class ProductRequest
{
    [Required]
    public string Name { get; set; } = string.Empty;

    [Required]
    [MaxLength(1500)]
    public string Description { get; set; } = string.Empty;

    [Range(0.01, 100000)]
    public decimal Price { get; set; }

    public decimal? SalePrice { get; set; }

    [Range(0, int.MaxValue)]
    public int InventoryCount { get; set; }

    public bool IsBestSeller { get; set; }
    public bool IsNewArrival { get; set; }
    public bool IsOnSale { get; set; }
    public string Category { get; set; } = "Jewelry";
    public List<ProductImage> Images { get; set; } = new();
}

public class ProductResponse : Product
{
}

