# Build stage
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Copy csproj files and restore dependencies
COPY ["ContribuyenteApi.Api/ContribuyenteApi.Api.csproj", "ContribuyenteApi.Api/"]
COPY ["ContribuyenteApi.Application/ContribuyenteApi.Application.csproj", "ContribuyenteApi.Application/"]
COPY ["ContribuyenteApi.Domain/ContribuyenteApi.Domain.csproj", "ContribuyenteApi.Domain/"]
COPY ["ContribuyenteApi.Infrastructure/ContribuyenteApi.Infrastructure.csproj", "ContribuyenteApi.Infrastructure/"]

RUN dotnet restore "ContribuyenteApi.Api/ContribuyenteApi.Api.csproj"

# Copy everything else and build
COPY . .
WORKDIR "/src/ContribuyenteApi.Api"
RUN dotnet build "ContribuyenteApi.Api.csproj" -c Release -o /app/build

# Publish stage
FROM build AS publish
RUN dotnet publish "ContribuyenteApi.Api.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Final stage
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "ContribuyenteApi.Api.dll"]
