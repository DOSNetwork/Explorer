const web3 = require("web3");
const express = require("express");
const Tx = require("ethereumjs-tx");

const app = express();

let web3Provider = new web3.providers.HttpProvider(
  "https://rinkeby.infura.io/225e02d9903d4a93bc88624b3fa553c1"
);
let web3js = new web3(web3Provider);

// staking contract ABI
var contractABI = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'to',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'bool',
        name: 'nodeRunner',
        type: 'bool'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256'
      }
    ],
    name: 'ClaimReward',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'from',
        type: 'address'
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'to',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256'
      }
    ],
    name: 'Delegate',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'owner',
        type: 'address'
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'nodeAddress',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'selfStakedAmount',
        type: 'uint256'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'stakedDB',
        type: 'uint256'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'rewardCut',
        type: 'uint256'
      }
    ],
    name: 'NewNode',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'previousOwner',
        type: 'address'
      }
    ],
    name: 'OwnershipRenounced',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'previousOwner',
        type: 'address'
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'newOwner',
        type: 'address'
      }
    ],
    name: 'OwnershipTransferred',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'from',
        type: 'address'
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'to',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'bool',
        name: 'nodeRunner',
        type: 'bool'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'tokenAmount',
        type: 'uint256'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'dropburnAmount',
        type: 'uint256'
      }
    ],
    name: 'Unbond',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'oldCirculatingSupply',
        type: 'uint256'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'newCirculatingSupply',
        type: 'uint256'
      }
    ],
    name: 'UpdateCirculatingSupply',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'oldQuota',
        type: 'uint256'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'newQuota',
        type: 'uint256'
      }
    ],
    name: 'UpdateDropBurnMaxQuota',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'oldMinStakePerNode',
        type: 'uint256'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'newMinStakePerNode',
        type: 'uint256'
      }
    ],
    name: 'UpdateMinStakePerNode',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'oldDuration',
        type: 'uint256'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'newDuration',
        type: 'uint256'
      }
    ],
    name: 'UpdateUnbondDuration',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'from',
        type: 'address'
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'to',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'bool',
        name: 'nodeRunner',
        type: 'bool'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'tokenAmount',
        type: 'uint256'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'dbAmount',
        type: 'uint256'
      }
    ],
    name: 'Withdraw',
    type: 'event'
  },
  {
    constant: true,
    inputs: [],
    name: 'DBDECIMAL',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'DBTOKEN',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'DOSDECIMAL',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'DOSTOKEN',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'ONEYEAR',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'accumulatedRewardIndex',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'bridgeAddr',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'circulatingSupply',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        internalType: 'uint256',
        name: '_tokenAmount',
        type: 'uint256'
      },
      {
        internalType: 'address',
        name: '_nodeAddr',
        type: 'address'
      }
    ],
    name: 'delegate',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        internalType: 'address',
        name: '_nodeAddr',
        type: 'address'
      }
    ],
    name: 'delegatorClaimReward',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        internalType: 'uint256',
        name: '_tokenAmount',
        type: 'uint256'
      },
      {
        internalType: 'address',
        name: '_nodeAddr',
        type: 'address'
      }
    ],
    name: 'delegatorUnbond',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        internalType: 'address',
        name: '_nodeAddr',
        type: 'address'
      }
    ],
    name: 'delegatorWithdraw',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [
      {
        internalType: 'address',
        name: '_owner',
        type: 'address'
      },
      {
        internalType: 'address',
        name: '_nodeAddr',
        type: 'address'
      }
    ],
    name: 'delegatorWithdrawable',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address'
      },
      {
        internalType: 'address',
        name: '',
        type: 'address'
      }
    ],
    name: 'delegators',
    outputs: [
      {
        internalType: 'address',
        name: 'delegatedNode',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: 'delegatedAmount',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'accumulatedRewards',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'accumulatedRewardIndex',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'pendingWithdraw',
        type: 'uint256'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'dropburnMaxQuota',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'getCurrentAPR',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [
      {
        internalType: 'address',
        name: '_delegator',
        type: 'address'
      },
      {
        internalType: 'address',
        name: '_nodeAddr',
        type: 'address'
      }
    ],
    name: 'getDelegatorRewardTokensRT',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'getNodeAddrs',
    outputs: [
      {
        internalType: 'address[]',
        name: '',
        type: 'address[]'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [
      {
        internalType: 'address',
        name: '_nodeAddr',
        type: 'address'
      }
    ],
    name: 'getNodeRewardTokensRT',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [
      {
        internalType: 'address',
        name: 'nodeAddr',
        type: 'address'
      }
    ],
    name: 'getNodeUptime',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'initBlkN',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        internalType: 'address',
        name: '_dostoken',
        type: 'address'
      },
      {
        internalType: 'address',
        name: '_dbtoken',
        type: 'address'
      },
      {
        internalType: 'address',
        name: '_vault',
        type: 'address'
      },
      {
        internalType: 'address',
        name: '_bridgeAddr',
        type: 'address'
      }
    ],
    name: 'initialize',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'isOwner',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [
      {
        internalType: 'address',
        name: 'nodeAddr',
        type: 'address'
      }
    ],
    name: 'isValidStakingNode',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'lastRateUpdatedTime',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'minStakePerNode',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        internalType: 'address',
        name: '_nodeAddr',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: '_tokenAmount',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: '_dropburnAmount',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: '_rewardCut',
        type: 'uint256'
      },
      {
        internalType: 'string',
        name: '_desc',
        type: 'string'
      }
    ],
    name: 'newNode',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    name: 'nodeAddrs',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        internalType: 'address',
        name: '_nodeAddr',
        type: 'address'
      }
    ],
    name: 'nodeClaimReward',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address'
      },
      {
        internalType: 'address',
        name: '',
        type: 'address'
      }
    ],
    name: 'nodeRunners',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        internalType: 'address',
        name: '_nodeAddr',
        type: 'address'
      }
    ],
    name: 'nodeStart',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        internalType: 'address',
        name: '_nodeAddr',
        type: 'address'
      }
    ],
    name: 'nodeStop',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        internalType: 'uint256',
        name: '_tokenAmount',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: '_dropburnAmount',
        type: 'uint256'
      },
      {
        internalType: 'address',
        name: '_nodeAddr',
        type: 'address'
      }
    ],
    name: 'nodeUnbond',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        internalType: 'address',
        name: '_nodeAddr',
        type: 'address'
      }
    ],
    name: 'nodeUnregister',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        internalType: 'address',
        name: '_nodeAddr',
        type: 'address'
      }
    ],
    name: 'nodeWithdraw',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [
      {
        internalType: 'address',
        name: '_owner',
        type: 'address'
      },
      {
        internalType: 'address',
        name: '_nodeAddr',
        type: 'address'
      }
    ],
    name: 'nodeWithdrawable',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address'
      }
    ],
    name: 'nodes',
    outputs: [
      {
        internalType: 'address',
        name: 'ownerAddr',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: 'rewardCut',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'stakedDB',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'selfStakedAmount',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'totalOtherDelegatedAmount',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'accumulatedRewards',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'accumulatedRewardIndex',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'pendingWithdrawToken',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'pendingWithdrawDB',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'lastStartTime',
        type: 'uint256'
      },
      {
        internalType: 'bool',
        name: 'running',
        type: 'bool'
      },
      {
        internalType: 'string',
        name: 'description',
        type: 'string'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'owner',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        internalType: 'uint256',
        name: '_newSupply',
        type: 'uint256'
      }
    ],
    name: 'setCirculatingSupply',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        internalType: 'uint256',
        name: '_quota',
        type: 'uint256'
      }
    ],
    name: 'setDropBurnMaxQuota',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        internalType: 'uint256',
        name: '_minStake',
        type: 'uint256'
      }
    ],
    name: 'setMinStakePerNode',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        internalType: 'uint256',
        name: '_duration',
        type: 'uint256'
      }
    ],
    name: 'setUnbondDuration',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'stakingRewardsVault',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'totalStakedTokens',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        internalType: 'address',
        name: 'newOwner',
        type: 'address'
      }
    ],
    name: 'transferOwnership',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'unbondDuration',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        internalType: 'address',
        name: '_nodeAddr',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: '_newTokenAmount',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: '_newDropburnAmount',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: '_newCut',
        type: 'uint256'
      }
    ],
    name: 'updateNodeStaking',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  }
];

