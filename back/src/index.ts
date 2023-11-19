import express, { Application, Request, Response } from "express";
import storeRoutes from "./routes/storeRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import sizeRoutes from "./routes/sizeRoutes.js";
import brandRoutes from "./routes/brandRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import tagRoutes from "./routes/tagRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import billboardRoutes from "./routes/billboardRoutes.js";
import checkoutRoutes from "./routes/checkoutRoutes.js";
import teamRoutes from "./routes/teamRoutes.js";
import playerRoutes from "./routes/playerRoutes.js";
import cors from "cors";
import { StrictAuthProp } from "@clerk/clerk-sdk-node";

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
app.get("/", (req: Request, res: Response) => {
   res.send("Hello, From Tech-Store API");
   console.log("Hello, From Tech-Store API");
});
app.use("/api/stores", storeRoutes);
app.use("/api/billboards", billboardRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/sizes", sizeRoutes);
app.use("/api/brands", brandRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/products", productRoutes);
app.use("/api/tags", tagRoutes);
app.use("/api/teams", teamRoutes);
app.use("/api/players", playerRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/checkout", checkoutRoutes);
app.listen(port, () => {
   console.log(`Server is running on port http://localhost:${port}`);
});
