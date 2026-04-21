export type IdolId = bigint;
export type InquiryId = bigint;

export type IdolCategory =
  | { Clay: null }
  | { Marble: null }
  | { EcoFriendly: null }
  | { PlasterOfParis: null }
  | { Metal: null }
  | { Fiber: null };

export interface Idol {
  id: IdolId;
  name: string;
  description: string;
  category: IdolCategory;
  material: string;
  heightCm: bigint;
  price: bigint;
  images: string[]; // directURL from ExternalBlob
  stockQuantity: bigint;
  isActive: boolean;
  createdAt: bigint;
}

export interface CreateIdolInput {
  name: string;
  description: string;
  category: IdolCategory;
  material: string;
  heightCm: bigint;
  price: bigint;
  images: string[];
  stockQuantity: bigint;
}

export interface UpdateIdolInput {
  id: IdolId;
  name: string;
  description: string;
  category: IdolCategory;
  material: string;
  heightCm: bigint;
  price: bigint;
  images: string[];
  stockQuantity: bigint;
  isActive: boolean;
}

export interface Inquiry {
  id: InquiryId;
  idolId: IdolId;
  idolName: string;
  customerName: string;
  email: string;
  phone: string;
  message: string;
  preferredContact: string;
  isRead: boolean;
  isArchived: boolean;
  createdAt: bigint;
}

export interface SubmitInquiryInput {
  idolId: IdolId;
  idolName: string;
  customerName: string;
  email: string;
  phone: string;
  message: string;
  preferredContact: string;
}

export function categoryLabel(cat: IdolCategory): string {
  if ("Clay" in cat) return "Clay";
  if ("Marble" in cat) return "Marble";
  if ("EcoFriendly" in cat) return "Eco-Friendly";
  if ("PlasterOfParis" in cat) return "Plaster of Paris";
  if ("Metal" in cat) return "Metal";
  if ("Fiber" in cat) return "Fiber";
  return "Unknown";
}

export function categoryKey(cat: IdolCategory): string {
  return Object.keys(cat)[0];
}

export const ALL_CATEGORIES: { label: string; value: IdolCategory }[] = [
  { label: "Clay", value: { Clay: null } },
  { label: "Marble", value: { Marble: null } },
  { label: "Eco-Friendly", value: { EcoFriendly: null } },
  { label: "Plaster of Paris", value: { PlasterOfParis: null } },
  { label: "Metal", value: { Metal: null } },
  { label: "Fiber", value: { Fiber: null } },
];

export function formatPrice(price: bigint): string {
  return `₹${Number(price).toLocaleString("en-IN")}`;
}
