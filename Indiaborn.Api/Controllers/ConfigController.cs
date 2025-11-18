using Indiaborn.Api.Configuration;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace Indiaborn.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ConfigController : ControllerBase
{
    private readonly StripeSettings _stripe;

    public ConfigController(IOptions<StripeSettings> stripeSettings)
    {
        _stripe = stripeSettings.Value;
    }

    [HttpGet("stripe")]
    public IActionResult GetStripeConfig()
        => Ok(new { publishableKey = _stripe.PublishableKey, currency = _stripe.Currency });
}

