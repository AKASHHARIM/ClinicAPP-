using AutoMapper;
using AutoMapper.QueryableExtensions;
using ClinicApp.Application.Common.Interfaces;
using ClinicApp.Shared.DTOs.Appointment;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace ClinicApp.Application.Features.Appointments.Queries;

public record GetAppointmentsQuery(int? DoctorId = null, int? PatientId = null) : IRequest<List<AppointmentDto>>;

public class GetAppointmentsQueryHandler : IRequestHandler<GetAppointmentsQuery, List<AppointmentDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetAppointmentsQueryHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<List<AppointmentDto>> Handle(GetAppointmentsQuery request, CancellationToken cancellationToken)
    {
        var query = _context.Appointments
            .Include(a => a.Patient)
            .Include(a => a.Doctor)
            .AsQueryable();

        if (request.DoctorId.HasValue)
            query = query.Where(a => a.DoctorId == request.DoctorId);

        if (request.PatientId.HasValue)
            query = query.Where(a => a.PatientId == request.PatientId);

        return await query
            .OrderByDescending(a => a.AppointmentDate)
            .ProjectTo<AppointmentDto>(_mapper.ConfigurationProvider)
            .ToListAsync(cancellationToken);
    }
}