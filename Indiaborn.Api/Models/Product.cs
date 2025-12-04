using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Indiaborn.Api.Models;

public class ProductImage
{
    public string Url { get; set; } = string.Empty;
    public string AltText { get; set; } = string.Empty;
    public bool IsPrimary { get; set; }
}

public class ProductVariant
{
    public string Size { get; set; } = string.Empty; // XS, S, M, L, XL, XXL, or numeric sizes
    public string Color { get; set; } = string.Empty;
    public int Stock { get; set; }
    public string Sku { get; set; } = string.Empty;
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
    
    // Enhanced categorization for sports equipment and clothing
    public string Category { get; set; } = string.Empty; // Sports Equipment, Clothing
    public string SubCategory { get; set; } = string.Empty; // Cricket, Football, Tennis, etc. OR Men, Women, Kids
    public string ProductType { get; set; } = string.Empty; // Bat, Ball, Shoes, T-Shirt, etc.
    public string Gender { get; set; } = string.Empty; // Men, Women, Kids, Unisex (for equipment)
    public string Sport { get; set; } = string.Empty; // Cricket, Football, Tennis, Badminton, etc.
    
    // Size and color variants
    public List<ProductVariant> Variants { get; set; } = new();
    public List<string> AvailableSizes { get; set; } = new(); // XS, S, M, L, XL, XXL or numeric
    public List<string> AvailableColors { get; set; } = new();
    
    // Clothing specific
    public string Material { get; set; } = string.Empty; // Cotton, Polyester, etc.
    public string Brand { get; set; } = string.Empty;
    
    public List<ProductImage> Images { get; set; } = new();
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}

