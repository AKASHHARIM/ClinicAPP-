using ClinicApp.Application.Common.Interfaces;
using ClinicApp.Domain.Entities;
using ClinicApp.Shared.DTOs.Appointment;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace ClinicApp.Application.Features.Appointments.Commands;

public record CreateAppointmentCommand(CreateAppointmentDto Appointment) : IRequest<int>;

public class CreateAppointmentCommandValidator : AbstractValidator<CreateAppointmentCommand>
{
    public CreateAppointmentCommandValidator()
    {
        RuleFor(x => x.Appointment.PatientId).GreaterThan(0);
        RuleFor(x => x.Appointment.DoctorId).GreaterThan(0);
        RuleFor(x => x.Appointment.AppointmentDate).GreaterThanOrEqualTo(DateTime.Today)
            .WithMessage("Appointment date cannot be in the past");
    }
}

public class CreateAppointmentCommandHandler : IRequestHandler<CreateAppointmentCommand, int>
{
    private readonly IApplicationDbContext _context;

    public CreateAppointmentCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<int> Handle(CreateAppointmentCommand request, CancellationToken cancellationToken)
    {
        var dto = request.Appointment;

        // ── Core business rule: prevent double booking ──────────
        var conflict = await _context.Appointments
            .AnyAsync(a =>
                a.DoctorId == dto.DoctorId &&
                a.AppointmentDate.Date == dto.AppointmentDate.Date &&
                a.AppointmentTime == dto.AppointmentTime &&
                a.Status != Domain.Enums.AppointmentStatus.Cancelled,
                cancellationToken);

        if (conflict)
            throw new FluentValidation.ValidationException(new[]
            {
        new FluentValidation.Results.ValidationFailure("AppointmentTime", "This doctor already has an appointment at the selected date and time.")
    });
        var appointment = new Appointment
        {
            PatientId = dto.PatientId,
            DoctorId = dto.DoctorId,
            AppointmentDate = dto.AppointmentDate,
            AppointmentTime = dto.AppointmentTime,
            Notes = dto.Notes,
            Status = Domain.Enums.AppointmentStatus.Pending
        };

        _context.Appointments.Add(appointment);
        await _context.SaveChangesAsync(cancellationToken);
        return appointment.Id;
    }
}