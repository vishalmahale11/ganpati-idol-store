import "dotenv/config";
import { prisma } from "../src/db.js";

const samples: Array<{
  category: "Clay" | "Marble" | "EcoFriendly" | "Metal" | "Fiber";
  name: string;
  description: string;
  material: string;
  heightCm: bigint;
  price: bigint;
  stockQuantity: bigint;
}> = [
  {
    category: "Clay",
    name: "Ganesh Clay Classic",
    description:
      "Traditional hand-crafted clay Ganpati idol with intricate detailing and natural finish.",
    material: "Natural Clay",
    heightCm: 12n,
    price: 1200n,
    stockQuantity: 15n,
  },
  {
    category: "Marble",
    name: "White Marble Ganesh",
    description:
      "Premium white marble Ganesh idol with gold-painted accents, perfect for home shrines.",
    material: "Italian Marble",
    heightCm: 18n,
    price: 8500n,
    stockQuantity: 5n,
  },
  {
    category: "EcoFriendly",
    name: "Seed Ganesh",
    description:
      "Plant-me Ganesh made from seed paper — immerse in soil and watch it bloom!",
    material: "Recycled Paper & Seeds",
    heightCm: 6n,
    price: 650n,
    stockQuantity: 30n,
  },
];

async function main() {
  const count = await prisma.idol.count();
  if (count > 0) {
    console.log("Database already has idols; skipping seed.");
    return;
  }

  const img = ["/assets/generated/ganpati-hero.dim_1200x600.jpg"];

  for (const s of samples) {
    await prisma.idol.create({
      data: {
        name: s.name,
        description: s.description,
        category: s.category,
        material: s.material,
        heightCm: s.heightCm,
        price: s.price,
        images: img,
        stockQuantity: s.stockQuantity,
        isActive: true,
      },
    });
  }

  console.log(`Seeded ${samples.length} idols.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
