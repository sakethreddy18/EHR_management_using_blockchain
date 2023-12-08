// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract DoctorAppointment {
    struct Appointment {
        address doctor;
        address patient;
        uint256 time;
        string date;
        string name;
    }

    // A mapping from doctor's address and date to the array of booked times.
    mapping(address => mapping(string => uint256[])) public doctorSchedule;

    // A list of all appointments.
    Appointment[] public appointments;

    function bookAppointment(
        address _doctorAddress,
        string memory _date,
        uint256 _time,
        address _patientAddress,
        string memory _name
    ) public {
        uint256[] storage times = doctorSchedule[_doctorAddress][_date];
        for (uint i = 0; i < times.length; i++) {
            require(times[i] != _time, "This slot is already booked!");
        }

        times.push(_time);

        Appointment memory newAppointment = Appointment({
            doctor: _doctorAddress,
            patient: _patientAddress,
            time: _time,
            date: _date,
            name: _name
        });

        appointments.push(newAppointment);
    }

    function getAppointmentsForDoctor(
        address _doctorAddress
    ) public view returns (Appointment[] memory) {
        uint count = 0;
        for (uint i = 0; i < appointments.length; i++) {
            if (appointments[i].doctor == _doctorAddress) {
                count++;
            }
        }

        Appointment[] memory doctorAppointments = new Appointment[](count);
        uint j = 0;
        for (uint i = 0; i < appointments.length; i++) {
            if (appointments[i].doctor == _doctorAddress) {
                doctorAppointments[j] = appointments[i];
                j++;
            }
        }
        return doctorAppointments;
    }

    // Additional function to fetch booked slots for a doctor on a specific date
    function getBookedSlotsForDoctor(
        address _doctorAddress,
        string memory _date
    ) public view returns (uint256[] memory) {
        return doctorSchedule[_doctorAddress][_date];
    }

    function removeAppointment(
        address _doctorAddress,
        string memory _date,
        uint256 _time
    ) public {
        uint256[] storage times = doctorSchedule[_doctorAddress][_date];
        bool timeFound = false;
        for (uint i = 0; i < times.length; i++) {
            if (times[i] == _time) {
                times[i] = times[times.length - 1];
                times.pop();
                timeFound = true;
                break;
            }
        }

        require(timeFound, "No appointment found for the given date and time.");

        // Removing the appointment from the appointments array
        for (uint i = 0; i < appointments.length; i++) {
            if (
                appointments[i].doctor == _doctorAddress &&
                keccak256(abi.encodePacked(appointments[i].date)) ==
                keccak256(abi.encodePacked(_date)) &&
                appointments[i].time == _time
            ) {
                appointments[i] = appointments[appointments.length - 1];
                appointments.pop();
                break;
            }
        }
    }
}
