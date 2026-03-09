using System.Net;
using System.Text.Json;

namespace Asisya.Api.Middleware;

public class GlobalExceptionHandler
{
    private readonly RequestDelegate _next;
    private readonly ILogger<GlobalExceptionHandler> _logger;

    public GlobalExceptionHandler(RequestDelegate next, ILogger<GlobalExceptionHandler> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unhandled exception: {Message}", ex.Message);
            await HandleExceptionAsync(context, ex);
        }
    }

    private static Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        var (statusCode, message) = exception switch
        {
            UnauthorizedAccessException => (HttpStatusCode.Unauthorized, "No autorizado."),
            KeyNotFoundException         => (HttpStatusCode.NotFound,     "Recurso no encontrado."),
            ArgumentException            => (HttpStatusCode.BadRequest,   exception.Message),
            _                            => (HttpStatusCode.InternalServerError, "Ocurrió un error interno. Inténtalo más tarde.")
        };

        context.Response.ContentType = "application/json";
        context.Response.StatusCode = (int)statusCode;

        var response = JsonSerializer.Serialize(new
        {
            status = (int)statusCode,
            error = message,
            path = context.Request.Path.Value
        });

        return context.Response.WriteAsync(response);
    }
}
