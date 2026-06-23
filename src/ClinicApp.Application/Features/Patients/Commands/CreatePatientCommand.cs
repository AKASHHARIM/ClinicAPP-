using AutoMapper;
using ClinicApp.Application.Common.Interfaces;
using ClinicApp.Domain.Entities;
using ClinicApp.Shared.DTOs.Appointment;
using FluentValidation;
using MediatR;

namespace ClinicApp.Application.Features.Patients.Commands;

public record CreatePatientCommand(CreatePatientDto Patient) : IRequest<int>;

public class CreatePatientCommandValidator : AbstractValidator<CreatePatientCommand>
{
    public CreatePatientCommandValidator()
    {
        RuleFor(x => x.Patient.FirstName).NotEmpty();
        RuleFor(x => x.Patient.LastName).NotEmpty();
        RuleFor(x => x.Patient.Email).NotEmpty().EmailAddress();
        RuleFor(x => x.Patient.Phone).NotEmpty();
        RuleFor(x => x.Patient.DateOfBirth).LessThan(DateTime.Today);
    }
}

public class CreatePatientCommandHandler : IRequestHandler<CreatePatientCommand, int>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public CreatePatientCommandHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<int> Handle(CreatePatientCommand request, CancellationToken cancellationToken)
    {
        var patient = _mapper.Map<Patient>(request.Patient);
        _context.Patients.Add(patient);
        await _context.SaveChangesAsync(cancellationToken);
        return patient.Id;
    }
}