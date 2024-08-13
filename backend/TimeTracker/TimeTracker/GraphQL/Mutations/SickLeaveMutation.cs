using GraphQL;
using GraphQL.Types;
using TimeTracker.Constants;
using TimeTracker.Extensions;
using TimeTracker.GraphQL.Types;
using TimeTracker.Models;
using TimeTracker.Repositories.Infrastructure;

namespace TimeTracker.GraphQL.Mutations;

public class SickLeaveMutation : ObjectGraphType
{
    public SickLeaveMutation(IUserRepository userRepository, ISickLeaveRepository sickLeaveRepository)
    {
        Field<SickLeaveType>("setSickLeave")
            .Arguments(new QueryArguments(
                new QueryArgument<NonNullGraphType<IdGraphType>> { Name = "userId" },
                new QueryArgument<NonNullGraphType<DateTimeGraphType>> { Name = "startSickLeave" },
                new QueryArgument<NonNullGraphType<DateTimeGraphType>> { Name = "endSickLeave" },
                new QueryArgument<NonNullGraphType<StringGraphType>> {Name = "reason" }))
            .ResolveAsync(async context =>
            {
                var userId = context.GetArgument<int>("userId");
                var startSickLeave = context.GetArgument<DateTime>("startSickLeave");
                var endSickLeave = context.GetArgument<DateTime>("endSickLeave");
                var reason = context.GetArgument<string>("reason");
                
                User user = await userRepository.GetById(userId);
                SickLeave sickLeave = new SickLeave()
                {
                    User = user,
                    StartSickLeave = startSickLeave,
                    EndSickLeave = endSickLeave,
                    Reason = reason
                };
                
                return await sickLeaveRepository.Create(sickLeave);
            })
            .Description("Set User's Sick Leave")
            .AuthorizeWithPermissions(Permissions.ApproveSickLeavesAllMembers, Permissions.ApproveSickLeavesTeamMembers);

        Field<SickLeaveType>("removeSickLeave")
            .Arguments(new QueryArguments(new QueryArgument<NonNullGraphType<IdGraphType>> { Name = "id" }))
            .ResolveAsync(async context =>
            {
                int id = context.GetArgument<int>("id");
                return await sickLeaveRepository.DeleteById(id);
            })
            .Description("Remove Sick Leave by ID")
            .AuthorizeWithPermissions(Permissions.ApproveSickLeavesAllMembers, Permissions.ApproveSickLeavesTeamMembers);
        
        this.AddAuthorization();
    }
    
}