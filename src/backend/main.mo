import List "mo:core/List";
import Time "mo:core/Time";
import MixinObjectStorage "mo:caffeineai-object-storage/Mixin";
import IdolCatalogMixin "mixins/idol-catalog-api";
import Types "types/idol-catalog";

actor {
  // ── Object Storage ─────────────────────────────────────────────────────────
  include MixinObjectStorage();

  // ── State ──────────────────────────────────────────────────────────────────
  let idols = List.empty<Types.IdolInternal>();
  let inquiries = List.empty<Types.InquiryInternal>();
  let nextIdolId = { var value : Nat = 0 };
  let nextInquiryId = { var value : Nat = 0 };

  // ── Seed sample idols on first deploy ─────────────────────────────────────
  do {
    let now = Time.now();
    let samples : [(Types.IdolCategory, Text, Text, Text, Nat, Nat, Nat)] = [
      (#Clay, "Ganesh Clay Classic", "Traditional hand-crafted clay Ganpati idol with intricate detailing and natural finish.", "Natural Clay", 12, 1200, 15),
      (#Clay, "Eco Clay Ganesh", "100% natural clay idol — eco-friendly, fully biodegradable for immersion.", "Organic Clay", 8, 850, 20),
      (#Marble, "White Marble Ganesh", "Premium white marble Ganesh idol with gold-painted accents, perfect for home shrines.", "Italian Marble", 18, 8500, 5),
      (#Marble, "Black Marble Ganesh", "Elegant black marble Ganesh with silver finish, a statement piece for any puja room.", "Black Marble", 15, 7200, 4),
      (#EcoFriendly, "Seed Ganesh", "Plant-me Ganesh made from seed paper — immerse in soil and watch it bloom!", "Recycled Paper & Seeds", 6, 650, 30),
      (#EcoFriendly, "Terracotta Eco Ganesh", "Handmade terracotta idol using natural clay without chemical paints.", "Terracotta", 10, 950, 18),
      (#Metal, "Brass Ganesh Idol", "Traditional brass Ganesh idol with antique finish, hand-crafted by artisans.", "Pure Brass", 14, 5500, 8),
      (#Fiber, "Large Fiber Ganesh", "Durable fiber idol with vibrant colours, ideal for pandals and outdoor display.", "High-Grade Fiber", 36, 15000, 3),
    ];
    var sampleId : Nat = 0;
    for ((cat, name, desc, material, height, price, stock) in samples.vals()) {
      let idol : Types.IdolInternal = {
        id = sampleId;
        var name;
        var description = desc;
        var category = cat;
        var material;
        var heightCm = height;
        var price;
        var images = [];
        var stockQuantity = stock;
        var isActive = true;
        createdAt = now;
      };
      idols.add(idol);
      sampleId += 1;
    };
    nextIdolId.value := sampleId;
  };

  // ── Idol Catalog ───────────────────────────────────────────────────────────
  include IdolCatalogMixin(idols, inquiries, nextIdolId, nextInquiryId);
};
