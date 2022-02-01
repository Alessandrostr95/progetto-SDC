// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Certification {
    enum CertificationType {
        TAMPONE, TAMPONE_RAPIDO,
        VACCINO1, VACCINO2, VACCINO3,
        GUARITO, ALTRO
    }

    struct GreenPass {
        string qrcode;
        address emitter;
        CertificationType certificationType;
        uint256 creation;
        uint duration;
        bool revoked;
    }

    mapping (CertificationType => uint) public durations;
    constructor () {
        durations[CertificationType.TAMPONE] = 2 days;
        durations[CertificationType.TAMPONE_RAPIDO] = 2 days;
        durations[CertificationType.VACCINO1] = 16 weeks;
        durations[CertificationType.VACCINO2] = 16 weeks;
        durations[CertificationType.VACCINO3] = 16 weeks;
        durations[CertificationType.GUARITO] = 16 weeks;
        durations[CertificationType.ALTRO] = 16 weeks;
    }
}