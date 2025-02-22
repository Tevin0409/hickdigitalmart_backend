import { PrismaClient } from "@prisma/client";
import fs from "fs";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// Function to read JSON files
const readJsonFile = (filePath: string) =>
  JSON.parse(fs.readFileSync(filePath, "utf8"));

async function main() {
  // Load JSON data
  const roles = readJsonFile("./data/roles.json");
  const permissions = readJsonFile("./data/permissions.json");
  const categories = readJsonFile("./data/categories.json");
  const subcategories = readJsonFile("./data/subcategories.json");

  // Seed roles
  for (const role of roles) {
    const existingRole = await prisma.role.findUnique({
      where: { name: role.name },
    });
    if (!existingRole) {
      await prisma.role.create({ data: role });
      console.log(`Created role: ${role.name}`);
    }
  }

  // Seed permissions
  for (const permission of permissions) {
    const existingPermission = await prisma.permission.findUnique({
      where: { name: permission.name },
    });
    if (!existingPermission) {
      await prisma.permission.create({ data: permission });
      console.log(`Created permission: ${permission.name}`);
    }
  }

  // Seed categories
  for (const category of categories) {
    let existingCategory = await prisma.category.findFirst({
      where: { name: category },
    });
    if (!existingCategory) {
      existingCategory = await prisma.category.create({
        data: { name: category },
      });
      console.log(`Created category: ${category}`);
    }

    // Seed subcategories
    if (subcategories[category]) {
      for (const subcategory of subcategories[category]) {
        const existingSubcategory = await prisma.subCategory.findFirst({
          where: { name: subcategory, categoryId: existingCategory.id },
        });

        if (!existingSubcategory) {
          await prisma.subCategory.create({
            data: { name: subcategory, categoryId: existingCategory.id },
          });
          console.log(`Created subcategory: ${subcategory} under ${category}`);
        }
      }
    }
  }
   // Add Default User
   const existingUser = await prisma.user.findUnique({
    where: { email: 'anonymous@yopmail.com' },
  });

  if (!existingUser) {
    const hashedPassword = await bcrypt.hash('password123', 10);

    // Fetch role ID for 'Anonymous' role (or use a fallback role)
    const role = await prisma.role.findUnique({ where: { name: 'USER' } });

    if (!role) {
      console.warn("Role 'User' not found. Ensure it exists before seeding users.");
      return;
    }

    await prisma.user.create({
      data: {
        email: 'anonymous@yopmail.com',
        password: hashedPassword,
        firstName: 'Anonymous',
        lastName: 'User',
        roleId: role.id, 
      },
    });

    console.log('Created default user: anonymous@yopmail.com');
  } else {
    console.log('Default user already exists');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
