using GraphQL;
using GraphQL.Types;
using TimeTracker.Constants;
using TimeTracker.Extensions;
using TimeTracker.GraphQL.Types;
using TimeTracker.Repositories.Infrastructure;

namespace TimeTracker.GraphQL.Queries;

public class SickLeaveQuery : ObjectGraphType
{
    public SickLeaveQuery(ISickLeaveRepository sickLeaveRepository)
    {
        Field<ListGraphType<SickLeaveType>>("sickLeaves")
            .ResolveAsync(async resolve => await sickLeaveRepository.GetAll())
            .AuthorizeWithPermissions(Permissions.ApproveSickLeavesAllMembers)
            .Description("Get All Sick Leaves");
        
        Field<SickLeaveType>("sickLeave")
            .Arguments(new QueryArguments(new QueryArgument<NonNullGraphType<IdGraphType>> { Name = "id" }))
            .ResolveAsync(async context =>
            {
                try
                {
                    var id = context.GetArgument<int>("id");
                    return await sickLeaveRepository.GetById(id);
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
            }).Description("Get Sick Leave by ID");
        
        Field<ListGraphType<VacationType>>("userSickLeaves")
            .Arguments(new QueryArguments(new QueryArgument<NonNullGraphType<IdGraphType>> { Name = "userId" }))
            .ResolveAsync(async context =>
            {
                var userId = context.GetArgument<int>("userId");
                return await sickLeaveRepository.GetUserSickLeaves(userId);
            }).Description("Get All Sick Leaves of given User");
        
        Field<ListGraphType<SickLeaveType>>("sickLeavesByPage")
            .Arguments(new QueryArguments(
                new QueryArgument<NonNullGraphType<IntGraphType>> { Name = "pageNumber" },
                new QueryArgument<IntGraphType> { Name = "pageSize", DefaultValue = 20 }))
            .ResolveAsync(async context =>
            {
                var pageNumber = context.GetArgument<int>("pageNumber");
                var pageSize = context.GetArgument<int>("pageSize");
                return await sickLeaveRepository.GetSickLeavesByPage(pageNumber, pageSize);
            }).Description("Get Sick Leaves by page number and page size");
        
        Field<SickLeaveType>("lastUserSickLeave")
            .Arguments(new QueryArguments(new QueryArgument<NonNullGraphType<IdGraphType>> { Name = "userId" }))
            .ResolveAsync(async context =>
            {
                var userId = context.GetArgument<int>("userId");
                return await sickLeaveRepository.GetLastUserSickLeave(userId);
            }).Description("Get Last Sick Leave of given User");
        
        this.AddAuthorization();
    }
}