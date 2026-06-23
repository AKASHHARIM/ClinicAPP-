using AutoMapper;
using ClinicApp.Application.Common.Interfaces;
using ClinicApp.Domain.Entities;
using ClinicApp.Shared.DTOs.Doctor;
using FluentValidation;
using MediatR;

namespace ClinicApp.Application.Features.Doctors.Commands;

public record CreateDoctorCommand(CreateDoctorDto Doctor) : IRequest<int>;

public class CreateDoctorCommandValidator : AbstractValidator<CreateDoctorCommand>
{
    public CreateDoctorCommandValidator()
    {
        RuleFor(x => x.Doctor.FirstName).NotEmpty().MaximumLength(100);
        RuleFor(x => x.Doctor.LastName).NotEmpty().MaximumLength(100);
        RuleFor(x => x.Doctor.Email).NotEmpty().EmailAddress();
        RuleFor(x => x.Doctor.Specialization).NotEmpty();
        RuleFor(x => x.Doctor.ConsultationFee).GreaterThan(0);
    }
}

public class CreateDoctorCommandHandler : IRequestHandler<CreateDoctorCommand, int>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public CreateDoctorCommandHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<int> Handle(CreateDoctorCommand request, CancellationToken cancellationToken)
    {
        var doctor = _mapper.Map<Doctor>(request.Doctor);
        _context.Doctors.Add(doctor);
        await _context.SaveChangesAsync(cancellationToken);
        return doctor.Id;
    }
}