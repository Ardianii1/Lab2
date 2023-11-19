const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
   const deleteAttributes = await prisma.attribute.deleteMany({
      where: {
         AND: [{ name: { equals: "Attribute 4" } }, { value: { equals: "Value 4" } }],
      },
   });
   console.log(`Deleted ${deleteAttributes.count} attributes.`);
}

main()
   .then(() => prisma.$disconnect())
   .catch(async (e) => {
      console.error(e);
      await prisma.$disconnect();
      process.exit(1);
   });