const web3 = require("web3");
const express = require("express");
const Tx = require("ethereumjs-tx");

const app = express();

let web3js;
let web3Provider;

web3Provider = new web3.providers.HttpProvider(
  "https://rinkeby.infura.io/225e02d9903d4a93bc88624b3fa553c1"
);

web3js = new web3(web3Provider);
//contract abi is the array that you can get from the ethereum wallet or etherscan
var contractABI = [{
    constant: true,
    inputs: [],
    name: "inverseStakeRatio",
    outputs: [{
      name: "",
      type: "uint256"
    }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [{
        name: "_tokenAmount",
        type: "uint256"
      },
      {
        name: "_nodeAddr",
        type: "address"
      }
    ],
    name: "delegate",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "DOSTOKEN",
    outputs: [{
      name: "",
      type: "address"
    }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "getNodeAddrs",
    outputs: [{
      name: "",
      type: "address[]"
    }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [{
      name: "",
      type: "address"
    }],
    name: "nodes",
    outputs: [{
        name: "ownerAddr",
        type: "address"
      },
      {
        name: "rewardCut",
        type: "uint256"
      },
      {
        name: "stakedDB",
        type: "uint256"
      },
      {
        name: "selfStakedAmount",
        type: "uint256"
      },
      {
        name: "totalOtherDelegatedAmount",
        type: "uint256"
      },
      {
        name: "accumulatedReward",
        type: "uint256"
      },
      {
        name: "accumulatedRewardRate",
        type: "uint256"
      },
      {
        name: "running",
        type: "bool"
      }
    ],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "accumulatedRewardRate",
    outputs: [{
      name: "",
      type: "uint256"
    }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "ONEYEAR",
    outputs: [{
      name: "",
      type: "uint256"
    }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [{
      name: "_nodeAddr",
      type: "address"
    }],
    name: "nodeTryDelete",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: false,
    inputs: [{
      name: "_nodeAddr",
      type: "address"
    }],
    name: "delegatorClaimReward",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: false,
    inputs: [{
        name: "_nodeAddr",
        type: "address"
      },
      {
        name: "_newTokenAmount",
        type: "uint256"
      },
      {
        name: "_newDropburnAmount",
        type: "uint256"
      },
      {
        name: "_newCut",
        type: "uint256"
      }
    ],
    name: "updateNodeStaking",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "getCurrentAPR",
    outputs: [{
      name: "",
      type: "uint256"
    }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "totalStakedTokens",
    outputs: [{
      name: "",
      type: "uint256"
    }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [{
      name: "_quota",
      type: "uint256"
    }],
    name: "setDropBurnMaxQuota",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: false,
    inputs: [{
      name: "_node",
      type: "address"
    }],
    name: "nodeStart",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: false,
    inputs: [{
      name: "_nodeAddr",
      type: "address"
    }],
    name: "nodeWithdraw",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: false,
    inputs: [{
        name: "_tokenAmount",
        type: "uint256"
      },
      {
        name: "_dropburnAmount",
        type: "uint256"
      },
      {
        name: "_nodeAddr",
        type: "address"
      }
    ],
    name: "nodeUnbond",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [{
      name: "nodeAddr",
      type: "address"
    }],
    name: "getNodeRewardTokens",
    outputs: [{
      name: "",
      type: "uint256"
    }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [{
      name: "_maxStake",
      type: "uint256"
    }],
    name: "setMaxStakePerNode",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: false,
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "rewardRateDelta",
    outputs: [{
      name: "",
      type: "uint256"
    }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [{
      name: "_nodeAddr",
      type: "address"
    }],
    name: "delegatorChekcReward",
    outputs: [{
      name: "",
      type: "uint256"
    }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: false,
    inputs: [{
      name: "_minStake",
      type: "uint256"
    }],
    name: "setMinStakePerNode",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "owner",
    outputs: [{
      name: "",
      type: "address"
    }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "isOwner",
    outputs: [{
      name: "",
      type: "bool"
    }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "DBDECIMAL",
    outputs: [{
      name: "",
      type: "uint256"
    }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "circulatingSupply",
    outputs: [{
      name: "",
      type: "uint256"
    }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [{
        name: "_tokenAmount",
        type: "uint256"
      },
      {
        name: "_nodeAddr",
        type: "address"
      }
    ],
    name: "delegatorUnbond",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "maxStakePerNode",
    outputs: [{
      name: "",
      type: "uint256"
    }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [{
      name: "",
      type: "address"
    }, {
      name: "",
      type: "address"
    }],
    name: "delegators",
    outputs: [{
        name: "delegatedNode",
        type: "address"
      },
      {
        name: "delegatedAmount",
        type: "uint256"
      },
      {
        name: "accumulatedReward",
        type: "uint256"
      },
      {
        name: "accumulatedRewardRate",
        type: "uint256"
      },
      {
        name: "pendingWithdraw",
        type: "uint256"
      }
    ],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [{
      name: "_nodeAddr",
      type: "address"
    }],
    name: "nodeUnregister",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: false,
    inputs: [],
    name: "updateGlobalRewardRate",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: false,
    inputs: [{
      name: "_duration",
      type: "uint256"
    }],
    name: "setUnbondDuration",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: false,
    inputs: [{
      name: "_newSupply",
      type: "uint256"
    }],
    name: "setCirculatingSupply",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: false,
    inputs: [{
      name: "_nodeAddr",
      type: "address"
    }],
    name: "nodeClaimReward",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [{
      name: "",
      type: "uint256"
    }],
    name: "nodeAddrs",
    outputs: [{
      name: "",
      type: "address"
    }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [{
      name: "",
      type: "address"
    }, {
      name: "",
      type: "address"
    }],
    name: "nodeRunners",
    outputs: [{
      name: "",
      type: "bool"
    }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "lastRateUpdatedTime",
    outputs: [{
      name: "",
      type: "uint256"
    }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [{
      name: "_nodeAddr",
      type: "address"
    }],
    name: "delegatorWithdraw",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "unbondDuration",
    outputs: [{
      name: "",
      type: "uint256"
    }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "DOSDECIMAL",
    outputs: [{
      name: "",
      type: "uint256"
    }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [{
      name: "_node",
      type: "address"
    }],
    name: "nodeStop",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "stakingRewardsVault",
    outputs: [{
      name: "",
      type: "address"
    }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [{
        name: "_delegator",
        type: "address"
      },
      {
        name: "_nodeAddr",
        type: "address"
      }
    ],
    name: "getDelegatorRewardTokens",
    outputs: [{
      name: "",
      type: "uint256"
    }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "DBTOKEN",
    outputs: [{
      name: "",
      type: "address"
    }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "minStakePerNode",
    outputs: [{
      name: "",
      type: "uint256"
    }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "dropburnMaxQuota",
    outputs: [{
      name: "",
      type: "uint256"
    }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [{
        name: "_node",
        type: "address"
      },
      {
        name: "_tokenAmount",
        type: "uint256"
      },
      {
        name: "_dropburnAmount",
        type: "uint256"
      },
      {
        name: "_rewardCut",
        type: "uint256"
      }
    ],
    name: "newNode",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: false,
    inputs: [{
      name: "newOwner",
      type: "address"
    }],
    name: "transferOwnership",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: false,
    inputs: [{
      name: "_nodeAddr",
      type: "address"
    }],
    name: "nodeChekcReward",
    outputs: [{
      name: "",
      type: "uint256"
    }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [{
        name: "_dostoken",
        type: "address"
      },
      {
        name: "_dbtoken",
        type: "address"
      },
      {
        name: "_vault",
        type: "address"
      }
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "constructor"
  },
  {
    anonymous: false,
    inputs: [{
        indexed: false,
        name: "oldQuota",
        type: "uint256"
      },
      {
        indexed: false,
        name: "newQuota",
        type: "uint256"
      }
    ],
    name: "UpdateDropBurnMaxQuota",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [{
        indexed: false,
        name: "oldDuration",
        type: "uint256"
      },
      {
        indexed: false,
        name: "newDuration",
        type: "uint256"
      }
    ],
    name: "UpdateUnbondDuration",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [{
        indexed: false,
        name: "oldCirculatingSupply",
        type: "uint256"
      },
      {
        indexed: false,
        name: "newCirculatingSupply",
        type: "uint256"
      }
    ],
    name: "UpdateCirculatingSupply",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [{
        indexed: false,
        name: "oldMinStakePerNode",
        type: "uint256"
      },
      {
        indexed: false,
        name: "newMinStakePerNode",
        type: "uint256"
      }
    ],
    name: "UpdateMinStakePerNode",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [{
        indexed: false,
        name: "oldMaxStakePerNode",
        type: "uint256"
      },
      {
        indexed: false,
        name: "newMaxStakePerNode",
        type: "uint256"
      }
    ],
    name: "UpdateMaxStakePerNode",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [{
        indexed: false,
        name: "owner",
        type: "address"
      },
      {
        indexed: false,
        name: "nodeAddress",
        type: "address"
      },
      {
        indexed: false,
        name: "selfStakedAmount",
        type: "uint256"
      },
      {
        indexed: false,
        name: "stakedDB",
        type: "uint256"
      },
      {
        indexed: false,
        name: "rewardCut",
        type: "uint256"
      }
    ],
    name: "LogNewNode",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [{
        indexed: false,
        name: "ratio",
        type: "uint256"
      },
      {
        indexed: false,
        name: "total",
        type: "uint256"
      },
      {
        indexed: false,
        name: "staking",
        type: "uint256"
      }
    ],
    name: "LogTest",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [{
      indexed: true,
      name: "previousOwner",
      type: "address"
    }],
    name: "OwnershipRenounced",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [{
        indexed: true,
        name: "previousOwner",
        type: "address"
      },
      {
        indexed: true,
        name: "newOwner",
        type: "address"
      }
    ],
    name: "OwnershipTransferred",
    type: "event"
  }
];
var contractAddress = "0xaf939De1f73676B8ae1Cce1edcCfD4860B10359F";
//creating contract object
var contract = new web3js.eth.Contract(contractABI, contractAddress);

app.get("/method", async function (req, res) {
  /*
  contract.methods
    .getCurrentAPR()
    .call()
    .then(console.log);
*/
  let nodeAddrs = await contract.methods.getNodeAddrs().call();
  for (let i = 0; i < nodeAddrs.length; i++) {
    let nodeAddr = nodeAddrs[i];
    const node = await contract.methods.nodes(nodeAddr).call();
    let selfStakedAmount = Math.round(node.selfStakedAmount / 1000000000000000000);
    let totalOtherDelegatedAmount = Math.round(
      node.totalOtherDelegatedAmount / 1000000000000000000
    );
    let accumulatedReward = Math.round(
      node.accumulatedReward / 1000000000000000000
    );
    let accumulatedRewardRate = node.accumulatedRewardRate;
    let running = node.running;
    let rewardCut = node.rewardCut;

    //Get from metamask
    let delegatorAddr = "0x3E268ECB08CF59B5c2aDBf98651ccD8041C60f67";
    const delegator = await contract.methods
      .delegators(delegatorAddr, nodeAddr)
      .call();
    let myDelegator = Math.round(delegator.delegatedAmount / 1000000000000000000);
    let myReward = Math.round(delegator.accumulatedReward / 1000000000000000000);
    console.log(
      "self Staked:",
      selfStakedAmount,
      "\n",
      "total Delegated:",
      totalOtherDelegatedAmount,
      "\n",
      "Reward Cut:",
      rewardCut,
      "\n",
      "Total Rewards:",
      accumulatedReward,
      "\n",
      "Uptime:",
      "Todo",
      "\n",
      "My Delegation:",
      myDelegator,
      "\n",
      "My Rewards:",
      myReward,
      "\n"
    );
  }
});
/*
app.get("/getevent", function(req, res) {
  // Get Contract Event Stream
  const eventJsonInterface = web3.utils._.find(
    contract._jsonInterface,
    o => o.name === "LogValidationResult" && o.type === "event"
  );
  contract.getPastEvents(
    "LogValidationResult",
    {
      fromBlock: 5343942,
      toBlock: "latest"
    },
    (err, events) => {
      var str = "";
      for (i = 0; i < events.length; i++) {
        eventObj = web3js.eth.abi.decodeLog(
          eventJsonInterface.inputs,
          events[i].raw.data,
          eventJsonInterface.signature
        );
        str = str.concat(
          events[i].event,
          " ",
          events[i].blockNumber,
          " ",
          eventObj.trafficId,
          " ",
          eventObj.pass,
          "<br>"
        );
      }
      res.send(str);
    }
  );
});
*/
app.listen(3000, () => console.log("Example app listening on port 3000!"));
