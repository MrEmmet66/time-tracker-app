using GraphQL;
using GraphQL.Types;
using TimeTracker.Models;

namespace TimeTracker.GraphQL.Types;

public class UserType : ObjectGraphType<User>
{
    public UserType()
    {
        Field(x => x.Id, type: typeof(IdGraphType)).Description("User Id.");
        Field(x => x.Email, type: typeof(IdGraphType)).Description("User email.");
        Field(x => x.FirstName, type: typeof(IdGraphType)).Description("User first name.");
        Field(x => x.LastName, type: typeof(IdGraphType)).Description("User last name.");
        Field(x => x.Permissions, type: typeof(IdGraphType)).Description("User permissions.");
    }
}