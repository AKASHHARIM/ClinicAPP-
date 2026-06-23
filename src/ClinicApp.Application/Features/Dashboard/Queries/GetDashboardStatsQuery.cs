using ClinicApp.Application.Common.Interfaces;
using ClinicApp.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace ClinicApp.Application.Features.Dashboard.Queries;

public record GetDashboardStatsQuery : IRequest<DashboardStatsDto>;

public class DashboardStatsDto
{
    public int TotalDoctors { get; set; }
    public int TotalPatients { get; set; }
    public int TotalAppointments { get; set; }
    public int TodayAppointments { get; set; }
    public int PendingAppointments { get; set; }
    public int CompletedAppointments { get; set; }
}

public class GetDashboardStatsQueryHandler : IRequestHandler<GetDashboardStatsQuery, DashboardStatsDto>
{
    private readonly IApplicationDbContext _context;

    public GetDashboardStatsQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<DashboardStatsDto> Handle(GetDashboardStatsQuery request, CancellationToken cancellationToken)
    {
        var today = DateTime.Today;

        return new DashboardStatsDto
        {
            TotalDoctors = await _context.Doctors.CountAsync(cancellationToken),
            TotalPatients = await _context.Patients.CountAsync(cancellationToken),
            TotalAppointments = await _context.Appointments.CountAsync(cancellationToken),
            TodayAppointments = await _context.Appointments.CountAsync(a => a.AppointmentDate.Date == today, cancellationToken),
            PendingAppointments = await _context.Appointments.CountAsync(a => a.Status == AppointmentStatus.Pending, cancellationToken),
            CompletedAppointments = await _context.Appointments.CountAsync(a => a.Status == AppointmentStatus.Completed, cancellationToken),
        };
    }
}