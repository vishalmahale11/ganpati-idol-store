import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Idol, IdolId, Inquiry, InquiryId, SubmitInquiryInput } from "../types";

/**
 * REST API base (PostgreSQL via Prisma — see `src/api`).
 * Override with VITE_STORE_API_URL for a full URL or another path.
 */
const API_BASE = import.meta.env.VITE_STORE_API_URL ?? "/api/store";

const DEFAULT_FETCH_TIMEOUT_MS = 20_000;

/** Avoid hung mutations when the API or DB is unreachable. */
function fetchWithTimeout(
  input: string,
  init: RequestInit = {},
  timeoutMs = DEFAULT_FETCH_TIMEOUT_MS,
): Promise<Response> {
  return fetch(input, {
    ...init,
    signal: AbortSignal.timeout(timeoutMs),
  });
}

function parseWireIdol(w: {
  id: string;
  name: string;
  description: string;
  category: Idol["category"];
  material: string;
  heightCm: string;
  price: string;
  images: string[];
  stockQuantity: string;
  isActive: boolean;
  createdAt: string;
}): Idol {
  return {
    id: BigInt(w.id),
    name: w.name,
    description: w.description,
    category: w.category,
    material: w.material,
    heightCm: BigInt(w.heightCm),
    price: BigInt(w.price),
    images: w.images,
    stockQuantity: BigInt(w.stockQuantity),
    isActive: w.isActive,
    createdAt: BigInt(w.createdAt),
  };
}

function toWireIdol(i: Idol) {
  return {
    id: i.id.toString(),
    name: i.name,
    description: i.description,
    category: i.category,
    material: i.material,
    heightCm: i.heightCm.toString(),
    price: i.price.toString(),
    images: i.images,
    stockQuantity: i.stockQuantity.toString(),
    isActive: i.isActive,
    createdAt: i.createdAt.toString(),
  };
}

function toWireCreateInput(input: Omit<Idol, "id" | "createdAt">) {
  return {
    name: input.name,
    description: input.description,
    category: input.category,
    material: input.material,
    heightCm: input.heightCm.toString(),
    price: input.price.toString(),
    images: input.images,
    stockQuantity: input.stockQuantity.toString(),
    isActive: input.isActive,
  };
}

function parseWireInquiry(w: {
  id: string;
  idolId: string;
  idolName: string;
  customerName: string;
  email: string;
  phone: string;
  message: string;
  preferredContact: string;
  source?: Inquiry["source"];
  isRead: boolean;
  isArchived: boolean;
  createdAt: string;
}): Inquiry {
  return {
    id: BigInt(w.id),
    idolId: w.idolId !== "" ? BigInt(w.idolId) : null,
    idolName: w.idolName,
    customerName: w.customerName,
    email: w.email,
    phone: w.phone,
    message: w.message,
    preferredContact: w.preferredContact,
    source: w.source === "whatsapp" ? "whatsapp" : "website",
    isRead: w.isRead,
    isArchived: w.isArchived,
    createdAt: BigInt(w.createdAt),
  };
}

async function fetchIdols(): Promise<Idol[]> {
  const r = await fetchWithTimeout(`${API_BASE}/idols`);
  if (!r.ok) throw new Error("Failed to load idols");
  const data: { idols: Parameters<typeof parseWireIdol>[0][] } = await r.json();
  return data.idols.map(parseWireIdol);
}

async function fetchInquiries(): Promise<Inquiry[]> {
  const r = await fetchWithTimeout(`${API_BASE}/inquiries`);
  if (!r.ok) throw new Error("Failed to load inquiries");
  const data: { inquiries: Parameters<typeof parseWireInquiry>[0][] } =
    await r.json();
  return data.inquiries.map(parseWireInquiry);
}

export function useIdols() {
  return useQuery<Idol[]>({
    queryKey: ["idols", "active"],
    queryFn: async () => {
      const idols = await fetchIdols();
      return idols.filter((i) => i.isActive);
    },
    staleTime: 30_000,
  });
}

export function useAllIdols() {
  return useQuery<Idol[]>({
    queryKey: ["idols", "all"],
    queryFn: fetchIdols,
    staleTime: 10_000,
  });
}

export function useIdol(id: IdolId | undefined) {
  return useQuery<Idol | null>({
    queryKey: ["idol", id?.toString()],
    queryFn: async () => {
      if (!id) return null;
      const idols = await fetchIdols();
      return idols.find((i) => i.id === id) ?? null;
    },
    enabled: id !== undefined,
  });
}

export function useInquiries() {
  return useQuery<Inquiry[]>({
    queryKey: ["inquiries"],
    queryFn: fetchInquiries,
    staleTime: 10_000,
  });
}

export function useCreateIdol() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: Omit<Idol, "id" | "createdAt">) => {
      const r = await fetchWithTimeout(`${API_BASE}/idols`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          op: "create",
          idol: toWireCreateInput(input),
        }),
      });
      if (!r.ok) throw new Error("Create failed");
      const data: { idol: Parameters<typeof parseWireIdol>[0] } =
        await r.json();
      return parseWireIdol(data.idol);
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
      const r = await fetchWithTimeout(`${API_BASE}/idols`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ op: "update", idol: toWireIdol(input) }),
      });
      if (!r.ok) throw new Error("Update failed");
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
      const r = await fetchWithTimeout(`${API_BASE}/idols`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ op: "delete", id: id.toString() }),
      });
      if (!r.ok) throw new Error("Delete failed");
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
    mutationFn: async (input: SubmitInquiryInput) => {
      const r = await fetchWithTimeout(`${API_BASE}/inquiries`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          op: "submit",
          inquiry: {
            idolId:
              input.idolId == null ? null : input.idolId.toString(),
            idolName: input.idolName,
            customerName: input.customerName,
            email: input.email,
            phone: input.phone,
            message: input.message,
            preferredContact: input.preferredContact,
            source: input.source ?? "website",
          },
        }),
      });
      if (!r.ok) throw new Error("Submit failed");
      const data: { inquiry: Parameters<typeof parseWireInquiry>[0] } =
        await r.json();
      return parseWireInquiry(data.inquiry);
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
      const r = await fetchWithTimeout(`${API_BASE}/inquiries`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ op: "markRead", id: id.toString() }),
      });
      if (!r.ok) throw new Error("Mark read failed");
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
      const r = await fetchWithTimeout(`${API_BASE}/inquiries`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ op: "archive", id: id.toString() }),
      });
      if (!r.ok) throw new Error("Archive failed");
      return true;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["inquiries"] });
    },
  });
}
