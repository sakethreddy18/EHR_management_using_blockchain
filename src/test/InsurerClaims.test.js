const InsuranceClaims = artifacts.require("InsuranceClaims");

contract("InsuranceClaims", (accounts) => {
  const [insurerAddress, patientAddress, otherAccount] = accounts;
  let insuranceClaimsInstance;

  beforeEach(async () => {
    insuranceClaimsInstance = await InsuranceClaims.new();
  });

  it("should create a claim", async () => {
    await insuranceClaimsInstance.createClaim(
      "claim123",
      "John Doe",
      patientAddress,
      insurerAddress,
      "Basic Plan",
      "doc123",
      1000,
      false,
      "unpaid",
      { from: insurerAddress }
    );

    const claims = await insuranceClaimsInstance.getClaims({
      from: insurerAddress,
    });
    assert.equal(claims.length, 1, "Claim should be created");
    assert.equal(claims[0].claimid, "claim123", "Claim ID should match");
  });

  it("should allow changing the processed status of a claim", async () => {
    await insuranceClaimsInstance.createClaim(
      "claim123",
      "John Doe",
      patientAddress,
      insurerAddress,
      "Basic Plan",
      "doc123",
      1000,
      false,
      "unpaid",
      { from: insurerAddress }
    );

    await insuranceClaimsInstance.changeProcessed("claim123", true, {
      from: insurerAddress,
    });

    const claims = await insuranceClaimsInstance.getClaims({
      from: insurerAddress,
    });
    assert.equal(
      claims[0].processed,
      true,
      "Processed status should be updated"
    );
  });

  it("should allow changing the paid status of a claim", async () => {
    await insuranceClaimsInstance.createClaim(
      "claim123",
      "John Doe",
      patientAddress,
      insurerAddress,
      "Basic Plan",
      "doc123",
      1000,
      false,
      "unpaid",
      { from: insurerAddress }
    );

    await insuranceClaimsInstance.changePaid("claim123", "paid", {
      from: insurerAddress,
    });

    const claims = await insuranceClaimsInstance.getClaims({
      from: insurerAddress,
    });
    assert.equal(claims[0].paid, "paid", "Paid status should be updated");
  });

  // Add more tests as needed for each function
});
