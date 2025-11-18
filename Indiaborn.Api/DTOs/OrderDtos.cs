using System.ComponentModel.DataAnnotations;
using Indiaborn.Api.Models;

namespace Indiaborn.Api.DTOs;

public class OrderItemRequest
{
    [Required]
    public string ProductId { get; set; } = string.Empty;

    [Range(1, 100)]
    public int Quantity { get; set; }
}

public class CreateOrderRequest
{
    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required]
    public string FullName { get; set; } = string.Empty;

    [Required]
    public string PhoneNumber { get; set; } = string.Empty;

    public string WhatsAppNumber { get; set; } = string.Empty;
    public string MessengerId { get; set; } = string.Empty;

    [Required]
    public ShippingInfo Shipping { get; set; } = new();

    [MinLength(1)]
    public List<OrderItemRequest> Items { get; set; } = new();

    public decimal ShippingFee { get; set; }
    public decimal Taxes { get; set; }
    public string PaymentMethod { get; set; } = "card";
}

public class OrderSummaryResponse
{
    public Order Order { get; set; } = new();
    public string ClientSecret { get; set; } = string.Empty;
}

public class ConfirmOrderRequest
{
    [Required]
    public string OrderId { get; set; } = string.Empty;

    [Required]
    public string PaymentIntentId { get; set; } = string.Empty;
}