// Note: Rinkeby network address
var contractAddress = "0x0a0864Ae35B9f07D5E49E7B45aBD84Bb618b4d75";
// Creating contract object
var contract = new web3js.eth.Contract(contractABI, contractAddress);

app.get("/balance", async function(req, res) {
  var tokenABI = [
    {
      constant: true,
      inputs: [],
      name: "name",
      outputs: [{ name: "", type: "string" }],
      payable: false,
      stateMutability: "view",
      type: "function"
    },
    {
      constant: false,
      inputs: [],
      name: "stop",
      outputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      constant: false,
      inputs: [
        { name: "guy", type: "address" },
        { name: "wad", type: "uint256" }
      ],
      name: "approve",
      outputs: [{ name: "", type: "bool" }],
      payable: false,
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      constant: false,
      inputs: [{ name: "owner_", type: "address" }],
      name: "setOwner",
      outputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      constant: true,
      inputs: [],
      name: "totalSupply",
      outputs: [{ name: "", type: "uint256" }],
      payable: false,
      stateMutability: "view",
      type: "function"
    },
    {
      constant: false,
      inputs: [
        { name: "src", type: "address" },
        { name: "dst", type: "address" },
        { name: "wad", type: "uint256" }
      ],
      name: "transferFrom",
      outputs: [{ name: "", type: "bool" }],
      payable: false,
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      constant: true,
      inputs: [],
      name: "decimals",
      outputs: [{ name: "", type: "uint256" }],
      payable: false,
      stateMutability: "view",
      type: "function"
    },
    {
      constant: false,
      inputs: [
        { name: "guy", type: "address" },
        { name: "wad", type: "uint256" }
      ],
      name: "mint",
      outputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      constant: false,
      inputs: [{ name: "wad", type: "uint256" }],
      name: "burn",
      outputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      constant: true,
      inputs: [],
      name: "manager",
      outputs: [{ name: "", type: "address" }],
      payable: false,
      stateMutability: "view",
      type: "function"
    },
    {
      constant: false,
      inputs: [
        { name: "_token", type: "address" },
        { name: "_dst", type: "address" }
      ],
      name: "claimTokens",
      outputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      constant: true,
      inputs: [{ name: "src", type: "address" }],
      name: "balanceOf",
      outputs: [{ name: "", type: "uint256" }],
      payable: false,
      stateMutability: "view",
      type: "function"
    },
    {
      constant: true,
      inputs: [],
      name: "stopped",
      outputs: [{ name: "", type: "bool" }],
      payable: false,
      stateMutability: "view",
      type: "function"
    },
    {
      constant: false,
      inputs: [{ name: "authority_", type: "address" }],
      name: "setAuthority",
      outputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      constant: true,
      inputs: [],
      name: "owner",
      outputs: [{ name: "", type: "address" }],
      payable: false,
      stateMutability: "view",
      type: "function"
    },
    {
      constant: true,
      inputs: [],
      name: "symbol",
      outputs: [{ name: "", type: "string" }],
      payable: false,
      stateMutability: "view",
      type: "function"
    },
    {
      constant: false,
      inputs: [
        { name: "guy", type: "address" },
        { name: "wad", type: "uint256" }
      ],
      name: "burn",
      outputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      constant: false,
      inputs: [{ name: "_newManager", type: "address" }],
      name: "changeManager",
      outputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      constant: false,
      inputs: [
        { name: "dst", type: "address" },
        { name: "wad", type: "uint256" }
      ],
      name: "transfer",
      outputs: [{ name: "", type: "bool" }],
      payable: false,
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      constant: false,
      inputs: [],
      name: "start",
      outputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      constant: true,
      inputs: [],
      name: "authority",
      outputs: [{ name: "", type: "address" }],
      payable: false,
      stateMutability: "view",
      type: "function"
    },
    {
      constant: false,
      inputs: [{ name: "guy", type: "address" }],
      name: "approve",
      outputs: [{ name: "", type: "bool" }],
      payable: false,
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      constant: true,
      inputs: [
        { name: "src", type: "address" },
        { name: "guy", type: "address" }
      ],
      name: "allowance",
      outputs: [{ name: "", type: "uint256" }],
      payable: false,
      stateMutability: "view",
      type: "function"
    },
    {
      inputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "constructor"
    },
    { payable: true, stateMutability: "payable", type: "fallback" },
    {
      anonymous: false,
      inputs: [{ indexed: true, name: "authority", type: "address" }],
      name: "LogSetAuthority",
      type: "event"
    },
    {
      anonymous: false,
      inputs: [{ indexed: true, name: "owner", type: "address" }],
      name: "LogSetOwner",
      type: "event"
    },
    {
      anonymous: true,
      inputs: [
        { indexed: true, name: "sig", type: "bytes4" },
        { indexed: true, name: "guy", type: "address" },
        { indexed: true, name: "foo", type: "bytes32" },
        { indexed: true, name: "bar", type: "bytes32" },
        { indexed: false, name: "wad", type: "uint256" },
        { indexed: false, name: "fax", type: "bytes" }
      ],
      name: "LogNote",
      type: "event"
    },
    {
      anonymous: false,
      inputs: [
        { indexed: true, name: "from", type: "address" },
        { indexed: true, name: "to", type: "address" },
        { indexed: false, name: "value", type: "uint256" }
      ],
      name: "Transfer",
      type: "event"
    },
    {
      anonymous: false,
      inputs: [
        { indexed: true, name: "owner", type: "address" },
        { indexed: true, name: "spender", type: "address" },
        { indexed: false, name: "value", type: "uint256" }
      ],
      name: "Approval",
      type: "event"
    }
  ];

  var tokenAddress = "0x214e79c85744CD2eBBc64dDc0047131496871bEe";
  var nodeAddr = "0xc9100d92df91e9e6ff8065f6c098a2c05ae47f93";
  //creating contract object
  var token = new web3js.eth.Contract(tokenABI, tokenAddress);
  let balance = await token.methods.balanceOf(nodeAddr).call();
  console.log("balance", balance);
});

