// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract InsurerRegistry {
    struct Insurer {
        address insurerAddress; // Add the Ethereum address to the struct
        string name;
        string registrationNumber;
        string officeAddress;
        string phoneNumber;
    }

    mapping(address => Insurer) private insurers;
    mapping(address => bool) private isInsurerRegistered;

    event InsurerRegistered(address indexed insurerAddress, string name);

    function registerInsurer(
        address _insurerAddress,
        string memory _name,
        string memory _registrationNumber,
        string memory _officeAddress,
        string memory _phoneNumber
    ) external {
        require(
            !isInsurerRegistered[_insurerAddress],
            "Insurer already registered"
        );

        Insurer memory newInsurer = Insurer({
            insurerAddress: _insurerAddress,
            name: _name,
            registrationNumber: _registrationNumber,
            officeAddress: _officeAddress,
            phoneNumber: _phoneNumber
        });

        insurers[_insurerAddress] = newInsurer;
        isInsurerRegistered[_insurerAddress] = true;

        emit InsurerRegistered(_insurerAddress, _name);
    }

    function getInsurerDetails(
        address _insurerAddress
    ) external view returns (Insurer memory) {
        return insurers[_insurerAddress];
    }

    function isRegisteredInsurer(
        address _insurerAddress
    ) external view returns (bool) {
        return isInsurerRegistered[_insurerAddress];
    }
}
