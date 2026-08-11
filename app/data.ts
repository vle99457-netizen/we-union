export type Product = {
  id: string;
  name: string;
  world: "CREATE" | "HONOR" | "BELONG";
  category: "Jerseys" | "Outerwear" | "Tops" | "Accessories";
  price: number;
  tag: "NEW" | "FEATURED" | "READY TO SHIP" | "CUSTOMIZABLE" | "LIMITED";
  customizable: boolean;
  colors: string[];
  image: string;
  imagePosition: string;
  description: string;
};

export const products: Product[] = [
  {
    id: "union-01-jersey",
    name: "Union 01 Jersey",
    world: "CREATE",
    category: "Jerseys",
    price: 118,
    tag: "CUSTOMIZABLE",
    customizable: true,
    colors: ["Obsidian", "Warm Ivory", "Union Gold"],
    image: "/reference/image4.jpeg",
    imagePosition: "11% 45%",
    description: "An original match jersey shaped for personal marks, clean movement, and everyday wear.",
  },
  {
    id: "legacy-track-jacket",
    name: "Legacy Track Jacket",
    world: "HONOR",
    category: "Outerwear",
    price: 164,
    tag: "LIMITED",
    customizable: false,
    colors: ["Obsidian", "Steel"],
    image: "/reference/image4.jpeg",
    imagePosition: "38% 47%",
    description: "A structured track layer built as a quiet tribute to the people who shaped the game.",
  },
  {
    id: "home-ground-knit",
    name: "Home Ground Knit",
    world: "BELONG",
    category: "Tops",
    price: 92,
    tag: "NEW",
    customizable: true,
    colors: ["Warm Ivory", "Union Gold"],
    image: "/reference/image4.jpeg",
    imagePosition: "65% 47%",
    description: "A relaxed knit inspired by the colors, routes, and rituals that turn a place into home.",
  },
  {
    id: "makers-cap",
    name: "Makers Cap",
    world: "CREATE",
    category: "Accessories",
    price: 48,
    tag: "READY TO SHIP",
    customizable: true,
    colors: ["Obsidian", "Warm Ivory"],
    image: "/reference/image4.jpeg",
    imagePosition: "90% 48%",
    description: "A six-panel cap with a clean crown and an embroidery-ready front field.",
  },
  {
    id: "chapter-96-jersey",
    name: "Chapter 96 Jersey",
    world: "HONOR",
    category: "Jerseys",
    price: 132,
    tag: "FEATURED",
    customizable: false,
    colors: ["Obsidian", "Warm Ivory"],
    image: "/reference/image6.jpeg",
    imagePosition: "78% 45%",
    description: "A numbered edition that translates a defining season into restrained graphic detail.",
  },
  {
    id: "district-warmup",
    name: "District Warmup",
    world: "BELONG",
    category: "Outerwear",
    price: 148,
    tag: "CUSTOMIZABLE",
    customizable: true,
    colors: ["Steel", "Obsidian", "Union Gold"],
    image: "/reference/image15.jpeg",
    imagePosition: "45% 34%",
    description: "A versatile team warmup designed to carry a neighborhood, club, or shared identity.",
  },
];

export const stories = [
  {
    slug: "the-mark-we-carry",
    type: "DESIGN NOTE",
    title: "The Mark We Carry",
    excerpt: "How a single line became a symbol for making, remembering, and belonging.",
    image: "/reference/image12.jpeg",
    position: "22% 52%",
    date: "AUG 08, 2026",
  },
  {
    slug: "built-from-the-block",
    type: "COMMUNITY",
    title: "Built From the Block",
    excerpt: "A neighborhood running club turns familiar streets into a shared uniform.",
    image: "/reference/image15.jpeg",
    position: "58% 34%",
    date: "JUL 22, 2026",
  },
  {
    slug: "inside-the-stitch",
    type: "CRAFT",
    title: "Inside the Stitch",
    excerpt: "The checks, choices, and hands behind every personalized piece.",
    image: "/reference/image14.jpeg",
    position: "50% 48%",
    date: "JUL 03, 2026",
  },
];

export const faqs = [
  ["How long does personalization take?", "Most personalized pieces move through design review, production, inspection, and packing within 10–15 business days before shipping."],
  ["Can I change a design after ordering?", "You can request changes until the proof is approved. Production begins after approval, so later changes may not be possible."],
  ["Which files can I upload?", "For this prototype, PNG, JPG, and PDF are accepted. Uploaded SVG files are not executed. Production files are reviewed before use."],
  ["How do I track an order?", "Open Order Tracking and enter your order number and email. Logged-in customers can also see progress in Account."],
  ["Do you support team orders?", "Yes. Team & Group Orders supports roster details, repeated sizing, names, and numbers, including CSV import."],
] as const;

export const worlds = {
  create: {
    name: "CREATE",
    kicker: "ORIGINAL BY WE UNION. PERSONALIZED BY YOU.",
    body: "Original silhouettes become a precise field for your name, number, colors, and marks.",
    image: "/reference/image5.jpeg",
    position: "18% 42%",
  },
  honor: {
    name: "HONOR",
    kicker: "CREATED FOR THOSE WHO LEFT A MARK.",
    body: "Limited collections built around the people, moments, and standards worth carrying forward.",
    image: "/reference/image6.jpeg",
    position: "78% 42%",
  },
  belong: {
    name: "BELONG",
    kicker: "MADE FOR THE PLACES THAT MOVE US.",
    body: "Shared colors and familiar details that make a street, team, city, or community feel like home.",
    image: "/reference/image15.jpeg",
    position: "48% 42%",
  },
} as const;

export const orderStages = [
  "Confirmed",
  "Design Review",
  "Approved",
  "In Production",
  "Quality Inspection",
  "Packed",
  "Shipped",
  "Delivered",
];

export const formatPrice = (value: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);
