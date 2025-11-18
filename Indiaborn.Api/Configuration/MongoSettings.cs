namespace Indiaborn.Api.Configuration;

public class MongoSettings
{
    public string ConnectionString { get; set; } = string.Empty;
    public string DatabaseName { get; set; } = string.Empty;
    public string ProductsCollection { get; set; } = "products";
    public string OrdersCollection { get; set; } = "orders";
    public string UsersCollection { get; set; } = "users";
}

