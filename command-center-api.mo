/// Contact Directory API mixin.
///
/// Injected state:
///   `cdState` — the CDState container from lib/contact-directory
///
/// Colony invariants:
///   - CPL authorityCheck at the top of every public function.
///   - Per-principal isolation: callers only access their own contacts.
///   - All functions use the inline { #ok; #err } variant — no Result.Result.
import CPL "../cpl";

import CDLib "../lib/contact-directory";
import Types "../types/contact-directory";

mixin (cdState : CDLib.CDState) {

  // ─── Create ────────────────────────────────────────────────────────────────

  /// Create a new contact in the caller's per-principal directory.
  public shared ({ caller }) func createContact(
    name           : Text,
    email          : Text,
    phone          : Text,
    primaryRole    : Text,
    secondaryRoles : [Text],
    notes          : Text,
  ) : async { #ok : Types.Contact; #err : Text } {
    assert CPL.authorityCheck(#GCUser, #GCUser);
    CDLib.createContact(cdState, caller, name, email, phone, primaryRole, secondaryRoles, notes);
  };

  // ─── Update ────────────────────────────────────────────────────────────────

  /// Update an existing contact. Caller must own the contact.
  public shared ({ caller }) func updateContact(
    id             : Nat,
    name           : Text,
    email          : Text,
    phone          : Text,
    primaryRole    : Text,
    secondaryRoles : [Text],
    notes          : Text,
  ) : async { #ok : Types.Contact; #err : Text } {
    assert CPL.authorityCheck(#GCUser, #GCUser);
    CDLib.updateContact(cdState, caller, id, name, email, phone, primaryRole, secondaryRoles, notes);
  };

  // ─── Delete ────────────────────────────────────────────────────────────────

  /// Delete a contact by ID. Caller must own the contact.
  public shared ({ caller }) func deleteContact(
    id : Nat,
  ) : async { #ok : (); #err : Text } {
    assert CPL.authorityCheck(#GCUser, #GCUser);
    CDLib.deleteContact(cdState, caller, id);
  };

  // ─── Read ──────────────────────────────────────────────────────────────────

  /// Get a single contact by ID from the caller's directory.
  public shared query ({ caller }) func getContact(
    id : Nat,
  ) : async ?Types.Contact {
    assert CPL.authorityCheck(#GCUser, #GCUser);
    CDLib.getContact(cdState, caller, id);
  };

  /// List all contacts in the caller's directory.
  public shared query ({ caller }) func listContacts() : async [Types.Contact] {
    assert CPL.authorityCheck(#GCUser, #GCUser);
    CDLib.listContacts(cdState, caller);
  };

  /// Filter the caller's contacts by primary or secondary role.
  public shared query ({ caller }) func listContactsByRole(
    role : Text,
  ) : async [Types.Contact] {
    assert CPL.authorityCheck(#GCUser, #GCUser);
    CDLib.listContactsByRole(cdState, caller, role);
  };

  /// Case-insensitive search across the caller's contacts by name or email.
  public shared query ({ caller }) func searchContacts(
    searchQuery : Text,
  ) : async [Types.Contact] {
    assert CPL.authorityCheck(#GCUser, #GCUser);
    CDLib.searchContacts(cdState, caller, searchQuery);
  };
};
