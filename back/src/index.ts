import express, { Application, Request, Response } from 'express';
import storeRoutes from "./routes/storeRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js"
import sizeRoutes from "./routes/sizeRoutes.js"
// import billboardRoutes from "./routes/billboardRoutes.js";
import cors from 'cors';
import {
  ClerkExpressRequireAuth,
  RequireAuthProp,
  StrictAuthProp,
} from '@clerk/clerk-sdk-node';

const port = 3001;
const app: Application = express();
declare global {
  namespace Express {
    interface Request extends StrictAuthProp {}
  }
}
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, world!');
});
app.use('/api/stores',storeRoutes);
// app.use('/api/billboards',billboardRoutes);
app.use('/api/categories', categoryRoutes)
app.use('/api/sizes', sizeRoutes)
app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`);
});
