using System.Data;
using Dapper;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Options;
using TimeTracker.Configuration;

namespace TimeTracker.Data;

public class DataContext
{
    private readonly string _connectionString;
    private DbSettings _dbSettings;

    public DataContext(IOptions<DbSettings> dbSettings)
    {
        _dbSettings = dbSettings.Value;
        _connectionString =
            $"Server={_dbSettings.Server}; Database={_dbSettings.Database}; User Id={_dbSettings.UserId}; Trusted_Connection=True; Password={_dbSettings.Password}; TrustServerCertificate=true";
    }

    public IDbConnection CreateConnection()
        => new SqlConnection(_connectionString);

    public async Task Init()
    {
        await InitDatabase();
        await InitTables();
    }

    private async Task InitDatabase()
    {
        try
        {
            var connectionString =
                $"Server={_dbSettings.Server}; Database={_dbSettings.Database}; User Id={_dbSettings.UserId}; Password={_dbSettings.Password}; TrustServerCertificate=true";
            using var connection = new SqlConnection(connectionString);
            var sql =
                $"IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = '{_dbSettings.Database}') CREATE DATABASE [{_dbSettings.Database}];";
            await connection.ExecuteAsync(sql);
        }
        catch (Exception e)
        {
            Console.WriteLine($"Error creating database: {e.Message}");
            throw;
        }
    }

    private async Task InitTables()
    {
        try
        {
            using var connection = CreateConnection();
            var sql = @"
                IF OBJECT_ID('Teams', 'U') IS NULL
                CREATE TABLE Teams
                (
                    Id INT NOT NULL IDENTITY(1,1),
                    Name NVARCHAR(50) NOT NULL UNIQUE,
                    CONSTRAINT PK_Teams PRIMARY KEY (Id)
                );

                IF OBJECT_ID('Users', 'U') IS NULL
                CREATE TABLE Users
                (
                    Id INT NOT NULL IDENTITY(1,1),
                    Email NVARCHAR(250) NOT NULL UNIQUE,
                    PasswordHash nvarchar(MAX) NOT NULL,
                    FirstName NVARCHAR(50) NOT NULL,
                    LastName NVARCHAR(50) NOT NULL,
                    Permissions NVARCHAR(MAX),
                    CONSTRAINT PK_Users PRIMARY KEY (Id)
                );

                IF OBJECT_ID('SickLeave', 'U') IS NULL
                CREATE TABLE SickLeave
                (
                    Id INT NOT NULL IDENTITY(1,1),
                    StartSickLeave DATETIME NOT NULL,
                    EndSickLeave DATETIME NOT NULL,
                    Reason TEXT,
                    UserId INT NOT NULL,
                    CONSTRAINT PK_SickLeave PRIMARY KEY (Id),
                    CONSTRAINT FK_SickLeave_Users FOREIGN KEY (UserId) REFERENCES Users(Id)
                );

                IF OBJECT_ID('TeamUser', 'U') IS NULL
                CREATE TABLE TeamUser
                (
                    UserId INT NOT NULL,
                    TeamId INT NOT NULL,
                    CONSTRAINT FK_TeamUser_Teams FOREIGN KEY (TeamId) REFERENCES Teams(Id),
                    CONSTRAINT FK_TeamUser_Users FOREIGN KEY (UserId) REFERENCES Users(Id)
                );

                IF OBJECT_ID('Vacations', 'U') IS NULL
                CREATE TABLE Vacations
                (
                    Id INT NOT NULL IDENTITY(1,1),
                    StartVacation DATETIME NOT NULL,
                    EndVacation DATETIME NOT NULL,
                    UserId INT NOT NULL,
                    CONSTRAINT PK_Vacations PRIMARY KEY (Id),
                    CONSTRAINT FK_Vacations_Users FOREIGN KEY (UserId) REFERENCES Users(Id)
                );

                IF OBJECT_ID('WorkEntries', 'U') IS NULL
                CREATE TABLE WorkEntries
                (
                    Id INT NOT NULL IDENTITY(1,1),
                    StartTime TIME(0) NOT NULL,
                    EndTime TIME(0) NOT NULL,
                    Date DATE NOT NULL,
                    UserId INT NOT NULL,
                    CONSTRAINT PK_WorkEntries PRIMARY KEY (Id),
                    CONSTRAINT FK_WorkEntries_Users FOREIGN KEY (UserId) REFERENCES Users(Id)
                );

                IF NOT EXISTS (
                    SELECT * 
                    FROM INFORMATION_SCHEMA.COLUMNS 
                    WHERE TABLE_NAME = 'Users' 
                    AND COLUMN_NAME = 'IsActive'
                )
                BEGIN
                    ALTER TABLE Users
                    ADD IsActive BIT NOT NULL DEFAULT 1;
                END

                IF NOT EXISTS (
                    SELECT * 
                    FROM INFORMATION_SCHEMA.COLUMNS 
                    WHERE TABLE_NAME = 'Teams' 
                    AND COLUMN_NAME = 'IsActive'
                )
                BEGIN
                    ALTER TABLE Teams
                    ADD IsActive BIT NOT NULL DEFAULT 1;
                END

                IF NOT EXISTS (
                    SELECT * 
                    FROM INFORMATION_SCHEMA.COLUMNS 
                    WHERE TABLE_NAME = 'TeamUser' 
                    AND COLUMN_NAME = 'IsActive'
                )
                BEGIN
                    ALTER TABLE TeamUser
                    ADD IsActive BIT NOT NULL DEFAULT 1;
                END
            ";
            await connection.ExecuteAsync(sql);
        }
        catch (Exception e)
        {
            Console.WriteLine($"Error creating tables: {e.Message}");
            throw;
        }
    }
}