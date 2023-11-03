const BookAppointment = artifacts.require("DoctorAppointment");

module.exports = function (deployer) {
  deployer.deploy(BookAppointment);
};
