using GraphQL.Types;

namespace TimeTracker.GraphQL.Types;

public class EntitiesResultType<T> : ObjectGraphType where T : IGraphType
{
    public EntitiesResultType()
    {
        Name = $"EntitiesResultType_{typeof(T).Name}";
        Field<ListGraphType<T>>("entities");
        Field<IntGraphType>("totalPages");
    }
}