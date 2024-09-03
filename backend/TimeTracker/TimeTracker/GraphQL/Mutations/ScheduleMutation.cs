using System.Security.Authentication;
using GraphQL;
using GraphQL.Types;
using TimeTracker.Constants;
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
                    throw new AuthenticationException("Unauthorized");
                }

                if (eventEnd < eventStart)
                {
                    throw new Exception("The end date of the event cannot be earlier than the start date");
                }

                var maxDeadlineEvent = eventStart + new TimeSpan(8, 0, 0);
                
                if (eventEnd > maxDeadlineEvent)
                {
                    throw new Exception("The event cannot last more than 8 hours");
                }

                var scheduleItem = new ScheduleItem()
                {
                    Title = title,
                    Description = description,
                    EventStart = eventStart,
                    EventEnd = eventEnd,
                    User = user
                };
                
                bool isOverlap = await repository.IsEventOverlap(user.Id, eventStart, eventEnd, -1);

                if (isOverlap)
                {
                    throw new Exception("There is already an event in this period of time");
                }
                
                var (totalHours, totalMinutes) = await repository.GetTotalTimeByDate(user.Id, eventStart);
                var eventDuration = (eventEnd - eventStart);
                var newTotalWorkingTimeDay = new TimeSpan(totalHours, totalMinutes, 0) + eventDuration;

                if (newTotalWorkingTimeDay.Hours > WorkSchedules.MaxWorkHoursPerDay ||
                    newTotalWorkingTimeDay.Hours >= WorkSchedules.MaxWorkHoursPerDay &&
                    newTotalWorkingTimeDay.Minutes > 0)
                {
                    throw new Exception("Your working hours will exceed 8 hours");
                }

                return await repository.Create(scheduleItem);
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                context.Errors.Add(new ExecutionError(e.Message));
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
                    throw new AuthenticationException("Unauthorized");
                }
                
                if (eventEnd < eventStart)
                {
                    throw new Exception("The end date of the event cannot be earlier than the start date");
                }
                
                var maxDeadlineEvent = eventStart + new TimeSpan(8, 0, 0);
                
                if (eventEnd > maxDeadlineEvent)
                {
                    throw new Exception("The event cannot last more than 8 hours");
                }

                var scheduleItem = await repository.GetById(id);

                if (scheduleItem.User.Id != user.Id)
                {
                    throw new Exception("Forbidden");
                }
                
                bool isOverlap = await repository.IsEventOverlap(user.Id, eventStart, eventEnd, id);

                if (isOverlap)
                {
                    throw new Exception("There is already an event in this period of time");
                }

                var (hours, minutes) = await repository.GetTotalTimeByDate(user.Id, eventStart);
                var durationEventsDay = scheduleItem.EventEnd - scheduleItem.EventStart;
                var totalDuration = new TimeSpan(hours, minutes, 0) - durationEventsDay;
                var durationEvent = (eventEnd - eventStart);
                var newTotalTimeDay = totalDuration + durationEvent;

                if (newTotalTimeDay.Hours > WorkSchedules.MaxWorkHoursPerDay ||
                    newTotalTimeDay.Hours >= WorkSchedules.MaxWorkHoursPerDay && newTotalTimeDay.Minutes > 0)
                {
                    throw new Exception("Your working hours will exceed 8 hours");
                }

                var newScheduleItem = new ScheduleItem()
                {
                    Id = id,
                    Title = title,
                    Description = description,
                    EventStart = eventStart,
                    EventEnd = eventEnd,
                };

                return await repository.Update(newScheduleItem);
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                context.Errors.Add(new ExecutionError(e.Message));
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
                    throw new AuthenticationException("Unauthorized");
                }

                var item = await repository.GetById(user.Id);

                if (item.User.Id != user.Id)
                {
                    throw new Exception("Forbidden");
                }

                return await repository.DeleteById(id);
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                context.Errors.Add(new ExecutionError(e.Message));
                throw;
            }
        });

        this.AddAuthorization();
    }
}