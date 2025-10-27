using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HavenWellness.Migrations
{
    /// <inheritdoc />
    public partial class FixPairingUniqueConstraints : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Pairings_GroupId_User1Id",
                table: "Pairings");

            migrationBuilder.DropIndex(
                name: "IX_Pairings_GroupId_User2Id",
                table: "Pairings");

            migrationBuilder.UpdateData(
                table: "Groups",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedDate",
                value: new DateTime(2025, 10, 27, 5, 2, 55, 555, DateTimeKind.Utc).AddTicks(38));

            migrationBuilder.UpdateData(
                table: "UserGroups",
                keyColumn: "Id",
                keyValue: 1,
                column: "JoinedDate",
                value: new DateTime(2025, 10, 27, 5, 2, 55, 555, DateTimeKind.Utc).AddTicks(54));

            migrationBuilder.CreateIndex(
                name: "IX_Pairings_GroupId_User1Id_IsActive",
                table: "Pairings",
                columns: new[] { "GroupId", "User1Id", "IsActive" },
                unique: true,
                filter: "IsActive = 1");

            migrationBuilder.CreateIndex(
                name: "IX_Pairings_GroupId_User2Id_IsActive",
                table: "Pairings",
                columns: new[] { "GroupId", "User2Id", "IsActive" },
                unique: true,
                filter: "IsActive = 1");

            migrationBuilder.CreateIndex(
                name: "IX_Pairings_IsActive",
                table: "Pairings",
                column: "IsActive");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Pairings_GroupId_User1Id_IsActive",
                table: "Pairings");

            migrationBuilder.DropIndex(
                name: "IX_Pairings_GroupId_User2Id_IsActive",
                table: "Pairings");

            migrationBuilder.DropIndex(
                name: "IX_Pairings_IsActive",
                table: "Pairings");

            migrationBuilder.UpdateData(
                table: "Groups",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedDate",
                value: new DateTime(2025, 10, 27, 4, 53, 39, 336, DateTimeKind.Utc).AddTicks(9516));

            migrationBuilder.UpdateData(
                table: "UserGroups",
                keyColumn: "Id",
                keyValue: 1,
                column: "JoinedDate",
                value: new DateTime(2025, 10, 27, 4, 53, 39, 336, DateTimeKind.Utc).AddTicks(9539));

            migrationBuilder.CreateIndex(
                name: "IX_Pairings_GroupId_User1Id",
                table: "Pairings",
                columns: new[] { "GroupId", "User1Id" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Pairings_GroupId_User2Id",
                table: "Pairings",
                columns: new[] { "GroupId", "User2Id" },
                unique: true);
        }
    }
}
