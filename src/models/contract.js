const fs = require('fs');
const path = require('path');
const TruffleContract = require('@truffle/contract');

const greenpass_contract_json = JSON.parse(fs.readFileSync(path.join(__dirname, '../../build/contracts/GreenPassCertification.json'), 'utf8'));
const regioni_contract_json = JSON.parse(fs.readFileSync(path.join(__dirname, '../../build/contracts/Region.json'), 'utf8'));
const activity_contract_json = JSON.parse(fs.readFileSync(path.join(__dirname, '../../build/contracts/Activity.json'), 'utf8'));
const certification_contract_json = JSON.parse(fs.readFileSync(path.join(__dirname, '../../build/contracts/Certification.json'), 'utf8'));
const rolesmanager_contract_json = JSON.parse(fs.readFileSync(path.join(__dirname, '../../build/contracts/RolesManager.json'), 'utf8'));

const GreenPassCertification = TruffleContract(greenpass_contract_json);
GreenPassCertification.setProvider(web3.currentProvider);
const Region = TruffleContract(regioni_contract_json);
Region.setProvider(web3.currentProvider);
const Activity = TruffleContract(activity_contract_json);
Activity.setProvider(web3.currentProvider);
const Certification = TruffleContract(certification_contract_json);
Certification.setProvider(web3.currentProvider);
const RolesManager = TruffleContract(rolesmanager_contract_json);
RolesManager.setProvider(web3.currentProvider);

module.exports = {
    GreenPassCertification,
    Region,
    Activity,
    Certification,
    RolesManager
};