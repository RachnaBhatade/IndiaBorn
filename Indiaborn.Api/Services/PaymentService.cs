using Indiaborn.Api.Configuration;
using Indiaborn.Api.Models;
using Microsoft.Extensions.Options;
using Stripe;

namespace Indiaborn.Api.Services;

public class PaymentService
{
    private readonly StripeSettings _settings;

    public PaymentService(IOptions<StripeSettings> settings)
    {
        _settings = settings.Value;
        StripeConfiguration.ApiKey = _settings.ApiKey;
    }

    public async Task<PaymentIntent> CreatePaymentIntentAsync(Order order, CancellationToken token = default)
    {
        var service = new PaymentIntentService();
        var paymentIntent = await service.CreateAsync(new PaymentIntentCreateOptions
        {
            Amount = (long)(order.Total * 100),
            Currency = _settings.Currency,
            ReceiptEmail = order.Contact.Email,
            Metadata = new Dictionary<string, string>
            {
                { "orderId", order.Id },
                { "referenceCode", order.ReferenceCode }
            },
            AutomaticPaymentMethods = new PaymentIntentAutomaticPaymentMethodsOptions { Enabled = true },
            Description = $"Indiaborn™ order {order.ReferenceCode}"
        }, cancellationToken: token);

        return paymentIntent;
    }
}

