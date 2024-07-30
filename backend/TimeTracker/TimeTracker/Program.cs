using System.Text;
using GraphQL;
using GraphQL.Types;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using TimeTracker.Configuration;
using TimeTracker.Data;
using TimeTracker.GraphQL.Mutations;
using TimeTracker.GraphQL.Schema;
using TimeTracker.Models;
using TimeTracker.Options;
using TimeTracker.Repositories.Implementations;
using TimeTracker.Repositories.Infrastructure;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.Configure<DbSettings>(builder.Configuration.GetSection("DbSettings"));
builder.Services.AddSingleton<DataContext>();

builder.Services.AddScoped<IUserRepository, UserRepository>();

builder.Services.AddScoped<UserMutation>();

builder.Services.AddScoped<ISchema, AppSchema>();

builder.Services.AddSingleton<IDocumentExecuter, DocumentExecuter>();
builder.Services.AddGraphQL(b => b
    .AddSystemTextJson()
    .AddGraphTypes(typeof(AppSchema).Assembly)
    .AddErrorInfoProvider(opt => opt.ExposeExceptionStackTrace = builder.Environment.IsDevelopment())
);

var jwtOptions = builder.Configuration
    .GetSection("JwtOptions")
    .Get<JwtOptions>();
    
builder.Services.AddSingleton(jwtOptions);
builder.Services.AddAuthorization();

builder.Services.AddCors(config =>
{
    config.AddDefaultPolicy(builder =>
    {
        builder.AllowAnyHeader().AllowAnyOrigin().AllowAnyMethod();
    });
});

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(options =>
{
    byte[] signingKeyBytes = Encoding.UTF8
        .GetBytes(jwtOptions.SigningKey);
    
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtOptions.Issuer,
        ValidAudience = jwtOptions.Audience,
        IssuerSigningKey = new SymmetricSecurityKey(signingKeyBytes),
    };
});

builder.Services.AddAutoMapper(config =>
{
    config.CreateMap<BasePermission, string>().ReverseMap();
});

var app = builder.Build();

{
    using var scope = app.Services.CreateScope();
    var context = scope.ServiceProvider.GetRequiredService<DataContext>();
    await context.Init();
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors();

app.UseAuthorization();

app.UseGraphQL<ISchema>("/graphql");
app.UseGraphQLPlayground();

app.Run();