import { findStoreWithId, findUserWithEmail, isAdminOrManager } from "./auth/authorization.js";
import { Request, Response,NextFunction } from "express";

export async function checkAuthorization(req:Request, res:Response, next:NextFunction) {
    const  {storeId}  = req.params;
   //  console.log("Req.params: ", req.params)
   //  console.log("Req.body: ", req.body);

    if (!storeId) {
      return res.status(400).json({ message: "StoreId required" });
    }
    const storeWithId = await findStoreWithId(storeId);

    if (!storeWithId) {
      return res.status(404).json({ message: "Store not found" });
    }
    const userid = req.body?.userId; 
    if (!userid) {
        console.log("No userId here : Unauthorized");
        return res.status(400).json({ message: "UserId is required" });
    }
    const user = await findUserWithEmail(userid);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

  if (isAdminOrManager(user?.role!)) {
     next(); 
   } else {
     console.log(isAdminOrManager(user.role))
    res.status(403).json({ error: "You are not authorized to perform this action." });
  }
}
