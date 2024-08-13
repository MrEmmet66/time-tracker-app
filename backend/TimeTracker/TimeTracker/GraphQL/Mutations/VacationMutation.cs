﻿using GraphQL;
using GraphQL.Types;
using TimeTracker.Constants;
using TimeTracker.Extensions;
using TimeTracker.GraphQL.Types;
using TimeTracker.Models;
using TimeTracker.Repositories.Infrastructure;

namespace TimeTracker.GraphQL.Mutations;

public class VacationMutation : ObjectGraphType
{
    public VacationMutation(IVacationRepository vacationRepository, IUserRepository userRepository)
    {
        Field<VacationType>("setVacation")
            .Arguments(new QueryArguments(
                new QueryArgument<NonNullGraphType<IdGraphType>> { Name = "userId" },
                new QueryArgument<NonNullGraphType<DateTimeGraphType>> { Name = "startVacation" },
                new QueryArgument<NonNullGraphType<DateTimeGraphType>> { Name = "endVacation" }))
            .ResolveAsync(async context =>
            {
                var userId = context.GetArgument<int>("userId");
                var startVacation = context.GetArgument<DateTime>("startVacation");
                var endVacation = context.GetArgument<DateTime>("endVacation");
                
                User user = await userRepository.GetById(userId);
                Vacation vacation = new Vacation()
                {
                    User = user,
                    StartVacation = startVacation,
                    EndVacation = endVacation
                };
                
                return await vacationRepository.Create(vacation);
            })
            .Description("Set User's Vacation")
            .AuthorizeWithPermissions(Permissions.ApproveVacations);

        Field<VacationType>("removeVacation")
            .Arguments(new QueryArguments(new QueryArgument<NonNullGraphType<IdGraphType>> { Name = "id" }))
            .ResolveAsync(async context =>
            {
                var id = context.GetArgument<int>("id");
                return await vacationRepository.DeleteById(id);
            })
            .Description("Delete Vacation by ID")
            .AuthorizeWithPermissions(Permissions.ApproveVacations);
        
        this.AddAuthorization();
    }
}