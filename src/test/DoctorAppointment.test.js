const DoctorAppointment = artifacts.require("DoctorAppointment");

contract("DoctorAppointment", (accounts) => {
  const [doctor, patient] = accounts;
  let doctorAppointmentInstance;

  beforeEach(async () => {
    doctorAppointmentInstance = await DoctorAppointment.new();
  });

  it("should allow booking an appointment", async () => {
    const date = "2023-11-07";
    const time = 1600; // 4 PM
    const name = "John Doe";

    await doctorAppointmentInstance.bookAppointment(
      doctor,
      date,
      time,
      patient,
      name,
      { from: patient }
    );

    const appointments =
      await doctorAppointmentInstance.getAppointmentsForDoctor(doctor);
    assert.equal(appointments.length, 1, "Appointment should be booked");
    assert.equal(appointments[0].time, time, "Appointment time should match");
  });

  it("should not allow booking an appointment for a taken slot", async () => {
    const date = "2023-11-07";
    const time = 1600; // 4 PM
    const name = "John Doe";

    await doctorAppointmentInstance.bookAppointment(
      doctor,
      date,
      time,
      patient,
      name,
      { from: patient }
    );

    try {
      await doctorAppointmentInstance.bookAppointment(
        doctor,
        date,
        time,
        patient,
        name,
        { from: patient }
      );
      assert.fail("The same slot should not be bookable twice");
    } catch (error) {
      assert.include(
        error.message,
        "This slot is already booked",
        "Error should be for already booked slot"
      );
    }
  });

  it("should allow removing an appointment", async () => {
    const date = "2023-11-07";
    const time = 1600; // 4 PM
    const name = "John Doe";

    await doctorAppointmentInstance.bookAppointment(
      doctor,
      date,
      time,
      patient,
      name,
      { from: patient }
    );

    await doctorAppointmentInstance.removeAppointment(doctor, date, time, {
      from: patient,
    });

    const appointments =
      await doctorAppointmentInstance.getAppointmentsForDoctor(doctor);
    assert.equal(appointments.length, 0, "Appointment should be removed");
  });

  it("should return all booked slots for a doctor on a specific date", async () => {
    const date = "2023-11-07";
    const time1 = 1600; // 4 PM
    const time2 = 1700; // 5 PM
    const name = "John Doe";

    await doctorAppointmentInstance.bookAppointment(
      doctor,
      date,
      time1,
      patient,
      name,
      { from: patient }
    );

    await doctorAppointmentInstance.bookAppointment(
      doctor,
      date,
      time2,
      patient,
      name,
      { from: patient }
    );

    const bookedSlots = await doctorAppointmentInstance.getBookedSlotsForDoctor(
      doctor,
      date
    );
    assert.equal(bookedSlots.length, 2, "There should be two booked slots");
    assert.equal(bookedSlots[0], time1, "First slot should match");
    assert.equal(bookedSlots[1], time2, "Second slot should match");
  });

  // Add more tests as needed for each function
});
