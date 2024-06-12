import request from 'supertest';
import express from 'express';
import stETHRoutes from '../src/routes/stETHRoutes';

const app = express();
app.use(express.json());
app.use('/steth', stETHRoutes);

describe('stETH API Endpoints', () => {
  it('should return total pooled ETH and shares', async () => {
    const res = await request(app).get('/steth/totalPooledETHAndShares');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('totalPooledETH');
    expect(res.body).toHaveProperty('totalShares');
  });

  it('should return recent depositor', async () => {
    const res = await request(app).get('/steth/mostRecentDepositor');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('depositor');
  });

  it('should return list of transactions', async () => {
    const res = await request(app).get(
      '/steth/transactions/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84'
    );
    console.log(res.body);

    expect(res.status).toBe(200);
  });

  // Add more tests for other endpoints
});
