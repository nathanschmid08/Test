using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using LiveChatApp.Hubs;
using System.Text; // für Encoding
using System.IdentityModel.Tokens.Jwt; // für JwtSecurityTokenHandler, JwtSecurityToken
using Microsoft.IdentityModel.Tokens; // für TokenValidationParameters, SymmetricSecurityKey, SecurityToken
using System.Linq; // für Claims.First()
using DotNetEnv;
using Microsoft.IdentityModel.Logging; // für IdentityModelEventSource

var builder = WebApplication.CreateBuilder(args);

// Services
builder.Services.AddRazorPages();
builder.Services.AddSignalR();

// Load variables from .env file
Env.Load(); // lädt .env aus Projektordner

var jwtSecret = Environment.GetEnvironmentVariable("JWT_SECRET");
if (string.IsNullOrEmpty(jwtSecret))
{
    throw new Exception("JWT_SECRET is missing in .env file");
}
Console.WriteLine($"JWT_SECRET: {jwtSecret}"); // Debug

var app = builder.Build();

if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.MapRazorPages();

// SignalR Hub route
app.MapHub<ChatHub>("/chathub");

// Aktiviert PII Debugging, damit man genau sieht, warum Token fehlschlägt
IdentityModelEventSource.ShowPII = true;

app.MapPost("/api/auth", (TokenRequest request) =>
{
    if (request == null || string.IsNullOrEmpty(request.Token))
        return Results.BadRequest(new { success = false, message = "Token missing" });

    try
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.UTF8.GetBytes(jwtSecret);

        // TokenValidationParameters für HS256 Node.js JWT
        var validationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(key),
            ValidateIssuer = false,
            ValidateAudience = false,
            ClockSkew = TimeSpan.Zero,
            ValidateLifetime = true // optional: auf false setzen zum Testen
        };

        var principal = tokenHandler.ValidateToken(request.Token, validationParameters, out SecurityToken validatedToken);

        var jwtToken = (JwtSecurityToken)validatedToken;

        // userId Claim auslesen
        var userId = jwtToken.Claims.FirstOrDefault(c => c.Type == "userId")?.Value;

        if (userId == null)
            return Results.BadRequest(new { success = false, message = "userId claim missing" });

        return Results.Ok(new { success = true, userId, message = "Token validated" });
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Token validation failed: {ex}");
        return Results.Unauthorized();
    }
});

app.Run();

public record TokenRequest(string Token);
