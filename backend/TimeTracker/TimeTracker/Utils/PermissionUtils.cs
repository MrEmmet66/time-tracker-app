using System.Text.Json;
using TimeTracker.Factories;
using TimeTracker.Models;

namespace TimeTracker.Utils;

public class PermissionUtils : IPermissionUtils
{
    public string SerializePermissions(List<BasePermission> permissions)
    {
        if (permissions == null || !permissions.Any())
        {
            return "[]";
        }

        var permissionNames = permissions.Select(p => p.Name).ToList();
        return JsonSerializer.Serialize(permissionNames);
    }

    public List<BasePermission> DeserializePermissions(string permissionsJson)
    {
        if (string.IsNullOrEmpty(permissionsJson))
        {
            return new List<BasePermission>();
        }

        var permissionNames = JsonSerializer.Deserialize<List<string>>(permissionsJson);
        var list = permissionNames.Select(PermissionFactory.Create).ToList();

        return list;
    }
}