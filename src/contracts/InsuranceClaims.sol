// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract InsuranceClaims {
    struct Claim {
        string claimid;
        string patientName;
        address patientAddress;
        address InsurerAddress;
        string plan;
        string documents;
        int256 amount;
        bool processed;
        string paid;
    }
    mapping(address => Claim[]) private claims;

    function createClaim(
        string memory claimid,
        string memory patientName,
        address patientAddress,
        address InsurerAddress,
        string memory plan,
        string memory documents,
        int256 amount,
        bool processed,
        string memory paid
    ) public {
        Claim memory newClaim = Claim(
            claimid,
            patientName,
            patientAddress,
            InsurerAddress,
            plan,
            documents,
            amount,
            processed,
            paid
        );
        claims[InsurerAddress].push(newClaim);
    }

    function getClaims() public view returns (Claim[] memory) {
        return claims[msg.sender];
    }

    function changeProcessed(
        string memory claimid,
        bool newProcessedStatus
    ) public {
        Claim[] storage insurerClaims = claims[msg.sender];
        for (uint256 i = 0; i < insurerClaims.length; i++) {
            if (
                keccak256(abi.encodePacked(insurerClaims[i].claimid)) ==
                keccak256(abi.encodePacked(claimid))
            ) {
                insurerClaims[i].processed = newProcessedStatus;
                break;
            }
        }
    }

    function changePaid(
        string memory claimid,
        string memory newPaidStatus
    ) public {
        Claim[] storage insurerClaims = claims[msg.sender];
        for (uint256 i = 0; i < insurerClaims.length; i++) {
            if (
                keccak256(abi.encodePacked(insurerClaims[i].claimid)) ==
                keccak256(abi.encodePacked(claimid))
            ) {
                insurerClaims[i].paid = newPaidStatus;
                break;
            }
        }
    }
}
