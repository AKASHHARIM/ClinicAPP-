using ClinicApp.Application.Features.Appointments.Commands;
using ClinicApp.Application.Features.Appointments.Queries;
using ClinicApp.Shared.DTOs.Appointment;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ClinicApp.API.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
[Authorize]
public class AppointmentsController : ControllerBase
{
    private readonly IMediator _mediator;
    public AppointmentsController(IMediator mediator) => _mediator = mediator;

    [HttpGet]
    public async Task<ActionResult<List<AppointmentDto>>> GetAll([FromQuery] int? doctorId, [FromQuery] int? patientId)
        => Ok(await _mediator.Send(new GetAppointmentsQuery(doctorId, patientId)));

    [HttpPost]
    public async Task<ActionResult<int>> Create([FromBody] CreateAppointmentDto dto)
        => Ok(await _mediator.Send(new CreateAppointmentCommand(dto)));
}