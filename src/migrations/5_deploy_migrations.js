const InsuranceClaimsInterface = artifacts.require("InsuranceClaims");

module.exports = function (deployer) {
  deployer.deploy(InsuranceClaimsInterface);
};
