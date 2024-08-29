using System.Security.Claims;
using GraphQL;
using GraphQL.Builders;
using GraphQL.Resolvers;
using GraphQL.Types;
using TimeTracker.Attributes;
using TimeTracker.Models;

namespace TimeTracker.Extensions;

public static class GraphQLAuthorizationExtensions
{
    public static FieldBuilder<TSourceType, TReturnType> AuthorizeWithPermissions<TSourceType, TReturnType>(
        this FieldBuilder<TSourceType, TReturnType> builder,
        params string[] permissions)
    {
        var attribute = new AuthorizeWithPermissionsAttribute(permissions);
        return builder.AuthorizeWith(attribute);
    }

    public static FieldBuilder<TSourceType, TReturnType> AuthorizeWith<TSourceType, TReturnType>(
        this FieldBuilder<TSourceType, TReturnType> builder,
        AuthorizeWithPermissionsAttribute attribute)
    {
        builder.FieldType.Metadata["AuthorizeWithPermissions"] = attribute;
        return builder;
    }

    public static void AddAuthorization(this ObjectGraphType type)
    {
        foreach (var field in type.Fields)
        {
            if (field.Metadata.TryGetValue("AuthorizeWithPermissions", out var value))
            {
                var attribute = value as AuthorizeWithPermissionsAttribute;
                var permissions = attribute?.Permissions;
                var originalResolver = field.Resolver;

                field.Resolver = new FuncFieldResolver<object>(async context =>
                {
                    var user = context.UserContext["User"] as User;

                    if (user == null)
                    {
                        throw new ExecutionError("User is not authenticated");
                    }

                    if (user.Permissions == null)
                    {
                        throw new ExecutionError("User does not have any permissions");
                    }

                    if (permissions != null && permissions.Length > 0 &&
                        !permissions.All(p => user.Permissions.Any(up => up.Name == p)))
                    {
                        throw new ExecutionError(
                            $"User does not have the required permissions: {string.Join(", ", permissions)}");
                    }

                    return await originalResolver.ResolveAsync(context);
                });
            }
        }
    }
}