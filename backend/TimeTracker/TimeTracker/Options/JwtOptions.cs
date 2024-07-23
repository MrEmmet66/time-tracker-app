namespace TimeTracker.Options;

public record class JwtOptions(
    string Issuer,
    string Audience,
    string SigningKey,
    int ExpirationDays
);