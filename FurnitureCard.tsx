import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronDown, ChevronUp, Plus, Trash2, Users } from "lucide-react";
import React, { useState, useEffect } from "react";

export interface Contact {
  id: string;
  name: string;
  email: string;
  role: string;
  company?: string;
}

interface ContactsDirectoryProps {
  selectedIds: string[];
  onSelectionChange: (ids: string[]) => void;
  onContactsChange?: (contacts: Contact[]) => void;
}

const ROLE_GROUPS: Record<string, string[]> = {
  "Critical Path": [
    "Safety Officer",
    "Superintendent",
    "GC Representative",
    "PM",
  ],
  Subcontractors: [
    "Electrical",
    "Plumbing",
    "HVAC",
    "Flooring",
    "Painting",
    "Drywall",
    "Concrete",
    "Steel",
  ],
  "Client & Executive": [
    "Owner Representative",
    "Director",
    "Executive",
    "Client",
  ],
  Other: ["Architect", "Engineer", "Inspector", "Consultant"],
};

const ROLE_COLORS: Record<string, string> = {
  "Safety Officer": "bg-red-500/20 text-red-400 border-red-500/40",
  Superintendent: "bg-blue-500/20 text-blue-400 border-blue-500/40",
  "GC Representative": "bg-orange-500/20 text-orange-400 border-orange-500/40",
  PM: "bg-purple-500/20 text-purple-400 border-purple-500/40",
  Electrical: "bg-yellow-500/20 text-yellow-400 border-yellow-500/40",
  Plumbing: "bg-cyan-500/20 text-cyan-400 border-cyan-500/40",
  HVAC: "bg-emerald-500/20 text-emerald-400 border-emerald-500/40",
  Flooring: "bg-pink-500/20 text-pink-400 border-pink-500/40",
  Painting: "bg-indigo-500/20 text-indigo-400 border-indigo-500/40",
  Drywall: "bg-teal-500/20 text-teal-400 border-teal-500/40",
  Concrete: "bg-gray-500/20 text-gray-400 border-gray-500/40",
  Steel: "bg-slate-500/20 text-slate-400 border-slate-500/40",
  "Owner Representative": "bg-amber-500/20 text-amber-400 border-amber-500/40",
  Director: "bg-rose-500/20 text-rose-400 border-rose-500/40",
  Executive: "bg-violet-500/20 text-violet-400 border-violet-500/40",
  Client: "bg-green-500/20 text-green-400 border-green-500/40",
  Architect: "bg-sky-500/20 text-sky-400 border-sky-500/40",
  Engineer: "bg-lime-500/20 text-lime-400 border-lime-500/40",
  Inspector: "bg-fuchsia-500/20 text-fuchsia-400 border-fuchsia-500/40",
  Consultant: "bg-stone-500/20 text-stone-400 border-stone-500/40",
};

const STORAGE_KEY = "ois_safety_contacts";

