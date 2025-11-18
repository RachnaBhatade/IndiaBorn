namespace Indiaborn.Api.Configuration;

public class StripeSettings
{
    public string ApiKey { get; set; } = string.Empty;
    public string WebhookSecret { get; set; } = string.Empty;
    public string Currency { get; set; } = "rs";
    public string SuccessUrl { get; set; } = string.Empty;
    public string CancelUrl { get; set; } = string.Empty;
    public string PublishableKey { get; set; } = string.Empty;
}

