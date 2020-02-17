var KtcFoundation = artifacts.require("KtcFoundation");
var Voting = artifacts.require("Voting");
var MembershipToken= artifacts.require("MembershipToken");
var VotingWithTokens = artifacts.require("VotingWithTokens");

module.exports = function(deployer) {
  deployer.deploy(KtcFoundation).then(function() {
	  return deployer.deploy(Voting, KtcFoundation.address);
  });
  
    deployer.deploy(MembershipToken).then(function() {
	  return deployer.deploy(VotingWithTokens, MembershipToken.address);
  });
};
