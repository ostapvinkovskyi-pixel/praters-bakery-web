// Fall pre-order menu. Shared by the page and the server: the server prices
// every order from this list, never from client-sent prices.
export type MenuCategory = "breads" | "cookies" | "pies" | "cakes" | "cheesecakes" | "others";

export interface MenuItem {
  id: string;
  name: string;
  category: MenuCategory;
  priceCents: number;
  unit: string;
  min: number;
  seasonal?: boolean;
  note?: string;
}

export const MENU_CATEGORIES: { id: MenuCategory; label: string; blurb: string }[] = [
  { id: "breads", label: "Rolls & Breads", blurb: "The cinnamon rolls that started it all, plus loaves and fall muffins." },
  { id: "cookies", label: "Cookies", blurb: "Quarter pound cookies. Minimum of 12 per flavor." },
  { id: "pies", label: "Pies", blurb: "Whole pies, made to order." },
  { id: "cakes", label: "Cakes", blurb: "Pound cakes, layer cakes and pumpkin rolls." },
  { id: "cheesecakes", label: "Cheesecakes", blurb: "Graham cracker crust originals and specialty flavors." },
  { id: "others", label: "Puddings & Brownies", blurb: "Banana pudding, pralines and fudge brownies by the pan." },
];

export const MENU: MenuItem[] = [
  { id: "cinnamon-rolls", name: "Cinnamon Rolls", category: "breads", priceCents: 375, unit: "each", min: 12, note: "Our most loved item. Cream cheese icing." },
  { id: "apple-cinnamon-rolls", name: "Apple Cinnamon Rolls", category: "breads", priceCents: 400, unit: "each", min: 1 },
  { id: "pecan-sticky-buns", name: "Pecan Sticky Buns", category: "breads", priceCents: 400, unit: "each", min: 12 },
  { id: "original-loaf", name: "Original Loaf Bread", category: "breads", priceCents: 500, unit: "loaf", min: 2 },
  { id: "garlic-cheese-bread", name: "Garlic Cheese Bread", category: "breads", priceCents: 600, unit: "loaf", min: 2 },
  { id: "apple-bread", name: "Apple Bread", category: "breads", priceCents: 750, unit: "loaf", min: 2 },
  { id: "pumpkin-bread", name: "Pumpkin Bread", category: "breads", priceCents: 700, unit: "loaf", min: 2 },
  { id: "pumpkin-choc-chip-muffins", name: "Pumpkin Chocolate Chip Muffins", category: "breads", priceCents: 400, unit: "each", min: 6, seasonal: true },
  { id: "apple-muffins", name: "Apple Muffins", category: "breads", priceCents: 400, unit: "each", min: 6, seasonal: true },

  { id: "milk-chocolate-chip", name: "Milk Chocolate Chip", category: "cookies", priceCents: 375, unit: "cookie", min: 12 },
  { id: "apple-caramel-cookie", name: "Apple Caramel", category: "cookies", priceCents: 400, unit: "cookie", min: 12, seasonal: true },
  { id: "chocolate-reeses-cookie", name: "Chocolate Reese's Peanut Butter Chip", category: "cookies", priceCents: 400, unit: "cookie", min: 12 },
  { id: "pecan-milk-chocolate-cookie", name: "Pecan Milk Chocolate Chip", category: "cookies", priceCents: 400, unit: "cookie", min: 12 },
  { id: "peanut-butter-chunk-cookie", name: "Peanut Butter Chocolate Chunk", category: "cookies", priceCents: 400, unit: "cookie", min: 12 },
  { id: "oatmeal-raisin-cookie", name: "Oatmeal Raisin", category: "cookies", priceCents: 400, unit: "cookie", min: 12 },
  { id: "double-chocolate-cookie", name: "Double Chocolate", category: "cookies", priceCents: 400, unit: "cookie", min: 12 },
  { id: "snickerdoodle-cookie", name: "Snickerdoodle", category: "cookies", priceCents: 400, unit: "cookie", min: 12 },
  { id: "dozen-2oz-chocolate-chip", name: "One Dozen 2oz Chocolate Chip Cookies", category: "cookies", priceCents: 2300, unit: "dozen", min: 1 },
  { id: "dozen-2oz-specialty", name: "One Dozen 2oz Specialty Cookies", category: "cookies", priceCents: 2500, unit: "dozen", min: 1, note: "One flavor per dozen. Name it in your order notes." },

  { id: "peanut-butter-pie", name: "Peanut Butter Pie", category: "pies", priceCents: 2750, unit: "pie", min: 1, note: "Chocolate crust and chocolate drizzle." },
  { id: "key-lime-pie", name: "Key Lime Pie", category: "pies", priceCents: 2750, unit: "pie", min: 1 },
  { id: "pecan-pie", name: "Pecan Pie", category: "pies", priceCents: 3250, unit: "pie", min: 1 },
  { id: "pumpkin-pie", name: "Pumpkin Pie", category: "pies", priceCents: 2250, unit: "pie", min: 1 },
  { id: "chess-pie", name: "Chess Pie", category: "pies", priceCents: 2250, unit: "pie", min: 1 },
  { id: "apple-pie", name: "Apple Pie", category: "pies", priceCents: 3000, unit: "pie", min: 1, seasonal: true },

  { id: "original-pound-cake", name: "Original Pound Cake", category: "cakes", priceCents: 3500, unit: "cake", min: 1 },
  { id: "pound-cake-salted-caramel", name: "Add Salted Caramel to a Pound Cake", category: "cakes", priceCents: 500, unit: "add on", min: 1 },
  { id: "lemon-pound-cake", name: "Lemon Pound Cake", category: "cakes", priceCents: 4500, unit: "cake", min: 1 },
  { id: "apple-pound-cake", name: "Apple Pound Cake with Salted Caramel", category: "cakes", priceCents: 4750, unit: "cake", min: 1, seasonal: true },
  { id: "reeses-layer-cake", name: "8\" 3 Tier Chocolate Reese's Peanut Butter Cake", category: "cakes", priceCents: 6000, unit: "cake", min: 1 },
  { id: "cookies-cream-cake", name: "8\" 3 Tier Cookies n' Cream Cake", category: "cakes", priceCents: 6000, unit: "cake", min: 1 },
  { id: "grannys-chocolate-cake", name: "Granny's Chocolate Cake", category: "cakes", priceCents: 3500, unit: "cake", min: 1 },
  { id: "coconut-cake", name: "Coconut Cake", category: "cakes", priceCents: 7500, unit: "cake", min: 1, note: "3 tier with cream cheese icing." },
  { id: "carrot-cake", name: "Carrot Cake", category: "cakes", priceCents: 7000, unit: "cake", min: 1, note: "3 tier with cream cheese icing and walnuts." },
  { id: "pumpkin-roll", name: "Pumpkin Roll", category: "cakes", priceCents: 2500, unit: "roll", min: 1, note: "About 12 to 14 servings." },

  { id: "original-cheesecake", name: "Original Cheesecake", category: "cheesecakes", priceCents: 6000, unit: "cheesecake", min: 1, note: "Graham cracker crust." },
  { id: "cheesecake-drizzle", name: "Add Salted Caramel or Chocolate Drizzle", category: "cheesecakes", priceCents: 750, unit: "add on", min: 1, note: "Tell us which in your order notes." },
  { id: "apple-butter-cheesecake", name: "Apple Butter Topped Cheesecake", category: "cheesecakes", priceCents: 7000, unit: "cheesecake", min: 1, seasonal: true },
  { id: "pumpkin-cheesecake", name: "Pumpkin Cheesecake on Gingersnap Crust", category: "cheesecakes", priceCents: 7000, unit: "cheesecake", min: 1, seasonal: true },
  { id: "oreo-cheesecake", name: "Oreo Cheesecake", category: "cheesecakes", priceCents: 7000, unit: "cheesecake", min: 1 },
  { id: "espresso-cheesecake", name: "Espresso Cheesecake", category: "cheesecakes", priceCents: 7000, unit: "cheesecake", min: 1 },
  { id: "chocolate-cheesecake", name: "Chocolate Cheesecake", category: "cheesecakes", priceCents: 7000, unit: "cheesecake", min: 1 },
  { id: "reeses-cheesecake", name: "Reese's Cheesecake", category: "cheesecakes", priceCents: 7000, unit: "cheesecake", min: 1 },
  { id: "turtle-cheesecake", name: "Turtle Cheesecake", category: "cheesecakes", priceCents: 7500, unit: "cheesecake", min: 1 },
  { id: "butterfinger-cheesecake", name: "Butterfinger Salted Caramel Cheesecake", category: "cheesecakes", priceCents: 7500, unit: "cheesecake", min: 1 },

  { id: "banana-pudding-9", name: "Banana Pudding, 9\" Round", category: "others", priceCents: 3000, unit: "pudding", min: 1, note: "12 servings." },
  { id: "banana-pudding-6", name: "Banana Pudding, 6\" Round", category: "others", priceCents: 1600, unit: "pudding", min: 1, note: "6 servings." },
  { id: "pecan-pralines", name: "Southern Pecan Pralines", category: "others", priceCents: 500, unit: "each", min: 12 },
  { id: "fudge-brownies", name: "Fudge Brownies with Dark Chocolate Chips", category: "others", priceCents: 2500, unit: "8x8 pan", min: 1 },
  { id: "turtle-brownies", name: "Turtle Fudge Brownies", category: "others", priceCents: 3500, unit: "8x8 pan", min: 1, note: "Salted caramel and toasted pecans." },
];

export const MENU_BY_ID = new Map(MENU.map((item) => [item.id, item]));

export function formatPrice(cents: number): string {
  const dollars = cents / 100;
  return `$${cents % 100 === 0 ? dollars.toFixed(0) : dollars.toFixed(2)}`;
}
