const GreenPassCertification = artifacts.require("GreenPassCertification");

module.exports = function (deployer) {
  deployer.deploy(GreenPassCertification);
};
