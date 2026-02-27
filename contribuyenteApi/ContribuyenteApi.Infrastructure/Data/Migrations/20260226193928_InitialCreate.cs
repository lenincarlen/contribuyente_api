using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ContribuyenteApi.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Contribuyentes",
                columns: table => new
                {
                    RncCedula = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Nombre = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Tipo = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Estatus = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Contribuyentes", x => x.RncCedula);
                });

            migrationBuilder.CreateTable(
                name: "ComprobantesFiscales",
                columns: table => new
                {
                    Ncf = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    RncCedula = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Monto = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Itbis18 = table.Column<decimal>(type: "decimal(18,2)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ComprobantesFiscales", x => x.Ncf);
                    table.ForeignKey(
                        name: "FK_ComprobantesFiscales_Contribuyentes_RncCedula",
                        column: x => x.RncCedula,
                        principalTable: "Contribuyentes",
                        principalColumn: "RncCedula",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ComprobantesFiscales_RncCedula",
                table: "ComprobantesFiscales",
                column: "RncCedula");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ComprobantesFiscales");

            migrationBuilder.DropTable(
                name: "Contribuyentes");
        }
    }
}
