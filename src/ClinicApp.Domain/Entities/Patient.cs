using ClinicApp.Domain.Common;

namespace ClinicApp.Domain.Entities;

public class Patient : BaseEntity
{
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public DateTime DateOfBirth { get; set; }
    public string? Address { get; set; }

    public ICollection<Appointment> Appointments { get; set; } = new List<Appointment>();
}