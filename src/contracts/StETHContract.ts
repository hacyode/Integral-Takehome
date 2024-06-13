import Web3 from 'web3';
import { TotalPooledData } from '../interfaces/TotalPooledData';
import { TokenBalances } from '../interfaces/TokenBalances';
import { stETHAbi } from '../utils/stETHAbi';
import dotenv from 'dotenv';

dotenv.config();

class StETHContract {
  private web3: Web3;
  private contractAddress: string;
  private contractInstance: any;

  constructor(web3: Web3, contractAddress: string) {
    this.web3 = web3;
    this.contractAddress = contractAddress;
    this.contractInstance = new this.web3.eth.Contract(
      stETHAbi,
      contractAddress
    );
  }

  async getTotalPooledETHAndShares(): Promise<TotalPooledData> {
    try {
      let totalPooledETH = await this.contractInstance.methods
        .getTotalPooledEther()
        .call();
      let totalShares = await this.contractInstance.methods
        .totalSupply()
        .call();
      totalPooledETH = this.convertWeiToEther(totalPooledETH);
      totalShares = this.convertWeiToEther(totalShares);
      return { totalPooledETH, totalShares };
    } catch (error: any) {
      throw new Error(
        `Failed to fetch total pooled ETH and shares: ${error.message}`
      );
    }
  }

  async getMostRecentDepositor(): Promise<string> {
    try {
      const count = await this.web3.eth.getTransactionCount(
        this.contractAddress
      );
      const events = await this.contractInstance.getPastEvents('Transfer', {
        filter: { to: this.contractAddress },
        fromBlock: 0,
        toBlock: 'latest',
      });
      return events.length > 0
        ? events[events.length - 1].returnValues.from
        : '';
    } catch (error: any) {
      throw new Error(
        `Failed to fetch the most recent depositor: ${error.message}`
      );
    }
  }

  async getAllTransactions(address: string): Promise<any[]> {
    if (!Web3.utils.isAddress(address)) {
      throw new Error('Invalid address provided');
    }

    try {
      let currentBlockNumber = BigInt(await this.web3.eth.getBlockNumber());
      const maxBlockNumber = currentBlockNumber;

      let allEvents = [];
      const maxOfBlocksForRequests = currentBlockNumber - BigInt(2000);
      // while (currentBlockNumber > maxOfBlocksForRequests) {
      //   const block = await this.web3.eth.getBlock(
      //     currentBlockNumber.toString()
      //   );
      //   console.log(block.transactions);
      // for (let tx in block.transactions) {
      //   console.log();
      // }
      //   currentBlockNumber -= BigInt(1);
      // }
      while (
        currentBlockNumber >= BigInt(0) &&
        currentBlockNumber >= maxOfBlocksForRequests
      ) {
        const result = await this.contractInstance.getPastEvents('allEvents', {
          fromBlock: Number(currentBlockNumber) - 499,
          toBlock: Number(currentBlockNumber),
        });
        currentBlockNumber -= BigInt(500);
        if (result && result.length > 0) {
          allEvents.push(...result);
        }
      }
      const lAddress = address.toLowerCase();
      const events =
        allEvents
          .reverse()
          .filter(
            (event) =>
              event.returnValues !== undefined &&
              event.returnValues.from !== undefined &&
              event.returnValues.to !== undefined
          )
          .find(
            (event) =>
              event.returnValues.to.toLowerCase() === lAddress ||
              event.returnValues.from.toLowerCase() === lAddress
          ) || [];

      return events;
    } catch (error: any) {
      throw new Error(
        `Failed to fetch transactions for address ${address}: ${error.message}`
      );
    }
  }

  async getStETHTransfers(address: string): Promise<any[]> {
    if (!Web3.utils.isAddress(address)) {
      throw new Error('Invalid address provided');
    }

    try {
      const events = await this.contractInstance.getPastEvents('Transfer', {
        filter: { from: address, to: address },
        fromBlock: 0,
        toBlock: 'latest',
      });
      return events;
    } catch (error: any) {
      throw new Error(
        `Failed to fetch stETH transfers for address ${address}: ${error.message}`
      );
    }
  }

  async getTokenBalances(address: string): Promise<TokenBalances> {
    if (!Web3.utils.isAddress(address)) {
      throw new Error('Invalid address provided');
    }

    try {
      const ethBalance = await this.web3.eth.getBalance(address);
      const stETHBalance = await this.contractInstance.methods
        .balanceOf(address)
        .call();
      return {
        ETH: this.web3.utils.fromWei(ethBalance, 'ether'),
        stETH: this.web3.utils.fromWei(stETHBalance, 'ether'),
      };
    } catch (error: any) {
      throw new Error(
        `Failed to fetch token balances for address ${address}: ${error.message}`
      );
    }
  }

  /**
   * Convert Wei to Ether
   * @param {string} amountInWei - The amount in Wei to convert.
   * @returns {string} - The equivalent amount in Ether.
   */
  convertWeiToEther(amountInWei: string) {
    return this.web3.utils.fromWei(amountInWei, 'ether');
  }
}

export default StETHContract;
