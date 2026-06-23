using AutoMapper;
using ClinicApp.Domain.Entities;
using ClinicApp.Shared.DTOs.Doctor;
using ClinicApp.Shared.DTOs.Appointment;

namespace ClinicApp.Application.Common.Mappings;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<Doctor, DoctorDto>();
        CreateMap<CreateDoctorDto, Doctor>();

        CreateMap<Patient, PatientDto>();
        CreateMap<CreatePatientDto, Patient>();

        CreateMap<Appointment, AppointmentDto>()
            .ForMember(d => d.PatientName, o => o.MapFrom(s => $"{s.Patient.FirstName} {s.Patient.LastName}"))
            .ForMember(d => d.DoctorName, o => o.MapFrom(s => $"{s.Doctor.FirstName} {s.Doctor.LastName}"))
            .ForMember(d => d.Status, o => o.MapFrom(s => s.Status.ToString()));
    }
}