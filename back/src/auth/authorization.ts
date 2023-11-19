import prismadb from "../lib/prismadb.js";

export function isAdminOrManager(role:string) {
  
  return role === "MANAGER" || role === "ADMIN";
}

export function isAdmin(role:string) {
  return role === "ADMIN";
}

export async function findUserWithEmail(userId:string) {
  const user = await prismadb.user.findUnique({
    where: {
      email: userId,
    },
    select:{
      id:true,
      name:true,
      email:true,
      role:true,
    }
  });
  return user;
}

export async function findStoreWithId(storeId:string) {
    const storeWithId = await prismadb.store.findUnique({
      where: {
        id: storeId,
      },
    });
    return storeWithId;
}

export async function checkForAssociatedRecords(storeId:string) {

    const billboardCount = await prismadb.billboard.count({
    where: {
      storeId: storeId,
    },
  });

  const categoryCount = await prismadb.category.count({
    where: {
      storeId: storeId,
    },
  });
  const sizeCount = await prismadb.size.count({
    where: {
      storeId: storeId,
    },
  });
  const tagCount = await prismadb.tag.count({
    where: {
      storeId: storeId,
    },
  });

  const productCount = await prismadb.product.count({
    where: {
      storeId: storeId,
    },
  });
  const brandCount = await prismadb.brand.count({
    where: {
      storeId: storeId,
    },
  });

//   const hasAssociatedRecords = billboardCount > 0 || categoryCount > 0 || productCount > 0|| brandCount > 0;

  const associatedRecordsMessage = [];

  if (billboardCount > 0) {
     associatedRecordsMessage.push(`${billboardCount} billboard(s)`);
  }

  if (categoryCount > 0) {
     associatedRecordsMessage.push(`${categoryCount} category(s)`);
  }

  if (productCount > 0) {
     associatedRecordsMessage.push(`${productCount} product(s)`);
  }

  if (brandCount > 0) {
     associatedRecordsMessage.push(`${brandCount} brand(s)`);
  }
  if (sizeCount > 0) {
     associatedRecordsMessage.push(`${sizeCount} size(s)`);
  }
  if (tagCount > 0) {
     associatedRecordsMessage.push(`${tagCount} tag(s)`);
  }

  return associatedRecordsMessage.join(", ");
    
}
