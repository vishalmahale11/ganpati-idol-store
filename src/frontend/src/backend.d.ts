import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface Idol {
    id: IdolId;
    stockQuantity: bigint;
    heightCm: bigint;
    name: string;
    createdAt: bigint;
    description: string;
    isActive: boolean;
    category: IdolCategory;
    price: bigint;
    material: string;
    images: Array<ExternalBlob>;
}
export interface CreateIdolInput {
    stockQuantity: bigint;
    heightCm: bigint;
    name: string;
    description: string;
    category: IdolCategory;
    price: bigint;
    material: string;
    images: Array<ExternalBlob>;
}
export type InquiryId = bigint;
export type IdolId = bigint;
export interface SubmitInquiryInput {
    customerName: string;
    email: string;
    idolName: string;
    preferredContact: string;
    message: string;
    phone: string;
    idolId: IdolId;
}
export interface Inquiry {
    id: InquiryId;
    customerName: string;
    createdAt: bigint;
    isRead: boolean;
    email: string;
    idolName: string;
    preferredContact: string;
    message: string;
    phone: string;
    idolId: IdolId;
}
export interface UpdateIdolInput {
    id: IdolId;
    stockQuantity: bigint;
    heightCm: bigint;
    name: string;
    description: string;
    isActive: boolean;
    category: IdolCategory;
    price: bigint;
    material: string;
    images: Array<ExternalBlob>;
}
export enum IdolCategory {
    EcoFriendly = "EcoFriendly",
    Clay = "Clay",
    Fiber = "Fiber",
    Metal = "Metal",
    PlasterOfParis = "PlasterOfParis",
    Marble = "Marble"
}
export interface backendInterface {
    archiveInquiry(id: InquiryId): Promise<boolean>;
    categoryToText(cat: IdolCategory): Promise<string>;
    createIdol(input: CreateIdolInput): Promise<Idol>;
    deleteIdol(id: IdolId): Promise<boolean>;
    getIdol(id: IdolId): Promise<Idol | null>;
    listAllIdols(): Promise<Array<Idol>>;
    listIdols(): Promise<Array<Idol>>;
    listInquiries(): Promise<Array<Inquiry>>;
    markInquiryRead(id: InquiryId): Promise<boolean>;
    submitInquiry(input: SubmitInquiryInput): Promise<Inquiry>;
    textToCategory(text: string): Promise<IdolCategory | null>;
    updateIdol(input: UpdateIdolInput): Promise<boolean>;
}
