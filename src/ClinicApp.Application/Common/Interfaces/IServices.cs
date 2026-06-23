using ClinicApp.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace ClinicApp.Application.Common.Interfaces;

public interface IApplicationDbContext
{
    DbSet<Doctor> Doctors { get; }
    DbSet<DoctorSchedule> DoctorSchedules { get; }
    DbSet<Patient> Patients { get; }
    DbSet<Appointment> Appointments { get; }
    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}

public interface ITokenService
{
    string GenerateAccessToken(string userId, string email, IList<string> roles);
    string GenerateRefreshToken();
}