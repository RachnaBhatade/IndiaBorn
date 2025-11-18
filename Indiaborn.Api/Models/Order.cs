using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Indiaborn.Api.Models;

public enum OrderStatus
{
    Pending,
    PaymentPending,
    Paid,
    Processing,
    Shipped,
    Delivered,
    Cancelled
}

public enum PaymentStatus
{
    Pending,
    Authorized,
    Captured,
    Failed,
    Refunded
}

public class OrderItem
{
    public string ProductId { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public decimal UnitPrice { get; set; }
    public int Quantity { get; set; }
    public string? ImageUrl { get; set; }
}

public class ShippingInfo
{
    public string FullName { get; set; } = string.Empty;
    public string AddressLine1 { get; set; } = string.Empty;
    public string AddressLine2 { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string State { get; set; } = string.Empty;
    public string PostalCode { get; set; } = string.Empty;
    public string Country { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
}

public class ContactInfo
{
    public string Email { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public string WhatsAppNumber { get; set; } = string.Empty;
    public string MessengerId { get; set; } = string.Empty;
}

public class Order
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; } = string.Empty;

    public string UserId { get; set; } = string.Empty;
    public string ReferenceCode { get; set; } = string.Empty;
    public List<OrderItem> Items { get; set; } = new();
    public ShippingInfo Shipping { get; set; } = new();
    public ContactInfo Contact { get; set; } = new();
    public decimal Subtotal { get; set; }
    public decimal ShippingFee { get; set; }
    public decimal Taxes { get; set; }
    public decimal Total => Subtotal + ShippingFee + Taxes;
    public OrderStatus Status { get; set; } = OrderStatus.Pending;
    public PaymentStatus PaymentStatus { get; set; } = PaymentStatus.Pending;
    public string PaymentIntentId { get; set; } = string.Empty;
    public string InvoiceUrl { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}

