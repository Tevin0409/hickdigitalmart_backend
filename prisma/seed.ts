import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Define roles and their descriptions
  const roles = [
    { name: 'SUDO', description: 'Super user with all privileges' },
    { name: 'ADMIN', description: 'Administrator with high-level privileges' },
    { name: 'USER', description: 'Regular user with basic privileges' },
    { name: 'TECHNICIAN', description: 'Technician with specific work-related privileges' },
    { name: 'WHOLESALER', description: 'Wholesaler with access to bulk orders' },
    { name: 'RETAILER', description: 'Retailer with access to retail-level orders' },
  ];

  // Define permissions and their descriptions
  const permissions = [
    { name: 'CREATEUSER', description: 'Permission to create users' },
    { name: 'VIEWUSER', description: 'Permission to view users' },
    { name: 'UPDATEUSER', description: 'Permission to update users' },
    { name: 'DELETEUSER', description: 'Permission to delete users' },
    { name: 'CREATEPRODUCT', description: 'Permission to create products' },
    { name: 'VIEWPRODUCT', description: 'Permission to view products' },
    { name: 'UPDATEPRODUCT', description: 'Permission to update products' },
    { name: 'DELETEPRODUCT', description: 'Permission to delete products' },
    { name: 'CREATEROLE', description: 'Permission to create roles' },
    { name: 'VIEWROLE', description: 'Permission to view roles' },
    { name: 'UPDATEROLE', description: 'Permission to update roles' },
    { name: 'DELETEROLE', description: 'Permission to delete roles' },
    { name: 'CREATEORDER', description: 'Permission to create orders' },
    { name: 'VIEWORDER', description: 'Permission to view orders' },
    { name: 'UPDATEORDER', description: 'Permission to update orders' },
    { name: 'DELETEORDER', description: 'Permission to delete orders' },
  ];

  // Seed roles
  for (const role of roles) {
    const existingRole = await prisma.role.findUnique({
      where: { name: role.name },
    });

    if (!existingRole) {
      await prisma.role.create({
        data: {
          name: role.name,
          description: role.description,
        },
      });
      console.log(`Created role: ${role.name}`);
    } else {
      console.log(`Role ${role.name} already exists`);
    }
  }

  // Seed permissions
  for (const permission of permissions) {
    const existingPermission = await prisma.permission.findUnique({
      where: { name: permission.name },
    });

    if (!existingPermission) {
      await prisma.permission.create({
        data: {
          name: permission.name,
          description: permission.description,
        },
      });
      console.log(`Created permission: ${permission.name}`);
    } else {
      console.log(`Permission ${permission.name} already exists`);
    }
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
