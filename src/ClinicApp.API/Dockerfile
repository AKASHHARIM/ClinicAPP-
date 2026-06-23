FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 8080

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["src/ClinicApp.API/ClinicApp.API.csproj", "src/ClinicApp.API/"]
COPY ["src/ClinicApp.Application/ClinicApp.Application.csproj", "src/ClinicApp.Application/"]
COPY ["src/ClinicApp.Domain/ClinicApp.Domain.csproj", "src/ClinicApp.Domain/"]
COPY ["src/ClinicApp.Infrastructure/ClinicApp.Infrastructure.csproj", "src/ClinicApp.Infrastructure/"]
COPY ["src/ClinicApp.Shared/ClinicApp.Shared.csproj", "src/ClinicApp.Shared/"]
RUN dotnet restore "src/ClinicApp.API/ClinicApp.API.csproj"
COPY . .
RUN dotnet build "src/ClinicApp.API/ClinicApp.API.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "src/ClinicApp.API/ClinicApp.API.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "ClinicApp.API.dll"]