using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Indiaborn.Api.Models;

public class ProductImage
{
    public string Url { get; set; } = string.Empty;
    public string AltText { get; set; } = string.Empty;
    public bool IsPrimary { get; set; }
}

public class Product
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; } = string.Empty;

    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public decimal? SalePrice { get; set; }
    public int InventoryCount { get; set; }
    public bool IsBestSeller { get; set; }
    public bool IsNewArrival { get; set; }
    public bool IsOnSale { get; set; }
    public string Category { get; set; } = string.Empty;
    public List<ProductImage> Images { get; set; } = new();
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}

