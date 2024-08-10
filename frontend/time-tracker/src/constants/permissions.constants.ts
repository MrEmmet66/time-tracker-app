export const enum PERMISSIONS {
    APPROVE_VACATIONS = "approve_vacations",
    APPROVE_SICK_LEAVES_TEAM_MEMBERS = "approve_sick_leaves_team_members",
    APPROVE_SICK_LEAVES_ALL_MEMBERS = "approve_sick_leaves_all_members",
    MANAGE_TEAM_MEMBERS = "manage_team_members",
    MANAGE_ALL_MEMBERS = "manage_all_members",
    GENERATE_REPORTS = "generate_reports",
    GENERATE_ALL_REPORTS = "generate_all_reports",
    VIEW_ALL_TIME_ENTRIES = "view_all_time_entries",
    VIEW_TEAM_TIME_ENTRIES = "view_team_time_entries",
}

export const permissions = [
    {key: PERMISSIONS.APPROVE_VACATIONS, value: "Approve Vacations"},
    {
        key: PERMISSIONS.APPROVE_SICK_LEAVES_TEAM_MEMBERS,
        value: "Approve Sick Leaves Team Members",
    },
    {
        key: PERMISSIONS.APPROVE_SICK_LEAVES_ALL_MEMBERS,
        value: "Approve Sick Leaves All Members",
    },
    {key: PERMISSIONS.MANAGE_TEAM_MEMBERS, value: "Manage Team Members"},
    {key: PERMISSIONS.MANAGE_ALL_MEMBERS, value: "Manage All Members"},
    {key: PERMISSIONS.GENERATE_REPORTS, value: "Generate Reports"},
    {key: PERMISSIONS.GENERATE_ALL_REPORTS, value: "Generate All Reports"},
    {key: PERMISSIONS.VIEW_ALL_TIME_ENTRIES, value: "View All Time Entries"},
    {key: PERMISSIONS.VIEW_TEAM_TIME_ENTRIES, value: "View Team Time Entries"},
];
