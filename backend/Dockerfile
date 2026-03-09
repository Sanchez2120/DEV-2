# Backend Dockerfile
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS base
WORKDIR /app
EXPOSE 8080

FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY ["Asisya.Api/Asisya.Api.csproj", "Asisya.Api/"]
COPY ["Asisya.Application/Asisya.Application.csproj", "Asisya.Application/"]
COPY ["Asisya.Domain/Asisya.Domain.csproj", "Asisya.Domain/"]
COPY ["Asisya.Infrastructure/Asisya.Infrastructure.csproj", "Asisya.Infrastructure/"]
RUN dotnet restore "Asisya.Api/Asisya.Api.csproj"

COPY . .
WORKDIR "/src/Asisya.Api"
RUN dotnet build "Asisya.Api.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "Asisya.Api.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Asisya.Api.dll"]
