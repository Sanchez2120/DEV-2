using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Asisya.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class CompleteNorthwindSchema : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Phone",
                table: "Employees",
                newName: "TitleOfCourtesy");

            migrationBuilder.AddColumn<string>(
                name: "HomePage",
                table: "Suppliers",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PostalCode",
                table: "Suppliers",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Region",
                table: "Suppliers",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "Discontinued",
                table: "Products",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "QuantityPerUnit",
                table: "Products",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ReorderLevel",
                table: "Products",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "UnitsOnOrder",
                table: "Products",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "ShipPostalCode",
                table: "Orders",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ShipRegion",
                table: "Orders",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Extension",
                table: "Employees",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "HomePhone",
                table: "Employees",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Notes",
                table: "Employees",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Photo",
                table: "Employees",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PostalCode",
                table: "Employees",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Region",
                table: "Employees",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ReportsTo",
                table: "Employees",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PostalCode",
                table: "Customers",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Region",
                table: "Customers",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "HomePage",
                table: "Suppliers");

            migrationBuilder.DropColumn(
                name: "PostalCode",
                table: "Suppliers");

            migrationBuilder.DropColumn(
                name: "Region",
                table: "Suppliers");

            migrationBuilder.DropColumn(
                name: "Discontinued",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "QuantityPerUnit",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "ReorderLevel",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "UnitsOnOrder",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "ShipPostalCode",
                table: "Orders");

            migrationBuilder.DropColumn(
                name: "ShipRegion",
                table: "Orders");

            migrationBuilder.DropColumn(
                name: "Extension",
                table: "Employees");

            migrationBuilder.DropColumn(
                name: "HomePhone",
                table: "Employees");

            migrationBuilder.DropColumn(
                name: "Notes",
                table: "Employees");

            migrationBuilder.DropColumn(
                name: "Photo",
                table: "Employees");

            migrationBuilder.DropColumn(
                name: "PostalCode",
                table: "Employees");

            migrationBuilder.DropColumn(
                name: "Region",
                table: "Employees");

            migrationBuilder.DropColumn(
                name: "ReportsTo",
                table: "Employees");

            migrationBuilder.DropColumn(
                name: "PostalCode",
                table: "Customers");

            migrationBuilder.DropColumn(
                name: "Region",
                table: "Customers");

            migrationBuilder.RenameColumn(
                name: "TitleOfCourtesy",
                table: "Employees",
                newName: "Phone");
        }
    }
}
