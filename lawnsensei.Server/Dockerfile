# Use the official .NET image with the ASP.NET Core runtime
FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS base
WORKDIR /app
EXPOSE 80

# Use the official .NET SDK image to build the app
FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /src
COPY ["lawnsensei.Server/lawnsensei.Server.csproj", "lawnsensei.Server/"]
RUN dotnet restore "lawnsensei.Server/lawnsensei.Server.csproj"

# Copy the rest of the application and build it
COPY . .
WORKDIR "/src/lawnsensei.Server"
RUN dotnet build "lawnsensei.Server.csproj" -c Release -o /app/build

# Publish the app
FROM build AS publish
RUN dotnet publish "lawnsensei.Server.csproj" -c Release -o /app/publish

# Use the runtime image to run the app
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "lawnsensei.Server.dll"]
