using GraphQL;
using GraphQL.Types;
using TimeTracker.GraphQL.Types;
using TimeTracker.Models;
using TimeTracker.Repositories.Infrastructure;

namespace TimeTracker.GraphQL.Mutations;

public class UserMutation : ObjectGraphType
{
    public UserMutation(IUserRepository repository)
    {
        Field<UserType>("createUser").Arguments(new QueryArguments(
                new QueryArgument<NonNullGraphType<StringGraphType>> { Name = "email" },
                new QueryArgument<NonNullGraphType<StringGraphType>> { Name = "password" },
                new QueryArgument<NonNullGraphType<StringGraphType>> { Name = "firstName" },
                new QueryArgument<NonNullGraphType<StringGraphType>> { Name = "lastName" }))
            .ResolveAsync(async context =>
            {
                var email = context.GetArgument<string>("email");
                var password = context.GetArgument<string>("password");
                var firstName = context.GetArgument<string>("firstName");
                var lastName = context.GetArgument<string>("lastName");
                var passwordHash = BCrypt.Net.BCrypt.HashPassword(password);

                var user = new User()
                {
                    Email = email,
                    PasswordHash = passwordHash,
                    FirstName = firstName,
                    LastName = lastName
                };

                return await repository.Create(user);
            });

        Field<UserType>("deleteUser")
            .Arguments(new QueryArguments(new QueryArgument<NonNullGraphType<IdGraphType>> { Name = "id" }))
            .ResolveAsync(
                async context =>
                {
                    var userId = context.GetArgument<int>("id");

                    return await repository.DeleteById(userId);
                });
    }
}