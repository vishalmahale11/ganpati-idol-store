import Storage "mo:caffeineai-object-storage/Storage";

module {
  public type IdolId = Nat;
  public type InquiryId = Nat;

  public type IdolCategory = {
    #Clay;
    #Marble;
    #EcoFriendly;
    #PlasterOfParis;
    #Metal;
    #Fiber;
  };

  // Internal type — uses mutable fields for in-place updates
  public type IdolInternal = {
    id : IdolId;
    var name : Text;
    var description : Text;
    var category : IdolCategory;
    var material : Text;
    var heightCm : Nat;
    var price : Nat;
    var images : [Storage.ExternalBlob];
    var stockQuantity : Nat;
    var isActive : Bool;
    createdAt : Int;
  };

  // Shared/public type — no var fields, no mutable containers
  public type Idol = {
    id : IdolId;
    name : Text;
    description : Text;
    category : IdolCategory;
    material : Text;
    heightCm : Nat;
    price : Nat;
    images : [Storage.ExternalBlob];
    stockQuantity : Nat;
    isActive : Bool;
    createdAt : Int;
  };

  public type CreateIdolInput = {
    name : Text;
    description : Text;
    category : IdolCategory;
    material : Text;
    heightCm : Nat;
    price : Nat;
    images : [Storage.ExternalBlob];
    stockQuantity : Nat;
  };

  public type UpdateIdolInput = {
    id : IdolId;
    name : Text;
    description : Text;
    category : IdolCategory;
    material : Text;
    heightCm : Nat;
    price : Nat;
    images : [Storage.ExternalBlob];
    stockQuantity : Nat;
    isActive : Bool;
  };

  // Internal type for inquiry (mutable fields)
  public type InquiryInternal = {
    id : InquiryId;
    idolId : IdolId;
    idolName : Text;
    customerName : Text;
    email : Text;
    phone : Text;
    message : Text;
    preferredContact : Text;
    createdAt : Int;
    var isRead : Bool;
  };

  // Shared/public type for inquiry
  public type Inquiry = {
    id : InquiryId;
    idolId : IdolId;
    idolName : Text;
    customerName : Text;
    email : Text;
    phone : Text;
    message : Text;
    preferredContact : Text;
    createdAt : Int;
    isRead : Bool;
  };

  public type SubmitInquiryInput = {
    idolId : IdolId;
    idolName : Text;
    customerName : Text;
    email : Text;
    phone : Text;
    message : Text;
    preferredContact : Text;
  };
};
