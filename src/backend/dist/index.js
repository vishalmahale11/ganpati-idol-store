import cors from "cors";
import express from "express";
import { prisma } from "./db.js";
import { InquirySource } from "./generated/prisma/enums.js";
const app = express();
const PORT = Number(process.env.PORT || 4000);
app.use(cors({ origin: true }));
app.use(express.json({ limit: "10mb" }));
/** Frontend sends `{ Clay: null }` etc. */
function categoryFromBody(input) {
    const key = Object.keys(input)[0];
    if (!key)
        throw new Error("Invalid category");
    return key;
}
function categoryToJson(category) {
    return { [category]: null };
}
function idolToWire(row) {
    return {
        id: row.id.toString(),
        name: row.name,
        description: row.description,
        category: categoryToJson(row.category),
        material: row.material,
        heightCm: row.heightCm.toString(),
        price: row.price.toString(),
        images: row.images,
        stockQuantity: row.stockQuantity.toString(),
        isActive: row.isActive,
        createdAt: String(row.createdAt.getTime()),
    };
}
function inquiryToWire(row) {
    return {
        id: row.id.toString(),
        idolId: row.idolId != null ? row.idolId.toString() : "",
        idolName: row.idolName,
        customerName: row.customerName,
        email: row.email,
        phone: row.phone,
        message: row.message,
        preferredContact: row.preferredContact,
        source: row.source,
        isRead: row.isRead,
        isArchived: row.isArchived,
        createdAt: String(row.createdAt.getTime()),
    };
}
app.get("/idols", async (_req, res) => {
    const idols = await prisma.idol.findMany({ orderBy: { id: "asc" } });
    res.json({ idols: idols.map(idolToWire) });
});
app.get("/inquiries", async (_req, res) => {
    const inquiries = await prisma.inquiry.findMany({ orderBy: { id: "asc" } });
    res.json({ inquiries: inquiries.map(inquiryToWire) });
});
app.post("/idols", async (req, res) => {
    try {
        const body = req.body;
        if (body.op === "delete") {
            await prisma.idol.delete({ where: { id: BigInt(body.id ?? "0") } });
            return res.json({ ok: true });
        }
        if (body.op === "create" && body.idol) {
            const i = body.idol;
            const row = await prisma.idol.create({
                data: {
                    name: i.name,
                    description: i.description,
                    category: categoryFromBody(i.category),
                    material: i.material,
                    heightCm: BigInt(i.heightCm),
                    price: BigInt(i.price),
                    images: i.images,
                    stockQuantity: BigInt(i.stockQuantity),
                    isActive: i.isActive,
                },
            });
            return res.json({ ok: true, idol: idolToWire(row) });
        }
        if (body.op === "update" && body.idol) {
            const i = body.idol;
            const row = await prisma.idol.update({
                where: { id: BigInt(i.id) },
                data: {
                    name: i.name,
                    description: i.description,
                    category: categoryFromBody(i.category),
                    material: i.material,
                    heightCm: BigInt(i.heightCm),
                    price: BigInt(i.price),
                    images: i.images,
                    stockQuantity: BigInt(i.stockQuantity),
                    isActive: i.isActive,
                },
            });
            return res.json({ ok: true, idol: idolToWire(row) });
        }
        return res.status(400).json({ error: "Unknown op" });
    }
    catch (e) {
        console.error(e);
        return res.status(500).json({
            error: e instanceof Error ? e.message : "Server error",
        });
    }
});
app.post("/inquiries", async (req, res) => {
    try {
        const body = req.body;
        if (body.op === "submit" && body.inquiry) {
            const q = body.inquiry;
            const idolId = q.idolId != null && q.idolId !== "" ? BigInt(q.idolId) : null;
            const source = q.source === "whatsapp" ? InquirySource.whatsapp : InquirySource.website;
            const row = await prisma.inquiry.create({
                data: {
                    idolId,
                    idolName: q.idolName,
                    customerName: q.customerName,
                    email: q.email,
                    phone: q.phone,
                    message: q.message,
                    preferredContact: q.preferredContact,
                    source,
                },
            });
            return res.json({ ok: true, inquiry: inquiryToWire(row) });
        }
        if (body.op === "markRead") {
            await prisma.inquiry.update({
                where: { id: BigInt(body.id ?? "0") },
                data: { isRead: true },
            });
            return res.json({ ok: true });
        }
        if (body.op === "archive") {
            await prisma.inquiry.update({
                where: { id: BigInt(body.id ?? "0") },
                data: { isArchived: true },
            });
            return res.json({ ok: true });
        }
        return res.status(400).json({ error: "Unknown op" });
    }
    catch (e) {
        console.error(e);
        return res.status(500).json({
            error: e instanceof Error ? e.message : "Server error",
        });
    }
});
app.get("/health", (_req, res) => {
    res.json({ ok: true, service: "ganpati-store-api" });
});
app.listen(PORT, () => {
    console.log(`Ganpati store API listening on http://127.0.0.1:${PORT}`);
});
