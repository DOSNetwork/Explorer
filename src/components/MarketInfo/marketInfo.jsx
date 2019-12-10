import React, { Component } from "react";
import axios from "axios";
import "./style.scss";
import { DOS_ABI, DOS_CONTRACT_ADDRESS } from "../../util/const";
import interestRateIcon from "./assets/interestRate-icon.png";
import priceIcon from "./assets/price-icon.png";
import stakedTokenIcon from "./assets/stakedToken-icon.png";

export default class Navigation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dosPrice: "-",
      currency: "",
      numberOfStaked: "-",
      interestRate: "-"
    };
  }
  componentDidMount() {
    this.fetchDosPrice();
    this.loadRateAndStaked();
  }
  componentWillUnmount() {
    this.unMount = true;
  }
  loadRateAndStaked = async () => {
    function fromWei(bn) {
      if (!bn || bn === "-") {
        return "";
      }
      return web3Client.utils.fromWei(bn.toString("10"));
    }

    const { web3Client } = this.props.contract;
    let contractInstance = new web3Client.eth.Contract(
      DOS_ABI,
      DOS_CONTRACT_ADDRESS
    );
    const rate = await contractInstance.methods.getCurrentAPR().call();
    const totalStakedTokens = await contractInstance.methods
      .totalStakedTokens()
      .call();
    console.log("rate ", rate.toString(), "token ", fromWei(totalStakedTokens));
    if (!this.unMount) {
      this.setState({
        interestRate: Math.round(rate.toString()) / 10000,
        numberOfStaked: totalStakedTokens.toString()
      });
    }
  };
  fetchDosPrice = () => {
    let address = "0x70861e862e1ac0c96f853c8231826e469ead37b1",
      currency = "usd";
    axios
      .get(
        `https://api.coingecko.com/api/v3/simple/token_price/ethereum?contract_addresses=${address}&vs_currencies=${currency}`
      )
      .then(({ data }) => {
        if (data && data[address] && data[address][currency]) {
          this.setState({
            dosPrice: data[address][currency],
            currency: currency
          });
        }
      });
  };
  render() {
    let { dosPrice, numberOfStaked, interestRate, currency } = this.state;
    return (
      <div className="market-info--wrapper">
        <div className="market-info--block block--rate">
          <p className="block--title">
            <img width="20" src={interestRateIcon} alt="icon" />
            <span>Interest Rate</span>
          </p>
          <p className="block--value">{interestRate}</p>
        </div>
        <div className="market-info--block block--token">
          <p className="block--title">
            <img width="20" src={stakedTokenIcon} alt="icon" />
            <span>Number of Staked Token</span>
          </p>
          <p className="block--value">{numberOfStaked}</p>
        </div>
        <div className="market-info--block block--price">
          <p className="block--title">
            <img width="20" src={priceIcon} alt="icon" />
            <span>Price of DOS({currency})</span>
          </p>
          <p className="block--value">{dosPrice}</p>
        </div>
      </div>
    );
  }
}