export default function ContactsDirectory({
  selectedIds,
  onSelectionChange,
  onContactsChange,
}: ContactsDirectoryProps) {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(
    {
      "Critical Path": true,
      Subcontractors: true,
      "Client & Executive": true,
      Other: false,
    },
  );
  const [showAddForm, setShowAddForm] = useState(false);
  const [newContact, setNewContact] = useState({
    name: "",
    email: "",
    role: "",
    company: "",
  });
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as Contact[];
        setContacts(parsed);
        if (onContactsChange) onContactsChange(parsed);
      } catch {
        loadDefaultContacts();
      }
    } else {
      loadDefaultContacts();
    }
  }, [onContactsChange]);

  function loadDefaultContacts() {
    const defaults: Contact[] = [
      {
        id: "c1",
        name: "Safety Director",
        email: "safety@company.com",
        role: "Safety Officer",
      },
      {
        id: "c2",
        name: "Site Superintendent",
        email: "super@company.com",
        role: "Superintendent",
      },
      {
        id: "c3",
        name: "GC Project Manager",
        email: "pm@gc.com",
        role: "GC Representative",
      },
      {
        id: "c4",
        name: "Project Manager",
        email: "pm@company.com",
        role: "PM",
      },
      {
        id: "c5",
        name: "Electrical Foreman",
        email: "elec@sub.com",
        role: "Electrical",
      },
      {
        id: "c6",
        name: "Plumbing Lead",
        email: "plumb@sub.com",
        role: "Plumbing",
      },
      {
        id: "c7",
        name: "HVAC Supervisor",
        email: "hvac@sub.com",
        role: "HVAC",
      },
      {
        id: "c8",
        name: "Flooring Contractor",
        email: "floor@sub.com",
        role: "Flooring",
      },
      {
        id: "c9",
        name: "Painting Crew Lead",
        email: "paint@sub.com",
        role: "Painting",
      },
      {
        id: "c10",
        name: "Drywall Foreman",
        email: "drywall@sub.com",
        role: "Drywall",
      },
      {
        id: "c11",
        name: "Concrete Specialist",
        email: "concrete@sub.com",
        role: "Concrete",
      },
      {
        id: "c12",
        name: "Steel Erection Lead",
        email: "steel@sub.com",
        role: "Steel",
      },
      {
        id: "c13",
        name: "Owner Rep",
        email: "owner@client.com",
        role: "Owner Representative",
      },
      {
        id: "c14",
        name: "Director of Ops",
        email: "director@company.com",
        role: "Director",
      },
      {
        id: "c15",
        name: "Executive",
        email: "exec@company.com",
        role: "Executive",
      },
      {
        id: "c16",
        name: "Client Contact",
        email: "client@client.com",
        role: "Client",
      },
      {
        id: "c17",
        name: "Architect",
        email: "arch@design.com",
        role: "Architect",
      },
      {
        id: "c18",
        name: "Structural Engineer",
        email: "eng@design.com",
        role: "Engineer",
      },
      {
        id: "c19",
        name: "Inspector",
        email: "inspect@city.gov",
        role: "Inspector",
      },
      {
        id: "c20",
        name: "Safety Consultant",
        email: "consultant@safety.com",
        role: "Consultant",
      },
    ];
    setContacts(defaults);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaults));
    if (onContactsChange) onContactsChange(defaults);
  }

  function saveContacts(updated: Contact[]) {
    setContacts(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    if (onContactsChange) onContactsChange(updated);
  }

  function toggleContact(id: string) {
    if (selectedIds.includes(id)) {
      onSelectionChange(selectedIds.filter((sid) => sid !== id));
    } else {
      onSelectionChange([...selectedIds, id]);
    }
  }

  function toggleGroup(group: string) {
    setExpandedGroups((prev) => ({ ...prev, [group]: !prev[group] }));
  }

  function addContact() {
    if (!newContact.name || !newContact.email || !newContact.role) return;
    const contact: Contact = {
      id: `c-${Date.now()}`,
      name: newContact.name,
      email: newContact.email,
      role: newContact.role,
      company: newContact.company || undefined,
    };
    const updated = [...contacts, contact];
    saveContacts(updated);
    setNewContact({ name: "", email: "", role: "", company: "" });
    setShowAddForm(false);
    onSelectionChange([...selectedIds, contact.id]);
  }

  function removeContact(id: string) {
    const updated = contacts.filter((c) => c.id !== id);
    saveContacts(updated);
    onSelectionChange(selectedIds.filter((sid) => sid !== id));
  }

  function selectAllInGroup(group: string) {
    const groupContacts = getGroupContacts(group);
    const groupIds = groupContacts.map((c) => c.id);
    const newSelected = Array.from(new Set([...selectedIds, ...groupIds]));
    onSelectionChange(newSelected);
  }

  function deselectAllInGroup(group: string) {
    const groupContacts = getGroupContacts(group);
    const groupIds = groupContacts.map((c) => c.id);
    onSelectionChange(selectedIds.filter((sid) => !groupIds.includes(sid)));
  }

  function getGroupContacts(group: string) {
    const roles = ROLE_GROUPS[group] || [];
    let groupContacts = contacts.filter((c) => roles.includes(c.role));
    if (searchTerm) {
      groupContacts = groupContacts.filter(
        (c) =>
          c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.email.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }
    return groupContacts;
  }

  const selectedCount = selectedIds.length;

  return (
    <div className="space-y-4">
      {/* Search + Add */}
      <div className="flex gap-2">
        <Input
          placeholder="Search contacts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 bg-background border-border"
          data-ocid="report.search_input"
        />
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowAddForm(!showAddForm)}
          data-ocid="report.add_contact_button"
        >
          <Plus className="w-4 h-4 mr-1" />
          Add
        </Button>
      </div>

      {/* Selected count badge */}
      {selectedCount > 0 && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="w-4 h-4" />
          <span>
            {selectedCount} recipient{selectedCount !== 1 ? "s" : ""} selected
          </span>
        </div>
      )}

      {/* Add contact form */}
      {showAddForm && (
        <div className="p-3 rounded-lg border border-border bg-card space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-xs">Name</Label>
              <Input
                value={newContact.name}
                onChange={(e) =>
                  setNewContact({ ...newContact, name: e.target.value })
                }
                placeholder="Full name"
                className="h-8 text-sm"
              />
            </div>
            <div>
              <Label className="text-xs">Email</Label>
              <Input
                value={newContact.email}
                onChange={(e) =>
                  setNewContact({ ...newContact, email: e.target.value })
                }
                placeholder="email@company.com"
                className="h-8 text-sm"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-xs">Role</Label>
              <Input
                value={newContact.role}
                onChange={(e) =>
                  setNewContact({ ...newContact, role: e.target.value })
                }
                placeholder="e.g. Safety Officer"
                className="h-8 text-sm"
              />
            </div>
            <div>
              <Label className="text-xs">Company (opt)</Label>
              <Input
                value={newContact.company}
                onChange={(e) =>
                  setNewContact({ ...newContact, company: e.target.value })
                }
                placeholder="Company name"
                className="h-8 text-sm"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={addContact}
              data-ocid="report.save_contact_button"
            >
              Save
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setShowAddForm(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Role groups */}
      <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
        {Object.entries(ROLE_GROUPS).map(([group, _roles]) => {
          const groupContacts = getGroupContacts(group);
          if (groupContacts.length === 0) return null;
          const expanded = expandedGroups[group];
          const groupSelected = groupContacts.filter((c) =>
            selectedIds.includes(c.id),
          );

          return (
            <div
              key={group}
              className="border border-border rounded-lg overflow-hidden"
            >
              <button
                type="button"
                onClick={() => toggleGroup(group)}
                className="w-full flex items-center justify-between p-3 bg-muted/30 hover:bg-muted/50 transition-colors"
                data-ocid={`report.group_toggle.${group.toLowerCase().replace(/\s+/g, "_")}`}
              >
                <div className="flex items-center gap-2">
                  {expanded ? (
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <ChevronUp className="w-4 h-4 text-muted-foreground" />
                  )}
                  <span className="font-semibold text-sm">{group}</span>
                  <Badge variant="secondary" className="text-xs">
                    {groupSelected.length}/{groupContacts.length}
                  </Badge>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 text-xs"
                    onClick={(e) => {
                      e.stopPropagation();
                      selectAllInGroup(group);
                    }}
                  >
                    All
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 text-xs"
                    onClick={(e) => {
                      e.stopPropagation();
                      deselectAllInGroup(group);
                    }}
                  >
                    None
                  </Button>
                </div>
              </button>

              {expanded && (
                <div className="p-2 space-y-1">
                  {groupContacts.map((contact) => {
                    const isSelected = selectedIds.includes(contact.id);
                    const roleColor =
                      ROLE_COLORS[contact.role] ||
                      "bg-muted text-muted-foreground border-border";
                    return (
                      <div
                        key={contact.id}
                        className={`flex items-center gap-2 p-2 rounded-md transition-colors ${
                          isSelected ? "bg-primary/10" : "hover:bg-muted/50"
                        }`}
                      >
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => toggleContact(contact.id)}
                          data-ocid={`report.contact_checkbox.${contact.id}`}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium truncate">
                              {contact.name}
                            </span>
                            <Badge
                              variant="outline"
                              className={`text-[10px] px-1.5 py-0 ${roleColor}`}
                            >
                              {contact.role}
                            </Badge>
                          </div>
                          <span className="text-xs text-muted-foreground truncate block">
                            {contact.email}
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
                          onClick={() => removeContact(contact.id)}
                        >
                          <Trash2 className="w-3 h-3 text-destructive" />
                        </Button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
