const messages = {
    'ChangeLang': '中',
    'ChangeLang-Current': 'En',
    /**navgation */
    'Title.staking': 'Staking',
    'Title.nodelist': 'Node List',
    'Title.explorer': 'Explorer',
    'Title.nodedetail': 'Node Detail',
    'Title.myaccount': 'My Account',
    /*metamask*/
    'Wallet.connected': 'Disconnect Wallet',
    'Wallet.connectwallet': 'Connect Wallet',
    'Wallet.Title.NoWalletInstalled': 'No Wallet Installed',
    'Wallet.Tips.InstallWallet': 'You need to install a wallet to get involved in staking.',
    /*common */
    'Node.active': 'Active',
    'Node.inactive': 'Inactive',
    'Node.Unregister': 'Unregister',
    'Events.Loading': '{type, select, approve {Approve} withdraw {Withdraw} claimreward {Claim Reward} unregister {Unregister} updateNode {Update Node} unbond {Unbond} delegate {Delegate} newNode {New Node}}: https://etherscan.io/tx/{hash}',
    'Events.Success': '{type, select, approve {Approve} withdraw {Withdraw} claimreward {Claim Reward} unregister {Unregister} updateNode {Update Node} unbond {Unbond} delegate {Delegate} newNode {New Node}} Success: Confirmed in block {blockNumber}',
    /* NodeList */
    'Table.Column.NodeList.Name': 'Name',
    'Table.Column.NodeList.Node': 'Node',
    'Table.Column.NodeList.Status': 'Status',
    'Table.Column.NodeList.SelfStaked': 'Self Staked',
    'Table.Column.NodeList.Delegated': 'Delegated',
    'Table.Column.NodeList.RewardCut': 'Commission',
    'Table.Column.NodeList.Uptime': 'Uptime',
    'Table.Column.NodeList.MyDelegation': 'My Delegation',
    'Table.Column.NodeList.MyRewards': 'Available Rewards',

    'Tooltip.selfStaked': 'Amount of DOS tokens this node stakes by itself.',
    'Tooltip.delegate': 'Total amount of DOS tokens delegated to this node.',
    'Tooltip.rewartcut': "Percentage of rewards this node takes from rewards generated from other users' delegation",
    'Tooltip.uptime': 'Run time since node\'s last startup',
    'Tooltip.myDelegation': "Amount of DOS tokens you've delegated to this node.",
    'Tooltip.myRewards': "Amount of DOS tokens you get from this node as staking rewards that's available for withdrawal.",
    'Tooltip.OnlyShowTheNodesRelatedToMe': 'Only Show Nodes Related To Me',
    'Tooltip.searchnodeaddress': 'search node address',
    'Tooltip.CreateANode': 'Create a Node',

    'Form.Title.CreateNode': 'Start a new node',
    'Form.Ok.Create': 'Create',
    'Form.Cancel.Create': 'Cancel',
    'Form.Error.tokenAmount': 'Please enter a valid number',
    'Form.Error.tokenAmount2': 'Please enter a value larger or equal to 800,000',
    'Form.Error.cutRate': 'Please enter a valid number',
    'Form.Error.cutRate2': 'Please enter a valid percentage',
    'Form.Error.CreateNodeAgreement': 'Please check to confirm',
    'Form.Lable.Name': 'Node Name',
    'Form.Message.InputName': 'Please name your node (<= 32 characters)',
    'Form.Lable.Node': 'Node Address',
    'Form.Message.InputNodeAddress': "Please enter your node address",
    'Form.Lable.StakingAmount': 'Staking Amount',
    'Form.Message.InputStakeingAmount': "Please enter your staking amount",
    'Form.Placeholder.InputStakeingAmount': "minimum 800,000",
    'Form.Lable.dbAmount': 'DropBurn Amount (Optional, if you own Dropburn token)',
    'Form.Message.InputdbAmount': "Please enter your DropBurn token amount",
    'Form.Lable.cutRate': 'Commission Rate',
    'Form.Message.InputcutRate': "Please enter your node's commission rate",


    /** NodeDetail**/

    'Form.Message.OwnerWithdraw': 'No token available for withdraw',
    'Form.Message.DelegatorWithdraw': 'No DOS token available for withdraw',
    'Form.Message.OwnerClaimReward': 'No reward token to claim',
    'Form.Message.DelegatorClaimReward': 'No reward token to claim',
    'Tooltip.NodeDetail.MyDelegation': 'My Delegation',
    'Tooltip.NodeDetail.MyStaking': 'My Staking',
    'Tooltip.NodeDetail.DropBurnToken': 'DropBurn Amount',
    'Tooltip.NodeDetail.WithdrawalFrozen': 'Withdrawable / Unbonding',
    'Tooltip.NodeDetail.WithdrawalDropBurnFrozen': 'Withdrawable DropBurn / Unbonding DropBurn',
    'Tooltip.NodeDetail.Withdraw': 'Withdraw',
    'Tooltip.NodeDetail.Claim': 'Claim',
    'Tooltip.NodeDetail.MyRewards': 'My Rewards',
    'Tooltip.NodeDetail.NodeAddress': 'Node Address',
    'Tooltip.NodeDetail.NodeDescription': 'Node Description',
    'Tooltip.NodeDetail.NodeSelt-Staked': 'Node Self-Staked',
    'Tooltip.NodeDetail.TotalDelegated': 'Total Delegated',
    'Tooltip.NodeDetail.RewardCut': 'Commission Rate',
    'Tooltip.NodeDetail.Uptime': 'Uptime',
    'Tooltip.NodeDetail.Days': 'days',
    'Tooltip.NodeDetail.Unbond': 'Unbond',
    'Tooltip.NodeDetail.Delegate': 'Stake',
    'Tooltip.NodeDetail.UpdateNode': 'Update Node',
    'Modal.NodeUnregister.Title': 'Are you sure to unregister this node?',
    'Modal.NodeUnregister.Content': 'You can withdraw all your unbonded tokens after 7 days, during the unbonding period you are not eligible for receiving staking rewards.',
    'Form.Button.Submit': 'Submit',

    'Form.Lable.DelegateAmount': 'Delegate Amount',
    'Form.Lable.Tips': "There'll be 2 txs for the first time you stake: 1. The 1st tx to approve staking smart contract to transfer tokens; 2.The 2nd one that stakes",
    'Form.Lable.UnbondAmount': 'Unbond takes 7 days before withdrawable',
    'Form.Lable.DropBurnAmount': 'DropBurn Amount',
    'Form.Lable.AddDelegateAmount': 'Add Delegate Amount',
    'Form.Lable.AddDropBurnAmount': 'Add DropBurn Amount',
    'Form.Lable.UpdateRewardCut': 'Update Commission Rate',
    'Form.Lable.UpdateNodeDescription': 'Update Node Description',
    'Form.Message.InputUnbondAmount': "Please input the unbond token amount",
    'Form.Message.InputDropBurnAmount': "Please input DropBurn token amount",
    'Form.Message.InputDelegateAmount': "Please input the delegate token amount!",
    'Form.Message.InputRewardCut': "Please input the new commission rate",
    'Form.Message.InputNodeDescription': 'Please input the node description',

    'Tooltip.MarketInfo.InterestRate': 'Current APR',
    'Tooltip.MarketInfo.NumberOfStakedToken': 'Number of Staked Tokens',
    "Tooltip.MarketInfo.PriceOfDOS": 'Current Price',
    'Tooltip.Search.placeholder': 'Search by Event, RequestId, GroupId and Address',
    'Form.Button.Search': 'Search',
    'Table.Column.Explorer.TxHash': 'Tx Hash',
    'Table.Column.Explorer.Blocks': 'Blocks',
    'Table.Column.Explorer.EventLog': 'Event Log',
    'Table.Column.Explorer.Address': 'Address',
    'Table.Column.Explorer.Balance': 'Balance',
    'Table.Column.Explorer.RegisterState': 'Register State',
    'Table.Column.Explorer.ActiveGroups': 'Active Groups',
    'Table.Column.Explorer.ExpiredGroups': 'Expired Groups',
    'Table.Column.Explorer.GroupInfo': 'Group Info',
    'Table.Column.Explorer.GroupId': 'Group Id',
    'Table.Column.Explorer.AcceptedBlockNumber': 'Accepted Block Number',
    'Table.Column.Explorer.DissolvedBlockNumber': 'Dissolved Block Number',
    'Table.Column.Explorer.UrlRequests': 'Url Requests',
    'Table.Column.Explorer.RandomRequests': 'Random Requests',
    'Table.Column.Explorer.GroupPublickKey': 'Group Publick Key',
    'Table.Column.Explorer.GroupNodeIds': 'Group NodeIds',

    'Table.Column.Explorer.RequestInfo': 'Request Info',
    'Table.Column.Explorer.RequestId': 'Request Id',
    'Table.Column.Explorer.DispatchedGroupId': 'Dispatched Group Id',
    'Table.Column.Explorer.Submitter': 'Submitter Node',
    'Table.Column.Explorer.SubmittedBlockNumber': 'Submitted Block Number',
    'Table.Column.Explorer.SubmittedTxHash': 'Submitted TxHash',
    'Table.Column.Explorer.Message': 'Message',
    'Table.Column.Explorer.Signature': 'Signature',
    'Table.Column.Explorer.PublicKey': 'Public Key',
    'Table.Column.Explorer.LastSystemRandomness': 'Last System Randomness',
    'Table.Column.Explorer.UserSeed': 'User Provided Random Seed (Optional)',
    'Table.Column.Explorer.Pass': 'Pass',

    /**MyAccount */


    'Tooltip.MyAccount.AccountBalance': 'Account Balance',
    'Tooltip.MyAccount.TotalDelegated': 'Total Staked',
    'Tooltip.MyAccount.MyRewards': 'Available Rewards',
    'Tooltip.MyAccount.Unbondingtokens': 'Withdrawable / Unbonding',
    'Table.Column.Activites.AccountActivity': 'Account Activity',
    'Table.Column.Activites.Time': 'Time',
    'Table.Column.Activites.Action': 'Action',
    'Table.Column.Activites.TxHash': 'Tx Hash',
    'Tooltip.Explorer.Pagnation': 'Latest {pageSize} events',
    'NodeCreate.Agreement.pre': 'Node creation requires both off-chain setup and on-chain setup, please read node runner ',
    'NodeCreate.Agreement.url': 'https://medium.com/dos-network/instructions-of-launching-a-node-in-dos-network-932e73a91a75',
    'NodeCreate.Agreement.tutorials': 'tutorial',
    'NodeCreate.Agreement.end': 'before creating a node.'
}
export default messages
