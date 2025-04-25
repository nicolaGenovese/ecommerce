import { PrismaClient } from '../src/generated/prisma';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Admin User',
      password: adminPassword,
      role: 'ADMIN',
    },
  });

  // Create regular user
  const userPassword = await bcrypt.hash('user123', 10);
  const user = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      email: 'user@example.com',
      name: 'Regular User',
      password: userPassword,
      role: 'USER',
    },
  });

  console.log({ admin, user });

  // Create categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { name: 'Electronics' },
      update: {},
      create: { name: 'Electronics' },
    }),
    prisma.category.upsert({
      where: { name: 'Clothing' },
      update: {},
      create: { name: 'Clothing' },
    }),
    prisma.category.upsert({
      where: { name: 'Books' },
      update: {},
      create: { name: 'Books' },
    }),
    prisma.category.upsert({
      where: { name: 'Home & Kitchen' },
      update: {},
      create: { name: 'Home & Kitchen' },
    }),
  ]);

  console.log({ categories });

  // Create products
  // For each product, we need to create a unique ID first
  const smartphoneId = 'prod_smartphone_x';
  const laptopId = 'prod_laptop_pro';
  const headphonesId = 'prod_wireless_headphones';
  const tshirtId = 'prod_cotton_tshirt';
  const jeansId = 'prod_denim_jeans';
  const programmingBookId = 'prod_programming_guide';
  const scifiBookId = 'prod_scifi_novel';
  const coffeeMakerId = 'prod_coffee_maker';
  const blenderId = 'prod_blender';

  const products = await Promise.all([
    // Electronics
    prisma.product.upsert({
      where: { id: smartphoneId },
      update: {},
      create: {
        id: smartphoneId,
        name: 'Smartphone X',
        description: 'Latest smartphone with advanced features',
        price: 799.99,
        stock: 50,
        image: 'https://placehold.co/600x400?text=Smartphone',
        categoryId: categories[0].id,
      },
    }),
    prisma.product.upsert({
      where: { id: laptopId },
      update: {},
      create: {
        id: laptopId,
        name: 'Laptop Pro',
        description: 'Powerful laptop for professionals',
        price: 1299.99,
        stock: 30,
        image: 'https://placehold.co/600x400?text=Laptop',
        categoryId: categories[0].id,
      },
    }),
    prisma.product.upsert({
      where: { id: headphonesId },
      update: {},
      create: {
        id: headphonesId,
        name: 'Wireless Headphones',
        description: 'Premium noise-cancelling headphones',
        price: 199.99,
        stock: 100,
        image: 'https://placehold.co/600x400?text=Headphones',
        categoryId: categories[0].id,
      },
    }),

    // Clothing
    prisma.product.upsert({
      where: { id: tshirtId },
      update: {},
      create: {
        id: tshirtId,
        name: 'Cotton T-Shirt',
        description: 'Comfortable cotton t-shirt',
        price: 19.99,
        stock: 200,
        image: 'https://placehold.co/600x400?text=T-Shirt',
        categoryId: categories[1].id,
      },
    }),
    prisma.product.upsert({
      where: { id: jeansId },
      update: {},
      create: {
        id: jeansId,
        name: 'Denim Jeans',
        description: 'Classic denim jeans',
        price: 49.99,
        stock: 150,
        image: 'https://placehold.co/600x400?text=Jeans',
        categoryId: categories[1].id,
      },
    }),

    // Books
    prisma.product.upsert({
      where: { id: programmingBookId },
      update: {},
      create: {
        id: programmingBookId,
        name: 'Programming Guide',
        description: 'Comprehensive programming guide for beginners',
        price: 29.99,
        stock: 75,
        image: 'https://placehold.co/600x400?text=Programming+Book',
        categoryId: categories[2].id,
      },
    }),
    prisma.product.upsert({
      where: { id: scifiBookId },
      update: {},
      create: {
        id: scifiBookId,
        name: 'Science Fiction Novel',
        description: 'Bestselling science fiction novel',
        price: 14.99,
        stock: 120,
        image: 'https://placehold.co/600x400?text=SciFi+Book',
        categoryId: categories[2].id,
      },
    }),

    // Home & Kitchen
    prisma.product.upsert({
      where: { id: coffeeMakerId },
      update: {},
      create: {
        id: coffeeMakerId,
        name: 'Coffee Maker',
        description: 'Automatic coffee maker with timer',
        price: 89.99,
        stock: 40,
        image: 'https://placehold.co/600x400?text=Coffee+Maker',
        categoryId: categories[3].id,
      },
    }),
    prisma.product.upsert({
      where: { id: blenderId },
      update: {},
      create: {
        id: blenderId,
        name: 'Blender',
        description: 'High-speed blender for smoothies and more',
        price: 69.99,
        stock: 60,
        image: 'https://placehold.co/600x400?text=Blender',
        categoryId: categories[3].id,
      },
    }),
  ]);

  console.log({ products });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });