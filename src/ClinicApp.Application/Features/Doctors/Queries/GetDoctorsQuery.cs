using AutoMapper;
using AutoMapper.QueryableExtensions;
using ClinicApp.Application.Common.Interfaces;
using ClinicApp.Shared.DTOs.Doctor;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace ClinicApp.Application.Features.Doctors.Queries;

public record GetDoctorsQuery : IRequest<List<DoctorDto>>;

public class GetDoctorsQueryHandler : IRequestHandler<GetDoctorsQuery, List<DoctorDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetDoctorsQueryHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<List<DoctorDto>> Handle(GetDoctorsQuery request, CancellationToken cancellationToken)
    {
        return await _context.Doctors
            .Where(d => d.IsActive)
            .OrderBy(d => d.FirstName)
            .ProjectTo<DoctorDto>(_mapper.ConfigurationProvider)
            .ToListAsync(cancellationToken);
    }
}