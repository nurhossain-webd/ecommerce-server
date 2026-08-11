import bcrypt from "bcrypt";
import prisma from "../src/lib/prisma.js";

const categories = [
  "Electronics",
  "Fashion",
  "Home & Living",
  "Sports & Outdoors",
  "Books & Stationery",
  "Beauty & Personal Care",
];

const products = [
  { name: "Noise-Cancelling Headphones", description: "Wireless over-ear headphones with rich sound and long battery life.", price: 149.99, stock: 18, category: "Electronics", status: "ACTIVE" },
  { name: "Mechanical Keyboard", description: "Compact hot-swappable keyboard with tactile switches.", price: 89.99, stock: 24, category: "Electronics", status: "ACTIVE" },
  { name: "Portable Bluetooth Speaker", description: "Water-resistant speaker designed for travel and outdoor use.", price: 59.5, stock: 31, category: "Electronics", status: "ACTIVE" },
  { name: "Smart Fitness Watch", description: "Activity, heart-rate, and sleep tracking in a lightweight design.", price: 119, stock: 0, category: "Electronics", status: "OUT_OF_STOCK" },
  { name: "Classic Cotton Hoodie", description: "Soft everyday hoodie with a relaxed unisex fit.", price: 42, stock: 45, category: "Fashion", status: "ACTIVE" },
  { name: "Everyday Canvas Backpack", description: "Durable backpack with a padded laptop compartment.", price: 54.75, stock: 26, category: "Fashion", status: "ACTIVE" },
  { name: "Minimal Leather Wallet", description: "Slim wallet with six card slots and a cash compartment.", price: 34.99, stock: 37, category: "Fashion", status: "ACTIVE" },
  { name: "Ceramic Table Lamp", description: "Warm bedside lighting with a textured ceramic base.", price: 47.5, stock: 14, category: "Home & Living", status: "ACTIVE" },
  { name: "Premium Throw Blanket", description: "Lightweight woven blanket for sofas, beds, and reading corners.", price: 38, stock: 22, category: "Home & Living", status: "ACTIVE" },
  { name: "Bamboo Desk Organizer", description: "Multi-compartment organizer for a clean workspace.", price: 27.25, stock: 33, category: "Home & Living", status: "ACTIVE" },
  { name: "Insulated Water Bottle", description: "Double-wall stainless steel bottle that keeps drinks cold all day.", price: 25, stock: 52, category: "Sports & Outdoors", status: "ACTIVE" },
  { name: "Resistance Band Set", description: "Five resistance levels with handles and a travel pouch.", price: 29.99, stock: 40, category: "Sports & Outdoors", status: "ACTIVE" },
  { name: "Lightweight Yoga Mat", description: "Non-slip cushioned mat for yoga and home workouts.", price: 36.5, stock: 19, category: "Sports & Outdoors", status: "ACTIVE" },
  { name: "Productivity Planner", description: "Undated weekly planner for goals, priorities, and habits.", price: 18.99, stock: 60, category: "Books & Stationery", status: "ACTIVE" },
  { name: "Hardcover Dot Journal", description: "Premium dotted notebook with numbered pages and ribbon markers.", price: 16.5, stock: 48, category: "Books & Stationery", status: "ACTIVE" },
  { name: "Modern Web Development Guide", description: "A practical guide to building maintainable full-stack applications.", price: 39.99, stock: 17, category: "Books & Stationery", status: "ACTIVE" },
  { name: "Daily Skincare Set", description: "A gentle cleanser, moisturizer, and face serum bundle.", price: 64, stock: 21, category: "Beauty & Personal Care", status: "ACTIVE" },
  { name: "Citrus Cedar Candle", description: "A clean-burning aromatic candle with citrus and cedar notes.", price: 22.5, stock: 0, category: "Beauty & Personal Care", status: "INACTIVE" },
] as const;

const demoUsers = [
  { name: "Amina Rahman", email: "amina.demo@shopstack.local" },
  { name: "Nabil Hasan", email: "nabil.demo@shopstack.local" },
  { name: "Sara Ahmed", email: "sara.demo@shopstack.local" },
];

