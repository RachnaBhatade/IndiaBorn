using Indiaborn.Api.Configuration;
using Indiaborn.Api.DTOs;
using Indiaborn.Api.Models;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace Indiaborn.Api.Services;

public class ProductService
{
    private readonly IMongoCollection<Product> _products;

    public ProductService(Data.MongoDbContext context, IOptions<MongoSettings> settings)
    {
        _products = context.GetCollection<Product>(settings.Value.ProductsCollection);
    }

    public async Task<List<Product>> GetAsync(CancellationToken token = default)
        => await _products.Find(Builders<Product>.Filter.Empty)
            .SortByDescending(p => p.CreatedAt)
            .ToListAsync(token);

    public async Task<Product?> GetByIdAsync(string id, CancellationToken token = default)
        => await _products.Find(p => p.Id == id).FirstOrDefaultAsync(token);

    public async Task<Dictionary<string, Product>> GetByIdsAsync(IEnumerable<string> ids, CancellationToken token = default)
    {
        var idList = ids.Distinct().ToList();
        if (idList.Count == 0) return new Dictionary<string, Product>();

        var filter = Builders<Product>.Filter.In(p => p.Id, idList);
        var products = await _products.Find(filter).ToListAsync(token);
        return products.ToDictionary(p => p.Id, p => p);
    }

    public async Task<Product> CreateAsync(ProductRequest request, CancellationToken token = default)
    {
        var product = new Product
        {
            Name = request.Name,
            Description = request.Description,
            Price = request.Price,
            SalePrice = request.SalePrice,
            InventoryCount = request.InventoryCount,
            IsBestSeller = request.IsBestSeller,
            IsNewArrival = request.IsNewArrival,
            IsOnSale = request.IsOnSale,
            Category = request.Category,
            SubCategory = request.SubCategory,
            ProductType = request.ProductType,
            Gender = request.Gender,
            Sport = request.Sport,
            Material = request.Material,
            Brand = request.Brand,
            AvailableSizes = request.AvailableSizes,
            AvailableColors = request.AvailableColors,
            Variants = request.Variants,
            Images = request.Images,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        await _products.InsertOneAsync(product, cancellationToken: token);
        return product;
    }

    public async Task<Product?> UpdateAsync(string id, ProductRequest request, CancellationToken token = default)
    {
        var update = Builders<Product>.Update
            .Set(p => p.Name, request.Name)
            .Set(p => p.Description, request.Description)
            .Set(p => p.Price, request.Price)
            .Set(p => p.SalePrice, request.SalePrice)
            .Set(p => p.InventoryCount, request.InventoryCount)
            .Set(p => p.IsBestSeller, request.IsBestSeller)
            .Set(p => p.IsNewArrival, request.IsNewArrival)
            .Set(p => p.IsOnSale, request.IsOnSale)
            .Set(p => p.Category, request.Category)
            .Set(p => p.SubCategory, request.SubCategory)
            .Set(p => p.ProductType, request.ProductType)
            .Set(p => p.Gender, request.Gender)
            .Set(p => p.Sport, request.Sport)
            .Set(p => p.Material, request.Material)
            .Set(p => p.Brand, request.Brand)
            .Set(p => p.AvailableSizes, request.AvailableSizes)
            .Set(p => p.AvailableColors, request.AvailableColors)
            .Set(p => p.Variants, request.Variants)
            .Set(p => p.Images, request.Images)
            .Set(p => p.UpdatedAt, DateTime.UtcNow);

        return await _products.FindOneAndUpdateAsync<Product>(
            p => p.Id == id,
            update,
            new FindOneAndUpdateOptions<Product> { ReturnDocument = ReturnDocument.After },
            token);
    }

    public async Task DeleteAsync(string id, CancellationToken token = default)
        => await _products.DeleteOneAsync(p => p.Id == id, token);

    public async Task SeedDefaultsAsync(CancellationToken token = default)
    {
        var count = await _products.CountDocumentsAsync(Builders<Product>.Filter.Empty, cancellationToken: token);
        if (count > 0) return;

        var starterProducts = new List<Product>
        {
            new()
            {
                Name = "Heritage Kundan Nath",
                Description = "Pearl-laced kundan nath inspired by royal Maharashtrian heirlooms, finished in 22K micron gold.",
                Price = 1899m,
                SalePrice = 1599m,
                InventoryCount = 25,
                IsBestSeller = true,
                IsOnSale = true,
                Category = "Earrings",
                Images = new List<ProductImage>
                {
                    new() { Url = "/assets/products/indiaborn-kundan-nath.jpg", AltText = "Heritage kundan nath", IsPrimary = true }
                }
            },
            new()
            {
                Name = "Rajwada Gulabi Choker Set",
                Description = "Statement choker, matching earrings, and pearl strands featuring hand-set polki stones.",
                Price = 3499m,
                InventoryCount = 18,
                IsNewArrival = true,
                Category = "Necklaces",
                Images = new List<ProductImage>
                {
                    new() { Url = "/assets/products/indiaborn-rajwada-choker.jpg", AltText = "Rajwada gulabi choker set", IsPrimary = true }
                }
            }
        };

        await _products.InsertManyAsync(starterProducts, cancellationToken: token);
    }
}

