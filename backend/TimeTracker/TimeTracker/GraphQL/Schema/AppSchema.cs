using TimeTracker.GraphQL.Mutations;
using TimeTracker.GraphQL.Queries;

namespace TimeTracker.GraphQL.Schema;

public class AppSchema : global::GraphQL.Types.Schema
{
    public AppSchema(IServiceProvider provider)
        : base(provider)
    {
        Query = provider.GetRequiredService<AppQuery>();
        Mutation = provider.GetRequiredService<AppMutation>();
    }
}