using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Marketplace.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddLocationFieldsToListing : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Address",
                table: "Listings",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "City",
                table: "Listings",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "HasFixedLocation",
                table: "Listings",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<double>(
                name: "Latitude",
                table: "Listings",
                type: "double precision",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "Longitude",
                table: "Listings",
                type: "double precision",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Quarter",
                table: "Listings",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Address",
                table: "Listings");

            migrationBuilder.DropColumn(
                name: "City",
                table: "Listings");

            migrationBuilder.DropColumn(
                name: "HasFixedLocation",
                table: "Listings");

            migrationBuilder.DropColumn(
                name: "Latitude",
                table: "Listings");

            migrationBuilder.DropColumn(
                name: "Longitude",
                table: "Listings");

            migrationBuilder.DropColumn(
                name: "Quarter",
                table: "Listings");
        }
    }
}
