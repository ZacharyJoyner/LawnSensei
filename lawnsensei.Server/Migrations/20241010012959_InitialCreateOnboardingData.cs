using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace lawnsensei.Server.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreateOnboardingData : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "OnboardingData",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    UserId = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Address = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ClimateZone = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    LawnSize = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    GrassType = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OnboardingData", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "OnboardingData");
        }
    }
}
