// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script, console2} from "forge-std/Script.sol";
import {MatchdayMoments} from "../contracts/MatchdayMoments.sol";

contract DeployMatchdayMoments is Script {
    uint96 internal constant DEFAULT_ROYALTY_BPS = 1_000;

    function run() external returns (MatchdayMoments deployed) {
        uint256 deployerPrivateKey = vm.envUint("DEPLOYER_PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);
        vm.startBroadcast(deployerPrivateKey);
        deployed = new MatchdayMoments(deployer, DEFAULT_ROYALTY_BPS);
        vm.stopBroadcast();
        console2.log("MatchdayMoments deployed at", address(deployed));
        console2.log("Owner", deployer);
        console2.log("Default royalty bps", DEFAULT_ROYALTY_BPS);
    }
}
