FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS base
WORKDIR /app
EXPOSE 80

FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /src
COPY ["lawnsensei.Server.csproj", "./"]
RUN dotnet restore "lawnsensei.Server.csproj"
COPY . .
WORKDIR "/src/lawnsensei.Server"
RUN dotnet build "lawnsensei.Server.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "lawnsensei.Server.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "lawnsensei.Server.dll"]
