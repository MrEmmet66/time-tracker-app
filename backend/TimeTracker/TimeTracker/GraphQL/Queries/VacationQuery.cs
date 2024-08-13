using GraphQL;
using GraphQL.Types;
using TimeTracker.Constants;
using TimeTracker.Extensions;
using TimeTracker.GraphQL.Types;
using TimeTracker.Repositories.Infrastructure;

namespace TimeTracker.GraphQL.Queries;

public class VacationQuery : ObjectGraphType
{
    public VacationQuery(IVacationRepository vacationRepository)
    {
        Field<ListGraphType<VacationType>>("vacations")
            .AuthorizeWithPermissions(Permissions.ApproveVacations)
            .ResolveAsync(async context => await vacationRepository.GetAll())
            .Description("Get All Vacations");
        
        Field<VacationType>("vacation")
            .Arguments(new QueryArguments(new QueryArgument<NonNullGraphType<IdGraphType>> { Name = "id" }))
            .ResolveAsync(async context =>
            {
                try
                {
                    var id = context.GetArgument<int>("id");
                    return await vacationRepository.GetById(id);

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
            }).Description("Get Vacation by ID");

        Field<ListGraphType<VacationType>>("userVacations")
            .Arguments(new QueryArguments(new QueryArgument<NonNullGraphType<IdGraphType>> { Name = "userId" }))
            .ResolveAsync(async context =>
            {
                var userId = context.GetArgument<int>("userId");
                return await vacationRepository.GetUserVacations(userId);
            }).Description("Get All Vacations of given User");
        
        Field<VacationType>("lastUserVacation")
            .Arguments(new QueryArguments(new QueryArgument<NonNullGraphType<IdGraphType>> { Name = "userId" }))
            .ResolveAsync(async context =>
            {
                var userId = context.GetArgument<int>("userId");
                return await vacationRepository.GetLastUserVacation(userId);
            }).Description("Get Last Vacation of given User");
        
        this.AddAuthorization();
    }
}