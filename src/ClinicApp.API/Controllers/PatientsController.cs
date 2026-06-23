using ClinicApp.Application.Features.Patients.Commands;
using ClinicApp.Application.Features.Patients.Queries;
using ClinicApp.Shared.DTOs.Appointment;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ClinicApp.API.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
[Authorize]
public class PatientsController : ControllerBase
{
    private readonly IMediator _mediator;
    public PatientsController(IMediator mediator) => _mediator = mediator;

    [HttpGet]
    public async Task<ActionResult<List<PatientDto>>> GetAll()
        => Ok(await _mediator.Send(new GetPatientsQuery()));

    [HttpPost]
    public async Task<ActionResult<int>> Create([FromBody] CreatePatientDto dto)
        => Ok(await _mediator.Send(new CreatePatientCommand(dto)));
}