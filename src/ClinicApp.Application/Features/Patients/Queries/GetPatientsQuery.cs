using AutoMapper;
using AutoMapper.QueryableExtensions;
using ClinicApp.Application.Common.Interfaces;
using ClinicApp.Shared.DTOs.Appointment;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace ClinicApp.Application.Features.Patients.Queries;

public record GetPatientsQuery : IRequest<List<PatientDto>>;

public class GetPatientsQueryHandler : IRequestHandler<GetPatientsQuery, List<PatientDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetPatientsQueryHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<List<PatientDto>> Handle(GetPatientsQuery request, CancellationToken cancellationToken)
    {
        return await _context.Patients
            .OrderBy(p => p.FirstName)
            .ProjectTo<PatientDto>(_mapper.ConfigurationProvider)
            .ToListAsync(cancellationToken);
    }
}