using Indiaborn.Api.Configuration;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace Indiaborn.Api.Data;

public class MongoDbContext
{
    private readonly IMongoDatabase _database;
    private readonly MongoSettings _settings;

    public MongoDbContext(IOptions<MongoSettings> settings)
    {
        _settings = settings.Value;
        var client = new MongoClient(_settings.ConnectionString);
        _database = client.GetDatabase(_settings.DatabaseName);
    }

    public IMongoCollection<T> GetCollection<T>(string? overrideName = null)
    {
        var collectionName = overrideName ?? typeof(T).Name.ToLowerInvariant();
        return _database.GetCollection<T>(collectionName);
    }

    public IMongoCollection<T> GetCollectionFromSetting<T>(string settingName)
    {
        var collectionName = settingName switch
        {
            nameof(MongoSettings.ProductsCollection) => _settings.ProductsCollection,
            nameof(MongoSettings.OrdersCollection) => _settings.OrdersCollection,
            nameof(MongoSettings.UsersCollection) => _settings.UsersCollection,
            _ => typeof(T).Name.ToLowerInvariant()
        };

        return _database.GetCollection<T>(collectionName);
    }
}

