var MembershipToken= artifacts.require("MembershipToken");
var VotingWithTokens = artifacts.require("VotingWithTokens");

module.exports = function(deployer) {
    deployer.deploy(MembershipToken).then(function() {
	  return deployer.deploy(VotingWithTokens, MembershipToken.address);
  });
};
