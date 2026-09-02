# Build stage
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /app

# Copy csproj files and restore
COPY src/Marketplace.Api/Marketplace.Api.csproj src/Marketplace.Api/
COPY src/Marketplace.Application/Marketplace.Application.csproj src/Marketplace.Application/
COPY src/Marketplace.Domain/Marketplace.Domain.csproj src/Marketplace.Domain/
COPY src/Marketplace.Infrastructure/Marketplace.Infrastructure.csproj src/Marketplace.Infrastructure/

RUN dotnet restore src/Marketplace.Api/Marketplace.Api.csproj

# Copy everything else
COPY . .

# Publish
RUN dotnet publish src/Marketplace.Api/Marketplace.Api.csproj -c Release -o /app/publish

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app

COPY --from=build /app/publish .

EXPOSE 8080

ENTRYPOINT ["dotnet", "Marketplace.Api.dll"]