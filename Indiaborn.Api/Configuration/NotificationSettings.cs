namespace Indiaborn.Api.Configuration;

public class WhatsAppSettings
{
    public string FromNumber { get; set; } = string.Empty;
    public string TwilioAccountSid { get; set; } = string.Empty;
    public string TwilioAuthToken { get; set; } = string.Empty;
}

public class SmsSettings
{
    public string FromNumber { get; set; } = string.Empty;
    public string TwilioAccountSid { get; set; } = string.Empty;
    public string TwilioAuthToken { get; set; } = string.Empty;
}

public class MessengerSettings
{
    public string PageAccessToken { get; set; } = string.Empty;
}

public class EmailSettings
{
    public string SenderEmail { get; set; } = string.Empty;
    public string SenderName { get; set; } = "Indiaborn";
    public string SendGridApiKey { get; set; } = string.Empty;
}

public class NotificationSettings
{
    public WhatsAppSettings WhatsApp { get; set; } = new();
    public SmsSettings Phone { get; set; } = new();
    public MessengerSettings Messenger { get; set; } = new();
    public EmailSettings Email { get; set; } = new();
}

