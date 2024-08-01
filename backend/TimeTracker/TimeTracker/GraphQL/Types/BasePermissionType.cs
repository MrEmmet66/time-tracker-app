using GraphQL.Types;
using TimeTracker.Models;

namespace TimeTracker.GraphQL.Queries;

public class BasePermissionType : ObjectGraphType<BasePermission>
{
    public BasePermissionType()
    {
        Field(x => x.Name, type: typeof(StringGraphType)).Description("Permission name");
    }
}