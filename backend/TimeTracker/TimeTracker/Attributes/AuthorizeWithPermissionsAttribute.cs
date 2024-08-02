namespace TimeTracker.Attributes;

// [AttributeUsage(AttributeTargets.Method, Inherited = false, AllowMultiple = true)]
[AttributeUsage(AttributeTargets.Method, AllowMultiple = true)]
public class AuthorizeWithPermissionsAttribute : Attribute
{
    public string[] Permissions { get; }

    public AuthorizeWithPermissionsAttribute(params string[] permissions)
    {
        Permissions = permissions;
    }
}