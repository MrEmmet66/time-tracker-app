using GraphQL;
using GraphQL.Types;
using TimeTracker.Constants;
using TimeTracker.Extensions;
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
            }).AuthorizeWithPermissions(Permissions.ManageAllMembers);

        Field<UserType>("setUserStatus")
            .Arguments(new QueryArguments(
                new QueryArgument<NonNullGraphType<IdGraphType>> { Name = "id" },
                new QueryArgument<NonNullGraphType<BooleanGraphType>> { Name = "isActive" }
            ))
            .ResolveAsync(
                async context =>
                {
                    var userId = context.GetArgument<int>("id");
                    var isActive = context.GetArgument<bool>("isActive");

                    return await repository.SetUserStatus(userId, isActive);
                }).AuthorizeWithPermissions(Permissions.ManageAllMembers);

        Field<LoginResultType>("login")
            .Arguments(new QueryArguments(
                new QueryArgument<NonNullGraphType<StringGraphType>> { Name = "email" },
                new QueryArgument<NonNullGraphType<StringGraphType>> { Name = "password" }
            ))
            .ResolveAsync(
                async context =>
                {
                    var email = context.GetArgument<string>("email");
                    var password = context.GetArgument<string>("password");

                    return await repository.Login(email, password);
                });

        Field<UserType>("updatePermissions")
            .Arguments(new QueryArguments(
                new QueryArgument<NonNullGraphType<IdGraphType>> { Name = "id" },
                new QueryArgument<NonNullGraphType<ListGraphType<StringGraphType>>> { Name = "permissions" }
            ))
            .ResolveAsync(
                async context =>
                {
                    var userId = context.GetArgument<int>("id");
                    var permissions = context.GetArgument<string[]>("permissions");

                    return await repository.UpdatePermissions(userId, permissions);
                }).AuthorizeWithPermissions(Permissions.ManageAllMembers);

        this.AddAuthorization();
    }
}