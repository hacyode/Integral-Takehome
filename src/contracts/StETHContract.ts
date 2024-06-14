import Web3 from 'web3';
import { TotalPooledData } from '../interfaces/TotalPooledData';
import { TokenBalances } from '../interfaces/TokenBalances';
import { stETHAbi } from '../utils/stETHAbi';
import dotenv from 'dotenv';

dotenv.config();

// StETHContract class handles interactions with the stETH smart contract
class StETHContract {
  private web3: Web3;
  private contractAddress: string;
  private contractInstance: any;

  /**
   * Create an instance of StETHContract.
   * @param {Web3} web3 - An instance of Web3 created using api link.
   * @param {string} contractAddress - The address of the stETH contract.
   */
  constructor(web3: Web3, contractAddress: string) {
    this.web3 = web3;
    this.contractAddress = contractAddress;
    this.contractInstance = new this.web3.eth.Contract(
      stETHAbi,
      contractAddress
    );
  }

  /**
   * Get the total pooled ETH and total shares.
   * @returns {Promise<TotalPooledData>} - An object containing total pooled ETH and total shares.
   */
  async getTotalPooledETHAndShares(): Promise<TotalPooledData> {
    try {
      let totalPooledETH = await this.contractInstance.methods
        .getTotalPooledEther()
        .call();
      let totalShares = await this.contractInstance.methods
        .getTotalShares()
        .call();

      // convert the wei amount to ether
      totalPooledETH = this.convertWeiToEther(totalPooledETH);
      totalShares = this.convertWeiToEther(totalShares);

      // crete and return an object with combined result
      return { totalPooledETH, totalShares };
    } catch (error: any) {
      throw new Error(
        `Failed to fetch total pooled ETH and shares: ${error.message}`
      );
    }
  }

  /**
   * Get the most recent depositor's address.
   * @returns {Promise<string>} - The address of the most recent depositor.
   */
  async getMostRecentDepositor(): Promise<string> {
    try {
      // get all transfer events destined to the contractAddress from the first block to lastest
      const events = await this.contractInstance.getPastEvents('Transfer', {
        filter: { to: this.contractAddress },
        fromBlock: 0,
        toBlock: 'latest',
      });
      // if transfer not empty then return the from address from the most-recet transfer object
      return events.length > 0
        ? events[events.length - 1].returnValues.from
        : '';
    } catch (error: any) {
      throw new Error(
        `Failed to fetch the most recent depositor: ${error.message}`
      );
    }
  }

  /**
   * Get all transactions for a specific address.
   * @param {string} address - The address to filter the transactions for.
   * @returns {Promise<any[]>} - An array of transactions.
   * @throws Will throw an error if the address is invalid or fetching transactions fails.
   */
  async getAllTransactions(address: string): Promise<any[]> {
    if (!Web3.utils.isAddress(address)) {
      throw new Error('Invalid address provided');
    }

    try {
      // get the current block number of the contract
      let currentBlockNumber = BigInt(await this.web3.eth.getBlockNumber());

      // container to store result from allEvents calls
      let allEvents = [];
      // threshold to define the oldest block to be used to fetch events
      const maxOfBlocksForRequests = currentBlockNumber - BigInt(2000);
      // fetch events as long as currentBlockNumber is greater than currentBlockNumber - 2000
      // mean only fetch events between current block number and the past 2000 blocks
      while (
        currentBlockNumber >= BigInt(0) &&
        currentBlockNumber >= maxOfBlocksForRequests
      ) {
        // get events for the given block from and to range
        const result = await this.contractInstance.getPastEvents('allEvents', {
          fromBlock: Number(currentBlockNumber) - 499,
          toBlock: Number(currentBlockNumber),
        });
        // reduce the currentBlockNumber by 500 to fetch the events of previous 500 blocks
        currentBlockNumber -= BigInt(500);
        // store the transaction events into allEvents, if exists
        if (result && result.length > 0) {
          allEvents.push(...result);
        }
      }
      // convert address to lower case for case insensitive comparison
      const lAddress = address.toLowerCase();
      // grab all events having from and to addresses, matching the given address
      const events =
        allEvents
          .reverse()
          .filter(
            (event) =>
              event.returnValues !== undefined &&
              ((event.returnValues.from !== undefined &&
                event.returnValues.to.toLowerCase() === lAddress) ||
                (event.returnValues.from !== undefined &&
                  event.returnValues.from.toLowerCase() === lAddress))
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
