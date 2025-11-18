using Indiaborn.Api.Configuration;
using Indiaborn.Api.Models;
using Microsoft.Extensions.Options;
using SendGrid;
using SendGrid.Helpers.Mail;
using Twilio;
using Twilio.Rest.Api.V2010.Account;
using Twilio.Types;

namespace Indiaborn.Api.Services;

public class NotificationService
{
    private readonly NotificationSettings _settings;
    private readonly SendGridClient _sendGrid;
    private readonly HttpClient _httpClient;
    private readonly ILogger<NotificationService> _logger;

    public NotificationService(
        IOptions<NotificationSettings> settings,
        SendGridClient sendGridClient,
        IHttpClientFactory httpClientFactory,
        ILogger<NotificationService> logger)
    {
        _settings = settings.Value;
        _sendGrid = sendGridClient;
        _httpClient = httpClientFactory.CreateClient("messenger");
        _logger = logger;
    }

    public async Task SendOrderNotificationsAsync(Order order, CancellationToken token = default)
    {
        var tasks = new List<Task>();

        if (!string.IsNullOrWhiteSpace(order.Contact.Email))
        {
            tasks.Add(SendEmailAsync(order, token));
        }

        if (!string.IsNullOrWhiteSpace(order.Contact.WhatsAppNumber))
        {
            tasks.Add(SendWhatsAppAsync(order));
        }

        if (!string.IsNullOrWhiteSpace(order.Contact.PhoneNumber))
        {
            tasks.Add(SendSmsAsync(order));
        }

        if (!string.IsNullOrWhiteSpace(order.Contact.MessengerId))
        {
            tasks.Add(SendMessengerAsync(order, token));
        }

        await Task.WhenAll(tasks);
    }

    private async Task SendEmailAsync(Order order, CancellationToken token)
    {
        if (string.IsNullOrWhiteSpace(_settings.Email.SendGridApiKey))
        {
            _logger.LogWarning("SendGrid API key not configured.");
            return;
        }

        var msg = new SendGridMessage
        {
            From = new EmailAddress(_settings.Email.SenderEmail, _settings.Email.SenderName),
            Subject = $"Your Indiaborn™ order {order.ReferenceCode}",
            HtmlContent = $"""
                <p>Hi {order.Shipping.FullName},</p>
                <p>Thank you for shopping with Indiaborn™. Your order <strong>{order.ReferenceCode}</strong> is confirmed.</p>
                <p>Total: <strong>{order.Total:C}</strong></p>
                <p>You can download your invoice <a href="{order.InvoiceUrl}">here</a>.</p>
                <p>Love,<br/>Team Indiaborn™</p>
            """
        };

        msg.AddTo(new EmailAddress(order.Contact.Email, order.Shipping.FullName));
        await _sendGrid.SendEmailAsync(msg, token);
    }

    private Task SendWhatsAppAsync(Order order)
    {
        if (string.IsNullOrWhiteSpace(_settings.WhatsApp.TwilioAccountSid))
        {
            _logger.LogWarning("Twilio WhatsApp credentials missing.");
            return Task.CompletedTask;
        }

        TwilioClient.Init(_settings.WhatsApp.TwilioAccountSid, _settings.WhatsApp.TwilioAuthToken);

        var options = new CreateMessageOptions(new PhoneNumber($"whatsapp:{order.Contact.WhatsAppNumber}"))
        {
            From = new PhoneNumber($"whatsapp:{_settings.WhatsApp.FromNumber}"),
            Body = $"Your Indiaborn™ order {order.ReferenceCode} is confirmed. Total {order.Total:C}."
        };

        return MessageResource.CreateAsync(options);
    }

    private Task SendSmsAsync(Order order)
    {
        if (string.IsNullOrWhiteSpace(_settings.Phone.TwilioAccountSid))
        {
            _logger.LogWarning("Twilio SMS credentials missing.");
            return Task.CompletedTask;
        }

        TwilioClient.Init(_settings.Phone.TwilioAccountSid, _settings.Phone.TwilioAuthToken);

        var options = new CreateMessageOptions(new PhoneNumber(order.Contact.PhoneNumber))
        {
            From = new PhoneNumber(_settings.Phone.FromNumber),
            Body = $"Indiaborn™ update: order {order.ReferenceCode} confirmed."
        };

        return MessageResource.CreateAsync(options);
    }

    private async Task SendMessengerAsync(Order order, CancellationToken token)
    {
        if (string.IsNullOrWhiteSpace(_settings.Messenger.PageAccessToken))
        {
            _logger.LogWarning("Messenger token missing.");
            return;
        }

        var payload = new
        {
            recipient = new { id = order.Contact.MessengerId },
            message = new { text = $"Hi {order.Shipping.FullName}, your Indiaborn™ order {order.ReferenceCode} is confirmed." }
        };

        var response = await _httpClient.PostAsJsonAsync(
            $"https://graph.facebook.com/v19.0/me/messages?access_token={_settings.Messenger.PageAccessToken}",
            payload,
            token);

        if (!response.IsSuccessStatusCode)
        {
            _logger.LogWarning("Messenger notification failed: {status}", response.StatusCode);
        }
    }
}

