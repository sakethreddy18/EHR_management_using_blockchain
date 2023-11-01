const InsurerRegistration = artifacts.require("InsurerRegistry");

module.exports = function (deployer) {
  deployer.deploy(InsurerRegistration);
};
