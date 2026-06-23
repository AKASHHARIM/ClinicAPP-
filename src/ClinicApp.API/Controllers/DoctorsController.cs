using ClinicApp.Application.Features.Doctors.Commands;
using ClinicApp.Application.Features.Doctors.Queries;
using ClinicApp.Shared.DTOs.Doctor;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ClinicApp.API.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
[Authorize]
public class DoctorsController : ControllerBase
{
    private readonly IMediator _mediator;
    public DoctorsController(IMediator mediator) => _mediator = mediator;

    [HttpGet]
    public async Task<ActionResult<List<DoctorDto>>> GetAll()
        => Ok(await _mediator.Send(new GetDoctorsQuery()));

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<int>> Create([FromBody] CreateDoctorDto dto)
        => Ok(await _mediator.Send(new CreateDoctorCommand(dto)));
}