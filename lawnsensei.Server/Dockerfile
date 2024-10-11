# Use the .NET SDK to build and publish
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

# Copy the csproj and restore
COPY lawnsensei.Server/lawnsensei.Server.csproj lawnsensei.Server/
RUN dotnet restore lawnsensei.Server/lawnsensei.Server.csproj

# Copy the rest of the source code
COPY lawnsensei.Server/ ./
RUN dotnet publish lawnsensei.Server.csproj -c Release -o /app/publish

# Use the ASP.NET runtime to serve the app
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "lawnsensei.Server.dll"]
