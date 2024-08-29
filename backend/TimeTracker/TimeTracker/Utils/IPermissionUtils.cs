using TimeTracker.Models;

namespace TimeTracker.Utils;

public interface IPermissionUtils
{
    public string SerializePermissions(List<BasePermission> permissions);
    public List<BasePermission> DeserializePermissions(string permissionsJson);
}