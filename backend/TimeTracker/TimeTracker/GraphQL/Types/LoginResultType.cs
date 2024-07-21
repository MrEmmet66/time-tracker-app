using GraphQL.Types;
using TimeTracker.Models;

namespace TimeTracker.GraphQL.Types;

public class LoginResultType : ObjectGraphType<LoginResult>
{
    public LoginResultType()
    {
        Field(x => x.Token).Description("JWT token");
        Field<UserType>("user", "The authenticated user");
    }
}