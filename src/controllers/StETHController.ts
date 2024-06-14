// src/controllers/StETHController.ts
import { Request, Response } from 'express';
import Web3 from 'web3';
import StETHContract from '../contracts/StETHContract';

class StETHController {
  private stETHContract: StETHContract;

  constructor(web3: Web3, contractAddress: string) {
    this.stETHContract = new StETHContract(web3, contractAddress);
  }

  getTotalPooledETHAndShares = async (req: Request, res: Response) => {
    try {
      const data = await this.stETHContract.getTotalPooledETHAndShares();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  getMostRecentDepositor = async (req: Request, res: Response) => {
    try {
      const depositor = await this.stETHContract.getMostRecentDepositor();
      res.json({ depositor });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  getAllTransactions = async (req: Request, res: Response) => {
    const address = req.params.address;
    if (!Web3.utils.isAddress(address)) {
      return res.status(400).json({ error: 'Invalid address' });
    }

    try {
      const transactions = await this.stETHContract.getAllTransactions(address);
      res.json(transactions);
    } catch (error) {
      console.log(error);

      res.status(500).json({ error: 'Internal server error ' });
    }
  };

  getStETHTransfers = async (req: Request, res: Response) => {
    const address = req.params.address;
    if (!Web3.utils.isAddress(address)) {
      return res.status(400).json({ error: 'Invalid address' });
    }

    try {
      const transfers = await this.stETHContract.getStETHTransfers(address);
      res.json(transfers);
    } catch (error) {
      const { message } = error as Error;
      res.status(500).json({ error: `Internal server error ${message}` });
    }
  };

  getTokenBalances = async (req: Request, res: Response) => {
    const address = req.params.address;
    if (!Web3.utils.isAddress(address)) {
      return res.status(400).json({ error: 'Invalid address' });
    }

    try {
      const balances = await this.stETHContract.getTokenBalances(address);
      res.json(balances);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  };
}

export default StETHController;
