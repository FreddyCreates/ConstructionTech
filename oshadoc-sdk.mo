/// Contact Directory types — per-principal contact book for the OIS platform.
/// Shared with construction professionals: GCs, designers, PMs, resellers,
/// architects, engineers, and everyone in between.
module {

  /// Valid roles a contact can hold. A single person can hold several at once.
  public let validRoles : [Text] = [
    "GC", "Designer", "PM", "Reseller", "Client",
    "Subcontractor", "Supplier", "Architect", "Engineer", "Safety Officer",
  ];

  /// Immutable public-facing contact record (shared type — no var fields).
  public type Contact = {
    id             : Nat;
    name           : Text;
    email          : Text;
    phone          : Text;
    primaryRole    : Text;
    secondaryRoles : [Text];
    notes          : Text;
    createdAt      : Int;
    updatedAt      : Int;
  };

  /// Mutable internal record used for in-place updates.
  public type ContactMut = {
    id             : Nat;
    var name           : Text;
    var email          : Text;
    var phone          : Text;
    var primaryRole    : Text;
    var secondaryRoles : [Text];
    var notes          : Text;
    createdAt      : Int;
    var updatedAt      : Int;
  };
};
