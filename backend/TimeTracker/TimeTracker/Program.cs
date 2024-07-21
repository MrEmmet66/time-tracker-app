using GraphQL;
using GraphQL.Types;
using TimeTracker.Configuration;
using TimeTracker.Data;
using TimeTracker.GraphQL.Mutations;
using TimeTracker.GraphQL.Schema;
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

builder.Services.AddAuthorization();

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

app.UseAuthorization();

app.UseGraphQL<ISchema>("/graphql");
app.UseGraphQLPlayground();

app.Run();
