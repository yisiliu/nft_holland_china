const HCNFT = artifacts.require("HollandChinaNFT");

module.exports = function (deployer) {
  deployer.deploy(HCNFT, "HollandChina2020", "HCT");
};
