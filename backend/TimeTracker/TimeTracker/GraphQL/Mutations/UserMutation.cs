using System.Security.Authentication;
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
                try
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
                }
                catch (ArgumentException ex)
                {
                    context.Errors.Add(new ExecutionError(ex.Message));
                    return null;
                }
                catch (Exception ex)
                {
                    Console.WriteLine(ex);
                    context.Errors.Add(new ExecutionError("An unexpected error occurred."));
                    return null;
                }
            }).AuthorizeWithPermissions(Permissions.ManageAllMembers);

        Field<UserType>("setUserStatus")
            .Arguments(new QueryArguments(
                new QueryArgument<NonNullGraphType<IdGraphType>> { Name = "id" },
                new QueryArgument<NonNullGraphType<BooleanGraphType>> { Name = "isActive" }
            ))
            .ResolveAsync(
                async context =>
                {
                    try
                    {
                        var userId = context.GetArgument<int>("id");
                        var isActive = context.GetArgument<bool>("isActive");

                        return await repository.SetUserStatus(userId, isActive);
                    }
                    catch (KeyNotFoundException ex)
                    {
                        context.Errors.Add(new ExecutionError(ex.Message));
                        return null;
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine(ex);
                        context.Errors.Add(new ExecutionError("An unexpected error occurred."));
                        return null;
                    }
                }).AuthorizeWithPermissions(Permissions.ManageAllMembers);

        Field<LoginResultType>("login")
            .Arguments(new QueryArguments(
                new QueryArgument<NonNullGraphType<StringGraphType>> { Name = "email" },
                new QueryArgument<NonNullGraphType<StringGraphType>> { Name = "password" }
            ))
            .ResolveAsync(
                async context =>
                {
                    try
                    {
                        var email = context.GetArgument<string>("email");
                        var password = context.GetArgument<string>("password");

                        return await repository.Login(email, password);
                    }
                    catch (ArgumentException ex)
                    {
                        context.Errors.Add(new ExecutionError(ex.Message));
                        return null;
                    }
                    catch (KeyNotFoundException ex)
                    {
                        context.Errors.Add(new ExecutionError(ex.Message));
                        return null;
                    }

                    catch (Exception ex)
                    {
                        Console.WriteLine(ex);
                        context.Errors.Add(new ExecutionError("An unexpected error occurred."));
                        return null;
                    }
                });

        Field<UserType>("updatePermissions")
            .Arguments(new QueryArguments(
                new QueryArgument<NonNullGraphType<IdGraphType>> { Name = "id" },
                new QueryArgument<NonNullGraphType<ListGraphType<StringGraphType>>> { Name = "permissions" }
            ))
            .ResolveAsync(
                async context =>
                {
                    try
                    {
                        var userId = context.GetArgument<int>("id");
                        var permissions = context.GetArgument<string[]>("permissions");

                        return await repository.UpdatePermissions(userId, permissions);
                    }
                    catch (KeyNotFoundException ex)
                    {
                        context.Errors.Add(new ExecutionError(ex.Message));
                        return null;
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine(ex);
                        context.Errors.Add(new ExecutionError("An unexpected error occurred."));
                        return null;
                    }
                }).AuthorizeWithPermissions(Permissions.ManageAllMembers);

        Field<UserType>("editUser")
            .Arguments(new QueryArguments(
                new QueryArgument<NonNullGraphType<IdGraphType>> { Name = "id" },
                new QueryArgument<NonNullGraphType<StringGraphType>> { Name = "email" },
                new QueryArgument<NonNullGraphType<StringGraphType>> { Name = "firstName" },
                new QueryArgument<NonNullGraphType<StringGraphType>> { Name = "lastName" }
            ))
            .ResolveAsync(
                async context =>
                {
                    try
                    {
                        var userId = context.GetArgument<int>("id");
                        var email = context.GetArgument<string>("email");
                        var firstName = context.GetArgument<string>("firstName");
                        var lastName = context.GetArgument<string>("lastName");
                        var user = new User()
                            { Id = userId, Email = email, FirstName = firstName, LastName = lastName };


                        return await repository.EditUser(user);
                    }
                    catch (KeyNotFoundException ex)
                    {
                        context.Errors.Add(new ExecutionError(ex.Message));
                        return null;
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine(ex);
                        context.Errors.Add(new ExecutionError("An unexpected error occurred."));
                        return null;
                    }
                });
        
        Field<BooleanGraphType>("changePassword")
            .Arguments(new QueryArguments(
                new QueryArgument<NonNullGraphType<StringGraphType>> { Name = "password" },
                new QueryArgument<NonNullGraphType<StringGraphType>> { Name = "newPassword" }
            ))
            .ResolveAsync(
                async context =>
                {
                    try
                    {
                        var user = context.UserContext["User"] as User;
                        var password = context.GetArgument<string>("password");
                        var newPassword = context.GetArgument<string>("newPassword");

                        if (user == null)
                        {
                            throw new AuthenticationException("You are not authorized.");
                        }
                        
                        return await repository.ChangePassword(user, password, newPassword);
                    }
                    catch (AuthenticationException ex)
                    {
                        context.Errors.Add(new ExecutionError(ex.Message));
                        return null;
                    }
                    catch (ArgumentException ex)
                    {
                        context.Errors.Add(new ExecutionError(ex.Message));
                        return null;
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine(ex);
                        context.Errors.Add(new ExecutionError("An unexpected error occurred."));
                        return null;
                    }
                });

        this.AddAuthorization();
    }
}