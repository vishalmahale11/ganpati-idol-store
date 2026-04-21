import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Idol, IdolId, Inquiry, InquiryId } from "../types";

// Since backend bindings are not yet generated with idol methods,
// we use mock data for development. When backend is ready,
// replace these with actual actor calls via useActor.

const MOCK_IDOLS: Idol[] = [
  {
    id: 1n,
    name: "Shubh Drishti Ganpati",
    description:
      "A magnificent marble Ganpati idol with intricate gold detailing and vibrant colors. Perfect for home puja and festive celebrations.",
    category: { Marble: null },
    material: "Pure White Marble",
    heightCm: 30n,
    price: 4500n,
    images: ["/assets/generated/ganpati-hero.dim_1200x600.jpg"],
    stockQuantity: 5n,
    isActive: true,
    createdAt: BigInt(Date.now()),
  },
  {
    id: 2n,
    name: "Ridhi Sidhi Ganesh",
    description:
      "Beautiful brass Ganesh idol with traditional artisan work. Brings prosperity and removes obstacles from your path.",
    category: { Metal: null },
    material: "Brass",
    heightCm: 45n,
    price: 8500n,
    images: ["/assets/generated/ganpati-hero.dim_1200x600.jpg"],
    stockQuantity: 3n,
    isActive: true,
    createdAt: BigInt(Date.now()),
  },
  {
    id: 3n,
    name: "Eco-Friendly Clay Idol",
    description:
      "Handcrafted clay Ganpati made from natural materials. Fully biodegradable and environmentally conscious choice.",
    category: { EcoFriendly: null },
    material: "Natural Clay",
    heightCm: 20n,
    price: 1200n,
    images: ["/assets/generated/ganpati-hero.dim_1200x600.jpg"],
    stockQuantity: 15n,
    isActive: true,
    createdAt: BigInt(Date.now()),
  },
  {
    id: 4n,
    name: "Ganeshi Ganpati",
    description:
      "Traditional clay Ganpati with vibrant festival colors. A beloved classic that has graced homes for generations.",
    category: { Clay: null },
    material: "Traditional Clay",
    heightCm: 25n,
    price: 1800n,
    images: ["/assets/generated/ganpati-hero.dim_1200x600.jpg"],
    stockQuantity: 10n,
    isActive: true,
    createdAt: BigInt(Date.now()),
  },
  {
    id: 5n,
    name: "Rudhi Sidhi Ganesh",
    description:
      "Large ceremonial marble Ganesh for grand pooja halls and mandaps. Exquisitely carved by master artisans.",
    category: { Marble: null },
    material: "Rajasthani Marble",
    heightCm: 60n,
    price: 15000n,
    images: ["/assets/generated/ganpati-hero.dim_1200x600.jpg"],
    stockQuantity: 2n,
    isActive: true,
    createdAt: BigInt(Date.now()),
  },
  {
    id: 6n,
    name: "Fiber Ganpati Murti",
    description:
      "Lightweight fiber idol perfect for pandals and large decorations. Detailed painting with weather-resistant finish.",
    category: { Fiber: null },
    material: "Fiber Reinforced",
    heightCm: 90n,
    price: 6500n,
    images: ["/assets/generated/ganpati-hero.dim_1200x600.jpg"],
    stockQuantity: 8n,
    isActive: true,
    createdAt: BigInt(Date.now()),
  },
];

let mockIdols = [...MOCK_IDOLS];
let mockInquiries: Inquiry[] = [];
let nextIdolId = 7n;
let nextInquiryId = 1n;

// Public hooks
export function useIdols() {
  return useQuery<Idol[]>({
    queryKey: ["idols", "active"],
    queryFn: async () => mockIdols.filter((i) => i.isActive),
    staleTime: 30_000,
  });
}

export function useAllIdols() {
  return useQuery<Idol[]>({
    queryKey: ["idols", "all"],
    queryFn: async () => [...mockIdols],
    staleTime: 10_000,
  });
}

export function useIdol(id: IdolId | undefined) {
  return useQuery<Idol | null>({
    queryKey: ["idol", id?.toString()],
    queryFn: async () => {
      if (!id) return null;
      return mockIdols.find((i) => i.id === id) ?? null;
    },
    enabled: id !== undefined,
  });
}

export function useInquiries() {
  return useQuery<Inquiry[]>({
    queryKey: ["inquiries"],
    queryFn: async () => [...mockInquiries],
    staleTime: 10_000,
  });
}

// Mutations
export function useCreateIdol() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: Omit<Idol, "id" | "createdAt">) => {
      const idol: Idol = {
        ...input,
        id: nextIdolId++,
        createdAt: BigInt(Date.now()),
      };
      mockIdols.push(idol);
      return idol;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["idols"] });
    },
  });
}

export function useUpdateIdol() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: Idol) => {
      const idx = mockIdols.findIndex((i) => i.id === input.id);
      if (idx >= 0) mockIdols[idx] = input;
      return true;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["idols"] });
    },
  });
}

export function useDeleteIdol() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: IdolId) => {
      mockIdols = mockIdols.filter((i) => i.id !== id);
      return true;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["idols"] });
    },
  });
}

export function useSubmitInquiry() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (
      input: Omit<Inquiry, "id" | "isRead" | "isArchived" | "createdAt">,
    ) => {
      const inquiry: Inquiry = {
        ...input,
        id: nextInquiryId++,
        isRead: false,
        isArchived: false,
        createdAt: BigInt(Date.now()),
      };
      mockInquiries.push(inquiry);
      return inquiry;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["inquiries"] });
    },
  });
}

export function useMarkInquiryRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: InquiryId) => {
      const idx = mockInquiries.findIndex((i) => i.id === id);
      if (idx >= 0)
        mockInquiries[idx] = { ...mockInquiries[idx], isRead: true };
      return true;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["inquiries"] });
    },
  });
}

export function useArchiveInquiry() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: InquiryId) => {
      const idx = mockInquiries.findIndex((i) => i.id === id);
      if (idx >= 0)
        mockInquiries[idx] = { ...mockInquiries[idx], isArchived: true };
      return true;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["inquiries"] });
    },
  });
}
