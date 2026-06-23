namespace ClinicApp.Domain.Enums;

public enum AppointmentStatus
{
    Pending = 1,
    Confirmed = 2,
    Completed = 3,
    Cancelled = 4
}

public enum UserRole
{
    Admin = 1,
    Doctor = 2,
    Patient = 3
}