async function main() {
  const categoryMap = new Map<string, string>();
  for (const name of categories) {
    const category = await prisma.category.upsert({
      where: { name },
      update: { status: "ACTIVE", isDeleted: false },
      create: { name },
    });
    categoryMap.set(name, category.id);
  }

  const productMap = new Map<string, { id: string; price: number }>();
  for (const item of products) {
    const data = {
      name: item.name,
      description: item.description,
      price: item.price,
      stock: item.stock,
      status: item.status,
      categoryId: categoryMap.get(item.category)!,
      isDeleted: false,
    };
    const existing = await prisma.product.findFirst({ where: { name: item.name } });
    const product = existing
      ? await prisma.product.update({ where: { id: existing.id }, data })
      : await prisma.product.create({ data });
    productMap.set(item.name, { id: product.id, price: product.price });
  }

  const hashedPassword = await bcrypt.hash("DemoUser123!", 10);
  const seededUsers = [];
  for (const item of demoUsers) {
    seededUsers.push(await prisma.user.upsert({
      where: { email: item.email },
      update: { name: item.name, password: hashedPassword, role: "USER", isDeleted: false },
      create: { ...item, password: hashedPassword },
    }));
  }

  const userIds = seededUsers.map((user) => user.id);
  const oldOrders = await prisma.order.findMany({ where: { userId: { in: userIds } }, select: { id: true } });
  const oldOrderIds = oldOrders.map((order) => order.id);

  await prisma.$transaction([
    prisma.orderItem.deleteMany({ where: { orderId: { in: oldOrderIds } } }),
    prisma.order.deleteMany({ where: { id: { in: oldOrderIds } } }),
    prisma.review.deleteMany({ where: { userId: { in: userIds } } }),
  ]);

  const orderPlans = [
    { user: 0, status: "DELIVERED", items: [["Mechanical Keyboard", 1], ["Productivity Planner", 2]] },
    { user: 0, status: "SHIPPED", items: [["Premium Throw Blanket", 1], ["Citrus Cedar Candle", 1]] },
    { user: 1, status: "CONFIRMED", items: [["Noise-Cancelling Headphones", 1], ["Minimal Leather Wallet", 1]] },
    { user: 1, status: "PENDING", items: [["Insulated Water Bottle", 2], ["Resistance Band Set", 1]] },
    { user: 2, status: "DELIVERED", items: [["Everyday Canvas Backpack", 1], ["Hardcover Dot Journal", 2], ["Daily Skincare Set", 1]] },
  ] as const;

  for (const plan of orderPlans) {
    const items = plan.items.map(([name, quantity]) => {
      const product = productMap.get(name)!;
      return { productId: product.id, quantity, price: product.price };
    });
    await prisma.order.create({
      data: {
        userId: seededUsers[plan.user].id,
        status: plan.status,
        totalPrice: items.reduce((total, item) => total + item.price * item.quantity, 0),
        orderItems: { create: items },
      },
    });
  }

  const reviewPlans = [
    [0, "Mechanical Keyboard", 5, "Excellent typing feel and a compact layout."],
    [0, "Premium Throw Blanket", 4, "Soft, lightweight, and looks great on the sofa."],
    [1, "Noise-Cancelling Headphones", 5, "The sound quality and battery life are impressive."],
    [1, "Insulated Water Bottle", 4, "Keeps water cold for hours and does not leak."],
    [1, "Resistance Band Set", 5, "A complete set that is easy to travel with."],
    [2, "Everyday Canvas Backpack", 4, "Comfortable and fits my laptop perfectly."],
    [2, "Hardcover Dot Journal", 5, "Great paper quality and thoughtful details."],
    [2, "Daily Skincare Set", 4, "Gentle products and a simple daily routine."],
  ] as const;

  await prisma.review.createMany({
    data: reviewPlans.map(([userIndex, productName, rating, comment]) => ({
      userId: seededUsers[userIndex].id,
      productId: productMap.get(productName)!.id,
      rating,
      comment,
    })),
  });

  const [userCount, categoryCount, productCount, orderCount, reviewCount] = await Promise.all([
    prisma.user.count({ where: { isDeleted: false } }),
    prisma.category.count({ where: { isDeleted: false } }),
    prisma.product.count({ where: { isDeleted: false } }),
    prisma.order.count({ where: { isDeleted: false } }),
    prisma.review.count({ where: { isDeleted: false } }),
  ]);
  console.log({ users: userCount, categories: categoryCount, products: productCount, orders: orderCount, reviews: reviewCount });
  console.log("Demo customer password: DemoUser123!");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
