import List "mo:core/List";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Types "../types/idol-catalog";
import IdolCatalogLib "../lib/idol-catalog";

mixin (
  idols : List.List<Types.IdolInternal>,
  inquiries : List.List<Types.InquiryInternal>,
  nextIdolId : { var value : Nat },
  nextInquiryId : { var value : Nat },
) {

  // ── Internal: admin check ─────────────────────────────────────────────────

  func requireAdmin(caller : Principal) {
    if (not caller.isController()) {
      Runtime.trap("Unauthorized: controllers only");
    };
  };

  // ── Admin: Idol management ─────────────────────────────────────────────────

  public shared ({ caller }) func createIdol(input : Types.CreateIdolInput) : async Types.Idol {
    requireAdmin(caller);
    let id = nextIdolId.value;
    nextIdolId.value += 1;
    let idol = IdolCatalogLib.createIdol(idols, id, input);
    idols.add(idol);
    idol.toPublicIdol();
  };

  public shared ({ caller }) func updateIdol(input : Types.UpdateIdolInput) : async Bool {
    requireAdmin(caller);
    IdolCatalogLib.updateIdol(idols, input);
  };

  public shared ({ caller }) func deleteIdol(id : Types.IdolId) : async Bool {
    requireAdmin(caller);
    IdolCatalogLib.softDeleteIdol(idols, id);
  };

  // ── Admin: read all idols ──────────────────────────────────────────────────

  public shared query ({ caller }) func listAllIdols() : async [Types.Idol] {
    requireAdmin(caller);
    IdolCatalogLib.listAllIdols(idols);
  };

  // ── Public: browse idols ──────────────────────────────────────────────────

  public query func getIdol(id : Types.IdolId) : async ?Types.Idol {
    IdolCatalogLib.getIdol(idols, id);
  };

  public query func listIdols() : async [Types.Idol] {
    IdolCatalogLib.listActiveIdols(idols);
  };

  // ── Public: category helpers ──────────────────────────────────────────────

  public query func categoryToText(cat : Types.IdolCategory) : async Text {
    IdolCatalogLib.categoryToText(cat);
  };

  public query func textToCategory(text : Text) : async ?Types.IdolCategory {
    IdolCatalogLib.textToCategory(text);
  };

  // ── Public: submit inquiry ────────────────────────────────────────────────

  public shared func submitInquiry(input : Types.SubmitInquiryInput) : async Types.Inquiry {
    let id = nextInquiryId.value;
    nextInquiryId.value += 1;
    let inq = IdolCatalogLib.submitInquiry(inquiries, id, input);
    inquiries.add(inq);
    inq.toPublicInquiry();
  };

  // ── Admin: inquiry management ─────────────────────────────────────────────

  public shared query ({ caller }) func listInquiries() : async [Types.Inquiry] {
    requireAdmin(caller);
    IdolCatalogLib.listInquiries(inquiries);
  };

  public shared ({ caller }) func markInquiryRead(id : Types.InquiryId) : async Bool {
    requireAdmin(caller);
    IdolCatalogLib.markInquiryRead(inquiries, id);
  };

  public shared ({ caller }) func archiveInquiry(id : Types.InquiryId) : async Bool {
    requireAdmin(caller);
    IdolCatalogLib.archiveInquiry(inquiries, id);
  };
};
