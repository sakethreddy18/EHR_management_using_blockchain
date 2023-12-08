const InsurerRegistry = artifacts.require("InsurerRegistry");

contract("InsurerRegistry", (accounts) => {
  const [insurerAddress, otherAccount] = accounts;
  let insurerRegistryInstance;

  beforeEach(async () => {
    insurerRegistryInstance = await InsurerRegistry.new();
  });

  it("should register an insurer", async () => {
    await insurerRegistryInstance.registerInsurer(
      insurerAddress,
      "Insurer A",
      "123456789",
      "123 Insurer St",
      "555-555-5555",
      { from: insurerAddress }
    );

    const isRegistered = await insurerRegistryInstance.isRegisteredInsurer(
      insurerAddress
    );
    assert.equal(isRegistered, true, "Insurer should be registered");

    const eventList = await insurerRegistryInstance.getPastEvents(
      "InsurerRegistered",
      { fromBlock: 0, toBlock: "latest" }
    );
    assert.equal(
      eventList.length,
      1,
      "Should have emitted InsurerRegistered event"
    );
  });

  it("should not allow registering an insurer more than once", async () => {
    await insurerRegistryInstance.registerInsurer(
      insurerAddress,
      "Insurer A",
      "123456789",
      "123 Insurer St",
      "555-555-5555",
      { from: insurerAddress }
    );

    try {
      await insurerRegistryInstance.registerInsurer(
        insurerAddress,
        "Insurer A",
        "123456789",
        "123 Insurer St",
        "555-555-5555",
        { from: insurerAddress }
      );
      assert.fail("The transaction should have thrown an error");
    } catch (err) {
      assert.include(
        err.message,
        "Insurer already registered",
        "The error message should contain 'Insurer already registered'"
      );
    }
  });

  it("should return insurer details", async () => {
    await insurerRegistryInstance.registerInsurer(
      insurerAddress,
      "Insurer A",
      "123456789",
      "123 Insurer St",
      "555-555-5555",
      { from: insurerAddress }
    );

    const insurerDetails = await insurerRegistryInstance.getInsurerDetails(
      insurerAddress
    );
    assert.equal(insurerDetails.name, "Insurer A", "Insurer name should match");
    assert.equal(
      insurerDetails.registrationNumber,
      "123456789",
      "Registration number should match"
    );
  });

  it("should check if an address is a registered insurer", async () => {
    await insurerRegistryInstance.registerInsurer(
      insurerAddress,
      "Insurer A",
      "123456789",
      "123 Insurer St",
      "555-555-5555",
      { from: insurerAddress }
    );

    const isRegistered = await insurerRegistryInstance.isRegisteredInsurer(
      insurerAddress
    );
    assert.equal(isRegistered, true, "Address should be a registered insurer");

    const isNotRegistered = await insurerRegistryInstance.isRegisteredInsurer(
      otherAccount
    );
    assert.equal(
      isNotRegistered,
      false,
      "Address should not be a registered insurer"
    );
  });

  // Add more tests as needed for each function
});