app.get("/activity", async function(req, res) {
  //account from metamask
  let account = "0xE222f441cb42bCFE8E46Fdecad0e633C70246BD3";
  let initialBlock = 6261292;
  const options1 = {
    filter: { owner: account },
    fromBlock: initialBlock,
    toBlock: "latest"
  };
  const options2 = {
    filter: { from: account },
    fromBlock: initialBlock,
    toBlock: "latest"
  };
  const options3 = {
    filter: { to: account },
    fromBlock: initialBlock,
    toBlock: "latest"
  };

  const eventList1 = await contract.getPastEvents("NewNode", options1);
  console.log("length", eventList1.length);
  console.log(eventList1[0].event);
  const eventList2 = await contract.getPastEvents("Delegate", options2);
  console.log("length", eventList2.length);
  const eventList3 = await contract.getPastEvents("Unbond", options2);
  console.log("length", eventList3.length);
  const eventList4 = await contract.getPastEvents("Withdraw", options3);
  console.log("length", eventList4.length);
  const eventList5 = await contract.getPastEvents("ClaimReward", options3);
  console.log("length", eventList5.length);
});

app.get("/method", async function(req, res) {
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
    let selfStakedAmount = Math.round(
      node.selfStakedAmount / 1000000000000000000
    );
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
    let delegatorAddr = "0x995337C3bb85690Ae659356a6684F221a7807a88";
    const delegator = await contract.methods
      .delegators(delegatorAddr, nodeAddr)
      .call();
    let myDelegator = Math.round(
      delegator.delegatedAmount / 1000000000000000000
    );
    let myReward = Math.round(
      delegator.accumulatedReward / 1000000000000000000
    );
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
