using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HavenWellness.Migrations
{
    /// <inheritdoc />
    public partial class AddPairingModel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Pairings",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    GroupId = table.Column<int>(type: "INTEGER", nullable: false),
                    User1Id = table.Column<int>(type: "INTEGER", nullable: false),
                    User2Id = table.Column<int>(type: "INTEGER", nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "TEXT", nullable: false),
                    IsActive = table.Column<bool>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Pairings", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Pairings_Groups_GroupId",
                        column: x => x.GroupId,
                        principalTable: "Groups",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Pairings_Users_User1Id",
                        column: x => x.User1Id,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Pairings_Users_User2Id",
                        column: x => x.User2Id,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.UpdateData(
                table: "Groups",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedDate",
                value: new DateTime(2025, 10, 27, 2, 24, 57, 925, DateTimeKind.Utc).AddTicks(4853));

            migrationBuilder.UpdateData(
                table: "UserGroups",
                keyColumn: "Id",
                keyValue: 1,
                column: "JoinedDate",
                value: new DateTime(2025, 10, 27, 2, 24, 57, 925, DateTimeKind.Utc).AddTicks(4901));

            migrationBuilder.CreateIndex(
                name: "IX_Pairings_GroupId",
                table: "Pairings",
                column: "GroupId");

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

            migrationBuilder.CreateIndex(
                name: "IX_Pairings_User1Id",
                table: "Pairings",
                column: "User1Id");

            migrationBuilder.CreateIndex(
                name: "IX_Pairings_User2Id",
                table: "Pairings",
                column: "User2Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Pairings");

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
                column: "JoinedDate",
                value: new DateTime(2025, 10, 27, 1, 10, 57, 0, DateTimeKind.Utc).AddTicks(5598));
        }
    }
}
