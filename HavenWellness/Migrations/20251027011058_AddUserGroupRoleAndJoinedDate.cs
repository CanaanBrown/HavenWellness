using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HavenWellness.Migrations
{
    /// <inheritdoc />
    public partial class AddUserGroupRoleAndJoinedDate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "JoinedDate",
                table: "UserGroups",
                type: "TEXT",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "Role",
                table: "UserGroups",
                type: "TEXT",
                maxLength: 20,
                nullable: false,
                defaultValue: "");

            migrationBuilder.UpdateData(
                table: "Groups",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedDate",
                value: new DateTime(2025, 10, 27, 1, 10, 57, 0, DateTimeKind.Utc).AddTicks(5521));

            migrationBuilder.UpdateData(
                table: "UserGroups",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "JoinedDate", "Role" },
                values: new object[] { new DateTime(2025, 10, 27, 1, 10, 57, 0, DateTimeKind.Utc).AddTicks(5598), "Member" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "JoinedDate",
                table: "UserGroups");

            migrationBuilder.DropColumn(
                name: "Role",
                table: "UserGroups");

            migrationBuilder.UpdateData(
                table: "Groups",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedDate",
                value: new DateTime(2025, 10, 26, 23, 43, 9, 424, DateTimeKind.Utc).AddTicks(6503));
        }
    }
}
