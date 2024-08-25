using System.Security.Authentication;
using GraphQL;
using GraphQL.Types;
using TimeTracker.Extensions;
using TimeTracker.GraphQL.Types;
using TimeTracker.Models;
using TimeTracker.Repositories.Infrastructure;

namespace TimeTracker.GraphQL.Mutations;

public class ScheduleMutation : ObjectGraphType
{
    public ScheduleMutation(IScheduleRepository repository)
    {
        Field<ScheduleItemType>("createScheduleItem").Arguments(new QueryArguments(
            new QueryArgument<NonNullGraphType<StringGraphType>> { Name = "title" },
            new QueryArgument<StringGraphType> { Name = "description" },
            new QueryArgument<NonNullGraphType<DateTimeOffsetGraphType>> { Name = "eventStart" },
            new QueryArgument<NonNullGraphType<DateTimeOffsetGraphType>> { Name = "eventEnd" }
        )).ResolveAsync(async context =>
        {
            try
            {
                var title = context.GetArgument<string>("title");
                var description = context.GetArgument<string?>("description");
                var eventStart = context.GetArgument<DateTimeOffset>("eventStart");
                var eventEnd = context.GetArgument<DateTimeOffset>("eventEnd");
                var user = context.UserContext["User"] as User;
                
                if (user == null)
                {
                    throw new AuthenticationException("");
                }

                var scheduleItem = new ScheduleItem()
                {
                    Title = title,
                    Description = description,
                    EventStart = eventStart,
                    EventEnd = eventEnd,
                    User = user
                };

                return await repository.Create(scheduleItem);
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }
        });

        Field<ScheduleItemType>("updateScheduleItem").Arguments(new QueryArguments(
            new QueryArgument<NonNullGraphType<IdGraphType>> { Name = "id" },
            new QueryArgument<NonNullGraphType<StringGraphType>> { Name = "title" },
            new QueryArgument<StringGraphType> { Name = "description" },
            new QueryArgument<NonNullGraphType<DateTimeOffsetGraphType>> { Name = "eventStart" },
            new QueryArgument<NonNullGraphType<DateTimeOffsetGraphType>> { Name = "eventEnd" }
        )).ResolveAsync(async context =>
        {
            try
            {
                var id = context.GetArgument<int>("id");
                var title = context.GetArgument<string>("title");
                var description = context.GetArgument<string?>("description");
                var eventStart = context.GetArgument<DateTimeOffset>("eventStart");
                var eventEnd = context.GetArgument<DateTimeOffset>("eventEnd");
                var user = context.UserContext["User"] as User;
                
                if (user == null)
                {
                    throw new AuthenticationException("");
                }

                var item = await repository.GetById(user.Id);

                if (item.User.Id != user.Id)
                {
                    throw new Exception("");
                }

                var scheduleItem = new ScheduleItem()
                {
                    Id = id,
                    Title = title,
                    Description = description,
                    EventStart = eventStart,
                    EventEnd = eventEnd,
                };

                return await repository.Update(scheduleItem);
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }
        });
        
        Field<ScheduleItemType>("deleteScheduleItem").Arguments(new QueryArguments(
            new QueryArgument<NonNullGraphType<IdGraphType>> { Name = "id" }
        )).ResolveAsync(async context =>
        {
            try
            {
                var id = context.GetArgument<int>("id");
                var user = context.UserContext["User"] as User;
                
                if (user == null)
                {
                    throw new AuthenticationException("");
                }

                var item = await repository.GetById(user.Id);

                if (item.User.Id != user.Id)
                {
                    throw new Exception("");
                }

                return await repository.DeleteById(id);
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }
        });

        this.AddAuthorization();
    }
}