export type SeriesSlug = "water-ripple" | "black-rift";

export type Product = {
  id: string;
  name: string;
  series: SeriesSlug;
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
    id: "water-ripple-24-jersey",
    name: "Water Ripple 24 Jersey",
    series: "water-ripple",
    world: "CREATE",
    category: "Jerseys",
    price: 118,
    tag: "CUSTOMIZABLE",
    customizable: true,
    colors: ["Obsidian", "Warm Ivory", "Chrome"],
    image: "/products/black-rift-24.jpg",
    imagePosition: "50% 50%",
    description: "An original match jersey shaped for clean movement, embroidered marks, and everyday wear.",
  },
  {
    id: "black-rift-track-jacket",
    name: "Black Rift Track Jacket",
    series: "black-rift",
    world: "HONOR",
    category: "Outerwear",
    price: 164,
    tag: "LIMITED",
    customizable: false,
    colors: ["Obsidian", "Chrome"],
    image: "/products/legacy-34.jpg",
    imagePosition: "50% 50%",
    description: "A structured track layer with a restrained embroidered line and a sharp American sportswear fit.",
  },
  {
    id: "white-pulse-knit",
    name: "White Pulse Knit",
    series: "water-ripple",
    world: "BELONG",
    category: "Tops",
    price: 92,
    tag: "NEW",
    customizable: true,
    colors: ["Warm Ivory", "Chrome", "Signal Blue"],
    image: "/products/ivory-signal-17.jpg",
    imagePosition: "50% 50%",
    description: "A relaxed knit built around flowing lines, soft structure, and an embroidery-ready chest field.",
  },
  {
    id: "night-form-cap",
    name: "Night Form Cap",
    series: "black-rift",
    world: "CREATE",
    category: "Accessories",
    price: 48,
    tag: "READY TO SHIP",
    customizable: true,
    colors: ["Obsidian", "Warm Ivory"],
    image: "/products/night-form-01.jpg",
    imagePosition: "50% 50%",
    description: "A six-panel cap with a clean crown and a precise embroidery field.",
  },
  {
    id: "legacy-mark-34-jersey",
    name: "Legacy Mark 34 Jersey",
    series: "black-rift",
    world: "HONOR",
    category: "Jerseys",
    price: 132,
    tag: "FEATURED",
    customizable: false,
    colors: ["Obsidian", "Warm Ivory", "Signal Red"],
    image: "/products/legacy-34.jpg",
    imagePosition: "50% 50%",
    description: "A numbered edition that turns a defining season into restrained graphic and embroidered detail.",
  },
  {
    id: "district-line-warmup",
    name: "District Line Warmup",
    series: "water-ripple",
    world: "BELONG",
    category: "Outerwear",
    price: 148,
    tag: "CUSTOMIZABLE",
    customizable: true,
    colors: ["Chrome", "Obsidian", "Signal Blue"],
    image: "/products/ivory-signal-17.jpg",
    imagePosition: "50% 50%",
    description: "A versatile warmup designed to carry a neighborhood, club, or shared identity.",
  },
  {
    id: "ripple-training-top",
    name: "Ripple Training Top",
    series: "water-ripple",
    world: "CREATE",
    category: "Tops",
    price: 86,
    tag: "NEW",
    customizable: true,
    colors: ["Warm Ivory", "Obsidian"],
    image: "/products/black-rift-24.jpg",
    imagePosition: "58% 48%",
    description: "A breathable training top with a fluid seam map and room for personal numbers.",
  },
  {
    id: "rift-sideline-shell",
    name: "Rift Sideline Shell",
    series: "black-rift",
    world: "BELONG",
    category: "Outerwear",
    price: 178,
    tag: "FEATURED",
    customizable: false,
    colors: ["Obsidian", "Chrome"],
    image: "/products/night-form-01.jpg",
    imagePosition: "44% 50%",
    description: "A weather-ready shell with angular paneling and low-profile embroidered branding.",
  },
];

export const series = {
  "water-ripple": {
    slug: "water-ripple",
    name: "WATER RIPPLE SERIES",
    edition: "WHITE PULSE",
    copy: "Motion translated into flowing lines.",
    image: "/reference/image10.jpeg",
    position: "58% 42%",
    tone: "light",
  },
  "black-rift": {
    slug: "black-rift",
    name: "CRACK SERIES",
    edition: "BLACK RIFT",
    copy: "Break the ordinary.",
    image: "/reference/image19.jpeg",
    position: "52% 42%",
    tone: "dark",
  },
} as const;

export const stories = [
  {
    slug: "the-mark-we-carry",
    type: "DESIGN NOTE",
    title: "The Mark We Carry",
    excerpt: "How a single line became a symbol for making, remembering, and belonging.",
    image: "/reference/image12.jpeg",
    position: "22% 52%",
    date: "2026-08-08",
  },
  {
    slug: "built-from-the-block",
    type: "COMMUNITY",
    title: "Built From the Block",
    excerpt: "A neighborhood running club turns familiar streets into a shared uniform.",
    image: "/reference/image15.jpeg",
    position: "58% 34%",
    date: "2026-07-22",
  },
  {
    slug: "inside-the-stitch",
    type: "CRAFT",
    title: "Inside the Stitch",
    excerpt: "The checks, choices, and hands behind every personalized piece.",
    image: "/editorial/craft-detail.jpg",
    position: "50% 50%",
    date: "2026-07-03",
  },
];

export const faqs = [
  ["How long does personalization take?", "Most personalized pieces move through design review, production, inspection, and packing within 10 to 15 business days before shipping."],
  ["Can I change a design after ordering?", "You can request changes until the proof is approved. Production begins after approval, so later changes may not be possible."],
  ["Which files can I upload?", "For this prototype, PNG, JPG, and PDF are accepted. Uploaded SVG files are not executed. Production files are reviewed before use."],
  ["How do I track an order?", "Open Order Tracking and enter your order number and email. Logged-in customers can also see progress in Account."],
  ["Do you support team orders?", "Yes. Team and Group Orders supports roster details, repeated sizing, names, and numbers, including CSV import."],
] as const;

export const worlds = {
  create: {
    name: "CREATE",
    kicker: "ORIGINAL BY WE. PERSONALIZED BY YOU.",
    body: "Original silhouettes become a precise field for your name, number, colors, and marks.",
    image: "/reference/image5.jpeg",
    position: "72% 31%",
  },
  honor: {
    name: "HONOR",
    kicker: "CREATED FOR THOSE WHO LEFT A MARK.",
    body: "Limited collections built around the people, moments, and standards worth carrying forward.",
    image: "/reference/image3.jpeg",
    position: "76% 28%",
  },
  belong: {
    name: "BELONG",
    kicker: "MADE FOR THE PLACES THAT MOVE US.",
    body: "Shared colors and familiar details that make a street, team, city, or community feel like home.",
    image: "/reference/image15.jpeg",
    position: "51% 38%",
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

export const formatDate = (value: string) =>
  new Intl.DateTimeFormat("en-US", { month: "short", day: "2-digit", year: "numeric", timeZone: "UTC" })
    .format(new Date(`${value}T00:00:00Z`))
    .toUpperCase();

export const formatMonthDay = (value: string) =>
  new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", timeZone: "UTC" })
    .format(new Date(`${value}T00:00:00Z`))
    .toUpperCase();
