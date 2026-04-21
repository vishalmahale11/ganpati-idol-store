import List "mo:core/List";
import Time "mo:core/Time";
import Types "../types/idol-catalog";

module {

  // ── Category helpers ──────────────────────────────────────────────────────

  public func categoryToText(cat : Types.IdolCategory) : Text {
    switch cat {
      case (#Clay) "Clay";
      case (#Marble) "Marble";
      case (#EcoFriendly) "Eco-Friendly";
      case (#PlasterOfParis) "Plaster of Paris";
      case (#Metal) "Metal";
      case (#Fiber) "Fiber";
    };
  };

  public func textToCategory(text : Text) : ?Types.IdolCategory {
    switch text {
      case "Clay" ? #Clay;
      case "Marble" ? #Marble;
      case "Eco-Friendly" ? #EcoFriendly;
      case "EcoFriendly" ? #EcoFriendly;
      case "Plaster of Paris" ? #PlasterOfParis;
      case "PlasterOfParis" ? #PlasterOfParis;
      case "Metal" ? #Metal;
      case "Fiber" ? #Fiber;
      case _ null;
    };
  };

  // ── Idol helpers ──────────────────────────────────────────────────────────

  public func toPublicIdol(self : Types.IdolInternal) : Types.Idol {
    {
      id = self.id;
      name = self.name;
      description = self.description;
      category = self.category;
      material = self.material;
      heightCm = self.heightCm;
      price = self.price;
      images = self.images;
      stockQuantity = self.stockQuantity;
      isActive = self.isActive;
      createdAt = self.createdAt;
    };
  };

  public func createIdol(
    _idols : List.List<Types.IdolInternal>,
    nextId : Nat,
    input : Types.CreateIdolInput,
  ) : Types.IdolInternal {
    {
      id = nextId;
      var name = input.name;
      var description = input.description;
      var category = input.category;
      var material = input.material;
      var heightCm = input.heightCm;
      var price = input.price;
      var images = input.images;
      var stockQuantity = input.stockQuantity;
      var isActive = true;
      createdAt = Time.now();
    };
  };

  public func getIdol(
    idols : List.List<Types.IdolInternal>,
    id : Types.IdolId,
  ) : ?Types.Idol {
    switch (idols.find(func(i : Types.IdolInternal) : Bool = i.id == id)) {
      case (?idol) ?toPublicIdol(idol);
      case null null;
    };
  };

  public func listActiveIdols(idols : List.List<Types.IdolInternal>) : [Types.Idol] {
    idols
      .filter(func(i : Types.IdolInternal) : Bool = i.isActive)
      .map<Types.IdolInternal, Types.Idol>(func(i) { toPublicIdol(i) })
      .toArray();
  };

  public func listAllIdols(idols : List.List<Types.IdolInternal>) : [Types.Idol] {
    idols
      .map<Types.IdolInternal, Types.Idol>(func(i) { toPublicIdol(i) })
      .toArray();
  };

  public func updateIdol(
    idols : List.List<Types.IdolInternal>,
    input : Types.UpdateIdolInput,
  ) : Bool {
    switch (idols.find(func(i : Types.IdolInternal) : Bool = i.id == input.id)) {
      case null false;
      case (?idol) {
        idol.name := input.name;
        idol.description := input.description;
        idol.category := input.category;
        idol.material := input.material;
        idol.heightCm := input.heightCm;
        idol.price := input.price;
        idol.images := input.images;
        idol.stockQuantity := input.stockQuantity;
        idol.isActive := input.isActive;
        true;
      };
    };
  };

  public func softDeleteIdol(
    idols : List.List<Types.IdolInternal>,
    id : Types.IdolId,
  ) : Bool {
    switch (idols.find(func(i : Types.IdolInternal) : Bool = i.id == id)) {
      case null false;
      case (?idol) {
        idol.isActive := false;
        true;
      };
    };
  };

  // ── Inquiry helpers ───────────────────────────────────────────────────────

  public func toPublicInquiry(self : Types.InquiryInternal) : Types.Inquiry {
    {
      id = self.id;
      idolId = self.idolId;
      idolName = self.idolName;
      customerName = self.customerName;
      email = self.email;
      phone = self.phone;
      message = self.message;
      preferredContact = self.preferredContact;
      createdAt = self.createdAt;
      isRead = self.isRead;
    };
  };

  public func submitInquiry(
    _inquiries : List.List<Types.InquiryInternal>,
    nextId : Nat,
    input : Types.SubmitInquiryInput,
  ) : Types.InquiryInternal {
    {
      id = nextId;
      idolId = input.idolId;
      idolName = input.idolName;
      customerName = input.customerName;
      email = input.email;
      phone = input.phone;
      message = input.message;
      preferredContact = input.preferredContact;
      createdAt = Time.now();
      var isRead = false;
    };
  };

  public func listInquiries(inquiries : List.List<Types.InquiryInternal>) : [Types.Inquiry] {
    inquiries
      .map<Types.InquiryInternal, Types.Inquiry>(func(i) { toPublicInquiry(i) })
      .toArray();
  };

  public func markInquiryRead(
    inquiries : List.List<Types.InquiryInternal>,
    id : Types.InquiryId,
  ) : Bool {
    switch (inquiries.find(func(i : Types.InquiryInternal) : Bool = i.id == id)) {
      case null false;
      case (?inq) {
        inq.isRead := true;
        true;
      };
    };
  };

  public func archiveInquiry(
    inquiries : List.List<Types.InquiryInternal>,
    id : Types.InquiryId,
  ) : Bool {
    switch (inquiries.findIndex(func(i : Types.InquiryInternal) : Bool = i.id == id)) {
      case null false;
      case (?idx) {
        let size = inquiries.size();
        if (size > 1) {
          let last = inquiries.at(size - 1 : Nat);
          inquiries.put(idx, last);
        };
        inquiries.truncate(size - 1 : Nat);
        true;
      };
    };
  };
};
