// src/app.ts
import express from 'express';
import stETHRoutes from './routes/StETHRoutes';

const app = express();

app.use(express.json());

// Use the stETHRoutes for any routes starting with /steth
app.use('/steth', stETHRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
