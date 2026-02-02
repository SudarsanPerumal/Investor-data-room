import React, { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Layers,
  LayoutDashboard,
  FolderTree,
  FileText,
  Users,
  ShieldCheck,
  Lock,
  Clock,
  Search,
  Filter,
  Plus,
  Upload,
  FolderPlus,
  Link as LinkIcon,
  Eye,
  X,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Download,
  Printer,
  BadgeCheck,
  AlertTriangle,
  Trash2,
  RefreshCw,
  Settings,
  User,
  Bell,
  Info,
  CalendarClock,
  Ban,
  FileUp,
  FileDown,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

/**
 * IM Due Diligence Data Room – Responsive Mock UI (Latest Requirements)
 *
 * Latest requirement highlights implemented in this mock:
 * - Deal-level Data Room (one room per deal)
 * - Issuer is an organization; all issuer members have full issuer permissions (no collaborator role)
 * - Storage model shown as container-per-issuer with deal prefixes (informational)
 * - Detailed permission matrix enforced in UI: Issuer manages; MM/Investor/External read-only; Admin overrides
 * - Lifecycle controls: room expiry, user expiry, soft delete, hard delete, legal hold (UI + logs)
 * - DocSend-like viewer: read-only, watermark, download/print blocked + audit events
 */

const BRAND = {
  name: "intain MARKETS",
  accent: "#1F5C8B",
  accent2: "#0D3B66",
};

const ROLES = [
  { key: "ISSUER", label: "Issuer (Org Member)" },
  { key: "MARKET_MAKER", label: "Market Maker" },
  { key: "INVESTOR", label: "Investor" },
  { key: "EXTERNAL", label: "External Guest" },
  { key: "ADMIN", label: "Admin" },
];

const DEALS = [
  {
    id: "DEAL-ALPHA-01",
    issuerOrg: "Alpha Manufacturing Pvt Ltd",
    poolId: "POOL-ALPHA-01",
    status: "Due Diligence",
    dataRoom: {
      status: "ACTIVE",
      expiry: "2026-02-15",
      softDeleteDays: 14,
      legalHold: false,
      externalSharing: true,
    },
    updatedAt: "2026-01-29",
  },
  {
    id: "DEAL-BETA-02",
    issuerOrg: "Beta Retail Group",
    poolId: "POOL-BETA-02",
    status: "Due Diligence",
    dataRoom: {
      status: "EXPIRED",
      expiry: "2026-01-20",
      softDeleteDays: 14,
      legalHold: false,
      externalSharing: false,
    },
    updatedAt: "2026-01-20",
  },
];

// Folder tree is represented as prefixes
const DOCS = [
  {
    id: "DOC-1001",
    dealId: "DEAL-ALPHA-01",
    path: "Legal/",
    name: "Shareholders Agreement.pdf",
    type: "PDF",
    size: "2.4 MB",
    pages: 112,
    uploadedBy: "issuer_user1@alpha.com",
    uploadedAt: "2026-01-25",
  },
  {
    id: "DOC-1002",
    dealId: "DEAL-ALPHA-01",
    path: "Legal/",
    name: "Loan Agreement.pdf",
    type: "PDF",
    size: "1.8 MB",
    pages: 94,
    uploadedBy: "issuer_user2@alpha.com",
    uploadedAt: "2026-01-25",
  },
  {
    id: "DOC-1101",
    dealId: "DEAL-ALPHA-01",
    path: "Financials/",
    name: "Audited Financials FY24.pdf",
    type: "PDF",
    size: "6.1 MB",
    pages: 48,
    uploadedBy: "issuer_user1@alpha.com",
    uploadedAt: "2026-01-26",
  },
  {
    id: "DOC-1201",
    dealId: "DEAL-ALPHA-01",
    path: "Corporate/",
    name: "Certificate of Incorporation.pdf",
    type: "PDF",
    size: "0.7 MB",
    pages: 6,
    uploadedBy: "issuer_user3@alpha.com",
    uploadedAt: "2026-01-27",
  },
  {
    id: "DOC-2001",
    dealId: "DEAL-BETA-02",
    path: "Legal/",
    name: "Legal Opinion.pdf",
    type: "PDF",
    size: "1.2 MB",
    pages: 20,
    uploadedBy: "issuer_user@beta.com",
    uploadedAt: "2026-01-10",
  },
];

const ACCESS = [
  // Deal Alpha access
  {
    id: "ACC-01",
    dealId: "DEAL-ALPHA-01",
    partyType: "Internal",
    role: "MARKET_MAKER",
    email: "intaindemo_facilityagent@intainft.com",
    permission: "VIEW_ONLY",
    expiresOn: "2026-02-10",
    status: "ACTIVE",
  },
  {
    id: "ACC-02",
    dealId: "DEAL-ALPHA-01",
    partyType: "Internal",
    role: "INVESTOR",
    email: "intaindemo_lender1@intainft.com",
    permission: "VIEW_ONLY",
    expiresOn: "2026-02-10",
    status: "ACTIVE",
  },
  {
    id: "ACC-03",
    dealId: "DEAL-ALPHA-01",
    partyType: "External",
    role: "EXTERNAL",
    email: "counsel@lawfirm.com",
    permission: "VIEW_ONLY",
    expiresOn: "2026-02-03",
    status: "ACTIVE",
  },
  // Deal Beta access
  {
    id: "ACC-10",
    dealId: "DEAL-BETA-02",
    partyType: "External",
    role: "EXTERNAL",
    email: "auditor@accounting.com",
    permission: "VIEW_ONLY",
    expiresOn: "2026-01-18",
    status: "EXPIRED",
  },
];

const AUDIT_SEED = [
  {
    id: "EVT-01",
    ts: "2026-01-30 10:14:05",
    dealId: "DEAL-ALPHA-01",
    user: "intaindemo_lender1@intainft.com",
    role: "Investor",
    action: "VIEW_START",
    target: "DOC-1002",
    details: "Loan Agreement.pdf",
  },
  {
    id: "EVT-02",
    ts: "2026-01-30 10:18:44",
    dealId: "DEAL-ALPHA-01",
    user: "intaindemo_lender1@intainft.com",
    role: "Investor",
    action: "DOWNLOAD_BLOCKED",
    target: "DOC-1002",
    details: "Download attempt blocked",
  },
  {
    id: "EVT-03",
    ts: "2026-01-30 10:22:10",
    dealId: "DEAL-ALPHA-01",
    user: "intaindemo_facilityagent@intainft.com",
    role: "Market Maker",
    action: "VIEW_START",
    target: "DOC-1101",
    details: "Audited Financials FY24.pdf",
  },
];

function Pill({ icon: Icon, label, tone = "default" }) {
  const styles =
    tone === "ok"
      ? "bg-emerald-50 text-emerald-700 border-emerald-100"
      : tone === "warn"
      ? "bg-amber-50 text-amber-700 border-amber-100"
      : tone === "bad"
      ? "bg-rose-50 text-rose-700 border-rose-100"
      : "bg-slate-50 text-slate-700 border-slate-100";
  return (
    <span className={cn("inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs", styles)}>
      {Icon ? <Icon className="h-3.5 w-3.5" /> : null}
      {label}
    </span>
  );
}

function TopNav({ role, setRole, route, setRoute }) {
  return (
    <div className="sticky top-0 z-40 w-full border-b bg-white/85 backdrop-blur supports-[backdrop-filter]:bg-white/65">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-2xl text-white"
            style={{ background: `linear-gradient(135deg, ${BRAND.accent2}, ${BRAND.accent})` }}
          >
            <Layers className="h-5 w-5" />
          </div>
          <div>
            <div className="text-sm font-semibold tracking-tight">{BRAND.name}</div>
            <div className="text-xs text-muted-foreground">Due Diligence Data Room (POC)</div>
          </div>
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <Button variant={route === "DEALS" ? "default" : "ghost"} onClick={() => setRoute("DEALS")}>
            <LayoutDashboard className="mr-2 h-4 w-4" /> Deals
          </Button>
          <Button variant={route === "ROOM" ? "default" : "ghost"} onClick={() => setRoute("ROOM")}>
            <FolderTree className="mr-2 h-4 w-4" /> Data Room
          </Button>
          <Button variant={route === "VIEWER" ? "default" : "ghost"} onClick={() => setRoute("VIEWER")}>
            <FileText className="mr-2 h-4 w-4" /> Viewer
          </Button>
          <Button variant={route === "AUDIT" ? "default" : "ghost"} onClick={() => setRoute("AUDIT")}>
            <Eye className="mr-2 h-4 w-4" /> Audit
          </Button>
          <Button variant={route === "ADMIN" ? "default" : "ghost"} onClick={() => setRoute("ADMIN")}>
            <Settings className="mr-2 h-4 w-4" /> Admin
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" aria-label="Notifications">
            <Bell className="h-4 w-4" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">{ROLES.find((r) => r.key === role)?.label}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-60">
              <DropdownMenuLabel>Switch Role</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {ROLES.map((r) => (
                <DropdownMenuItem key={r.key} onClick={() => setRole(r.key)}>
                  {r.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 pb-3 md:hidden">
        <Tabs value={route} onValueChange={setRoute}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="DEALS">Deals</TabsTrigger>
            <TabsTrigger value="ROOM">Room</TabsTrigger>
            <TabsTrigger value="VIEWER">Viewer</TabsTrigger>
            <TabsTrigger value="AUDIT">Audit</TabsTrigger>
            <TabsTrigger value="ADMIN">Admin</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
}

function DealsList({ selectedDealId, setSelectedDealId, query, setQuery, onOpenRoom }) {
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return DEALS;
    return DEALS.filter((d) => [d.id, d.issuerOrg, d.poolId, d.status, d.dataRoom.status].some((x) => String(x).toLowerCase().includes(q)));
  }, [query]);

  return (
    <Card className="rounded-2xl shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between gap-3">
          <CardTitle className="text-base">Deals</CardTitle>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search deals…" className="pl-8" />
            </div>
            <Button variant="outline" size="icon" aria-label="Filter">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <Pill icon={ShieldCheck} label="Custody: IM-controlled" tone="ok" />
          <Pill icon={Lock} label="External: view-only" />
          <Pill icon={Clock} label="Expiry + retention" />
        </div>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="overflow-x-auto">
          <div className="overflow-hidden rounded-2xl border min-w-full">
            <div className="grid grid-cols-12 gap-0 bg-slate-50 px-3 py-2 text-[11px] font-semibold text-slate-700">
              <div className="col-span-2">Deal ID</div>
              <div className="col-span-2">Issuer</div>
              <div className="col-span-1">Pool</div>
              <div className="col-span-1">Status</div>
              <div className="col-span-1">Room Status</div>
              <div className="col-span-1">Expiry</div>
              <div className="col-span-1">Soft Delete</div>
              <div className="col-span-1">External</div>
              <div className="col-span-1">Updated</div>
              <div className="col-span-2 text-right">Actions</div>
            </div>
            <div className="divide-y">
              {filtered.length === 0 ? (
                <div className="px-3 py-8 text-center text-sm text-muted-foreground">
                  No deals found matching your search.
                </div>
              ) : (
                filtered.map((d) => (
                  <div
                    key={d.id}
                    className={cn(
                      "grid grid-cols-12 gap-0 px-3 py-2 text-xs transition cursor-pointer",
                      selectedDealId === d.id ? "bg-blue-50 border-l-4 border-l-blue-500" : "hover:bg-slate-50"
                    )}
                    onClick={() => setSelectedDealId(d.id)}
                  >
                    <div className="col-span-2">
                      <div className="font-semibold">{d.id}</div>
                    </div>
                    <div className="col-span-2 truncate text-muted-foreground" title={d.issuerOrg}>
                      {d.issuerOrg}
                    </div>
                    <div className="col-span-1 text-muted-foreground">{d.poolId}</div>
                    <div className="col-span-1">
                      <Badge variant="outline" className="text-[10px] whitespace-nowrap">{d.status}</Badge>
                    </div>
                    <div className="col-span-1">
                      <Badge variant={d.dataRoom.status === "ACTIVE" ? "secondary" : "outline"} className="text-[10px] whitespace-nowrap">
                        {d.dataRoom.status}
                      </Badge>
                    </div>
                    <div className="col-span-1 text-muted-foreground text-[11px] whitespace-nowrap">{d.dataRoom.expiry}</div>
                    <div className="col-span-1 text-muted-foreground text-[11px] whitespace-nowrap">{d.dataRoom.softDeleteDays} days</div>
                    <div className="col-span-1 text-muted-foreground text-[11px] whitespace-nowrap">{d.dataRoom.externalSharing ? "Yes" : "No"}</div>
                    <div className="col-span-1 text-muted-foreground text-[11px] whitespace-nowrap">{d.updatedAt}</div>
                    <div className="col-span-2 flex justify-end gap-1">
                      <Button
                        size="sm"
                        variant={selectedDealId === d.id ? "default" : "outline"}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedDealId(d.id);
                        }}
                      >
                        Select
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedDealId(d.id);
                          if (onOpenRoom) {
                            onOpenRoom(d.id);
                          }
                        }}
                        title="Open Data Room"
                      >
                        <FolderTree className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function DealSummary({ deal, role }) {
  const canManage = role === "ISSUER" || role === "ADMIN";
  return (
    <Card className="rounded-2xl shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Deal Summary</CardTitle>
          <Badge variant="outline" className="rounded-full">
            <ShieldCheck className="mr-1 h-3.5 w-3.5" /> One Data Room / Deal
          </Badge>
        </div>
        <div className="mt-2 text-xs text-muted-foreground">Due diligence data room is temporary and controlled by IM custody + RBAC.</div>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-2xl border p-3">
            <div className="text-xs text-muted-foreground">Deal ID</div>
            <div className="mt-1 font-semibold">{deal.id}</div>
          </div>
          <div className="rounded-2xl border p-3">
            <div className="text-xs text-muted-foreground">Issuer (Org)</div>
            <div className="mt-1 font-semibold">{deal.issuerOrg}</div>
          </div>
          <div className="rounded-2xl border p-3">
            <div className="text-xs text-muted-foreground">Data Room Status</div>
            <div className="mt-1 font-semibold">{deal.dataRoom.status}</div>
          </div>
          <div className="rounded-2xl border p-3">
            <div className="text-xs text-muted-foreground">Expiry</div>
            <div className="mt-1 font-semibold">{deal.dataRoom.expiry}</div>
          </div>
        </div>

        <div className="mt-4 rounded-2xl border bg-slate-50 p-3 text-xs text-muted-foreground">
          <div className="flex items-start gap-2">
            <Info className="mt-0.5 h-4 w-4" />
            <div>
              <div className="font-semibold text-slate-900">Storage layout (informational)</div>
              <div className="mt-1">
                Container-per-Issuer: <span className="font-semibold">issuer-&#123;issuerId&#125;</span> → deals/<span className="font-semibold">{deal.id}</span>/dataroom/…
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Pill icon={Lock} label={canManage ? "Issuer can manage" : "Read-only"} tone={canManage ? "ok" : "default"} />
          <Pill icon={CalendarClock} label={`Room expiry: ${deal.dataRoom.expiry}`} />
          {deal.dataRoom.legalHold ? <Pill icon={Ban} label="Legal hold" tone="warn" /> : <Pill icon={BadgeCheck} label="No legal hold" tone="ok" />}
        </div>
      </CardContent>
    </Card>
  );
}

function FolderSidebar({ folders, activeFolder, setActiveFolder, canManage, onCreateFolder }) {
  return (
    <Card className="rounded-2xl shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Folders</CardTitle>
          {canManage ? (
            <Button variant="outline" size="icon" aria-label="Create folder" onClick={onCreateFolder}>
              <FolderPlus className="h-4 w-4" />
            </Button>
          ) : null}
        </div>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="space-y-2">
          <button
            onClick={() => setActiveFolder("ALL")}
            className={cn(
              "w-full rounded-xl border px-3 py-2 text-left text-sm",
              activeFolder === "ALL" ? "border-slate-400 bg-slate-50" : "hover:bg-slate-50"
            )}
          >
            All documents
          </button>
          {folders.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFolder(f)}
              className={cn(
                "w-full rounded-xl border px-3 py-2 text-left text-sm",
                activeFolder === f ? "border-slate-400 bg-slate-50" : "hover:bg-slate-50"
              )}
            >
              {f.replace("/", "")}
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function DocTable({ docs, canManage, onOpen, onUpload, onDelete, onReplace }) {
  return (
    <Card className="rounded-2xl shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <CardTitle className="text-base">Documents</CardTitle>
          <div className="flex flex-wrap items-center gap-2">
            {canManage ? (
              <>
                <Button variant="outline" onClick={onUpload}>
                  <Upload className="mr-2 h-4 w-4" /> Upload
                </Button>
                <Button variant="outline" onClick={onReplace}>
                  <RefreshCw className="mr-2 h-4 w-4" /> Replace
                </Button>
              </>
            ) : null}
            <Pill icon={Lock} label="Read-only for external" />
          </div>
        </div>
        <div className="mt-2 text-xs text-muted-foreground">Viewer is DocSend-like: watermark + audit + blocked download/print.</div>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="overflow-hidden rounded-2xl border">
          <div className="grid grid-cols-12 gap-0 bg-slate-50 px-3 py-2 text-[11px] font-semibold text-slate-700">
            <div className="col-span-5">Document</div>
            <div className="col-span-2">Folder</div>
            <div className="col-span-2">Uploaded</div>
            <div className="col-span-2">By</div>
            <div className="col-span-1 text-right">Action</div>
          </div>
          <div className="divide-y">
            {docs.map((d) => (
              <div key={d.id} className="grid grid-cols-12 gap-0 px-3 py-2 text-xs">
                <div className="col-span-5">
                  <div className="font-semibold">{d.name}</div>
                  <div className="text-[11px] text-muted-foreground">
                    {d.type} • {d.size} • {d.pages} pages • {d.id}
                  </div>
                </div>
                <div className="col-span-2 text-muted-foreground">{d.path.replace("/", "")}</div>
                <div className="col-span-2 text-muted-foreground">{d.uploadedAt}</div>
                <div className="col-span-2 truncate text-muted-foreground">{d.uploadedBy}</div>
                <div className="col-span-1 flex justify-end gap-1">
                  <Button size="sm" variant="outline" onClick={() => onOpen(d)}>
                    <Eye className="mr-1 h-4 w-4" /> View
                  </Button>
                  {canManage ? (
                    <Button size="sm" variant="outline" onClick={() => onDelete(d)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function AccessPanel({ access, canManage, onInvite }) {
  return (
    <Card className="rounded-2xl shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <CardTitle className="text-base">Access & Invitations</CardTitle>
          <div className="flex items-center gap-2">
            <Pill icon={Users} label="Per-user expiry" />
            {canManage ? (
              <Button onClick={onInvite}>
                <Plus className="mr-2 h-4 w-4" /> Invite
              </Button>
            ) : null}
          </div>
        </div>
        <div className="mt-2 text-xs text-muted-foreground">Issuer/Admin can invite internal roles and external guests. All non-issuer access is view-only.</div>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="overflow-hidden rounded-2xl border">
          <div className="grid grid-cols-12 gap-0 bg-slate-50 px-3 py-2 text-[11px] font-semibold text-slate-700">
            <div className="col-span-4">Email</div>
            <div className="col-span-2">Type</div>
            <div className="col-span-2">Role</div>
            <div className="col-span-2">Expires</div>
            <div className="col-span-2">Status</div>
          </div>
          <div className="divide-y">
            {access.map((a) => (
              <div key={a.id} className="grid grid-cols-12 gap-0 px-3 py-2 text-xs">
                <div className="col-span-4 truncate font-medium">{a.email}</div>
                <div className="col-span-2 text-muted-foreground">{a.partyType}</div>
                <div className="col-span-2">
                  <Badge variant="outline" className="rounded-full">
                    {a.role.replace("_", " ")}
                  </Badge>
                </div>
                <div className="col-span-2 text-muted-foreground">{a.expiresOn}</div>
                <div className="col-span-2">
                  <Badge variant={a.status === "ACTIVE" ? "secondary" : "outline"}>{a.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function AuditPanel({ audit }) {
  return (
    <Card className="rounded-2xl shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Audit Log</CardTitle>
          <Pill icon={Eye} label="Immutable" />
        </div>
        <div className="mt-2 text-xs text-muted-foreground">
          Tracks view sessions, denied access, blocked downloads/prints, expiry events, and revocations.
        </div>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="overflow-hidden rounded-2xl border">
          <div className="grid grid-cols-12 gap-0 bg-slate-50 px-3 py-2 text-[11px] font-semibold text-slate-700">
            <div className="col-span-2">Time</div>
            <div className="col-span-2">Deal</div>
            <div className="col-span-3">User</div>
            <div className="col-span-2">Role</div>
            <div className="col-span-1">Action</div>
            <div className="col-span-2">Target</div>
          </div>
          <div className="divide-y">
            {audit.map((e) => (
              <div key={e.id} className="grid grid-cols-12 gap-0 px-3 py-2 text-xs">
                <div className="col-span-2 text-muted-foreground">{e.ts}</div>
                <div className="col-span-2 text-muted-foreground">{e.dealId}</div>
                <div className="col-span-3 truncate">{e.user}</div>
                <div className="col-span-2">{e.role}</div>
                <div className="col-span-1">
                  <Badge variant="outline" className="rounded-full">
                    {e.action}
                  </Badge>
                </div>
                <div className="col-span-2 text-muted-foreground">
                  {e.target} • {e.details}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function Viewer({ dealId, doc, viewerIdentity, onClose, onAudit }) {
  const [page, setPage] = useState(1);
  const [zoom, setZoom] = useState(100);
  const total = doc?.pages ?? 1;
  const watermark = `Viewed by ${viewerIdentity} • ${dealId} • ${new Date().toLocaleString()}`;

  return (
    <Card className="rounded-2xl shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="min-w-0">
            <CardTitle className="text-base">Secure Viewer</CardTitle>
            <div className="mt-0.5 truncate text-xs text-muted-foreground">
              {doc ? `${doc.name} • ${doc.pages} pages • ${doc.id}` : "Select a document to view"}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {doc ? (
              <>
                <Button variant="outline" size="icon" aria-label="Print" onClick={() => onAudit("PRINT_BLOCKED")}>
                  <Printer className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" aria-label="Download" onClick={() => onAudit("DOWNLOAD_BLOCKED")}>
                  <Download className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" aria-label="Fullscreen" onClick={() => onAudit("FULLSCREEN")}>
                  <Maximize2 className="h-4 w-4" />
                </Button>
              </>
            ) : null}
            <Button variant="outline" onClick={onClose}>
              <X className="mr-2 h-4 w-4" /> Close
            </Button>
          </div>
        </div>
        {doc ? (
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Pill icon={ShieldCheck} label="Session: 10 min" tone="ok" />
            <Pill icon={Lock} label="Read-only" />
            <Pill icon={Eye} label="Tracked" />
          </div>
        ) : null}
      </CardHeader>
      <CardContent className="pt-2">
        {!doc ? (
          <div className="rounded-2xl border p-10 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50">
              <FileText className="h-6 w-6" />
            </div>
            <div className="mt-3 text-sm font-semibold">No document open</div>
            <div className="mt-1 text-sm text-muted-foreground">Open a document from the Data Room to view it here.</div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border bg-white p-2">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  aria-label="Previous page"
                  onClick={() => {
                    const next = Math.max(1, page - 1);
                    setPage(next);
                    onAudit("PAGE_PREV");
                  }}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  aria-label="Next page"
                  onClick={() => {
                    const next = Math.min(total, page + 1);
                    setPage(next);
                    onAudit("PAGE_NEXT");
                  }}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Separator orientation="vertical" className="mx-1 h-7" />
                <div className="text-xs">
                  Page <span className="font-semibold">{page}</span> / {total}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="text-xs text-muted-foreground">Zoom</div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      setZoom((z) => Math.max(80, z - 10));
                      onAudit("ZOOM_OUT");
                    }}
                  >
                    <span className="text-sm">−</span>
                  </Button>
                  <div className="min-w-[64px] rounded-xl border bg-slate-50 px-2 py-1 text-center text-xs font-semibold">
                    {zoom}%
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      setZoom((z) => Math.min(160, z + 10));
                      onAudit("ZOOM_IN");
                    }}
                  >
                    <span className="text-sm">+</span>
                  </Button>
                </div>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-2xl border bg-slate-50">
              <div className="absolute inset-0 pointer-events-none opacity-25">
                <div
                  className="absolute left-[-20%] top-[25%] w-[140%] -rotate-12 text-center text-2xl font-semibold"
                  style={{ color: BRAND.accent2 }}
                >
                  {watermark}
                </div>
                <div
                  className="absolute left-[-20%] top-[55%] w-[140%] -rotate-12 text-center text-2xl font-semibold"
                  style={{ color: BRAND.accent2 }}
                >
                  {watermark}
                </div>
              </div>

              <div className="p-4 sm:p-6">
                <div
                  className="mx-auto rounded-2xl border bg-white shadow-sm"
                  style={{ width: "min(920px, 100%)", transform: `scale(${zoom / 100})`, transformOrigin: "top center" }}
                >
                  <div className="border-b px-6 py-4">
                    <div className="text-lg font-semibold" style={{ color: BRAND.accent2 }}>
                      {doc.name.replace(".pdf", "")} — Preview
                    </div>
                    <div className="mt-1 text-sm text-muted-foreground">Deal: {dealId} • Doc: {doc.id}</div>
                  </div>
                  <div className="px-6 py-10">
                    <div className="text-center">
                      <div className="text-sm font-semibold">Wireframe Page {page}</div>
                      <div className="mt-1 text-sm text-muted-foreground">Mock canvas. Integrate PDF.js in implementation.</div>
                    </div>
                    <div className="mt-8 grid gap-4 sm:grid-cols-2">
                      <div className="rounded-2xl border p-4">
                        <div className="text-xs font-semibold">Section</div>
                        <div className="mt-2 space-y-2">
                          <div className="h-3 w-5/6 rounded bg-slate-100" />
                          <div className="h-3 w-4/6 rounded bg-slate-100" />
                          <div className="h-3 w-3/6 rounded bg-slate-100" />
                        </div>
                      </div>
                      <div className="rounded-2xl border p-4">
                        <div className="text-xs font-semibold">Notes</div>
                        <div className="mt-2 space-y-2">
                          <div className="h-3 w-5/6 rounded bg-slate-100" />
                          <div className="h-3 w-4/6 rounded bg-slate-100" />
                          <div className="h-3 w-3/6 rounded bg-slate-100" />
                        </div>
                      </div>
                    </div>
                    <div className="mt-6 rounded-2xl border border-dashed p-4 text-sm text-muted-foreground">
                      Restrictions: download disabled • print disabled • watermark enabled • audited
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t bg-white px-4 py-2 text-xs text-muted-foreground">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4" /> Tracked view session • Read-only
                  </div>
                  <div className="flex items-center gap-2">
                    <Info className="h-4 w-4" /> Any attempt to download/print is logged
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function AdminPolicyPanel({ policy, setPolicy }) {
  return (
    <Card className="rounded-2xl shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Admin Policies</CardTitle>
          <Pill icon={Settings} label="Global defaults" />
        </div>
        <div className="mt-2 text-xs text-muted-foreground">Applies platform-wide. Deal-level room settings can further restrict access.</div>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="space-y-3">
          <div className="flex items-center justify-between rounded-2xl border p-4">
            <div>
              <div className="text-sm font-semibold">Default external sharing</div>
              <div className="text-xs text-muted-foreground">If disabled, external guests cannot be invited.</div>
            </div>
            <Switch checked={policy.defaultExternalSharing} onCheckedChange={(v) => setPolicy({ ...policy, defaultExternalSharing: v })} />
          </div>

          <div className="flex items-center justify-between rounded-2xl border p-4">
            <div>
              <div className="text-sm font-semibold">Default soft delete (days)</div>
              <div className="text-xs text-muted-foreground">Grace period after room expiry before hard delete.</div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={() => setPolicy({ ...policy, defaultSoftDeleteDays: Math.max(1, policy.defaultSoftDeleteDays - 1) })}>
                <span className="text-sm">−</span>
              </Button>
              <div className="min-w-[64px] rounded-xl border bg-slate-50 px-2 py-1 text-center text-xs font-semibold">{policy.defaultSoftDeleteDays}</div>
              <Button variant="outline" size="icon" onClick={() => setPolicy({ ...policy, defaultSoftDeleteDays: policy.defaultSoftDeleteDays + 1 })}>
                <span className="text-sm">+</span>
              </Button>
            </div>
          </div>

          <div className="rounded-2xl border p-4">
            <div className="text-sm font-semibold">Lifecycle enforcement</div>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-xs text-muted-foreground">
              <li>Room expiry disables all access immediately.</li>
              <li>Soft delete keeps encrypted docs but blocks access.</li>
              <li>Hard delete permanently removes deal prefix docs; audit logs retained.</li>
              <li>Legal hold pauses deletion clocks.</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function InviteDialog({ open, onOpenChange, dealId, canInvite }) {
  const [email, setEmail] = useState("");
  const [type, setType] = useState("External");
  const [role, setRole] = useState("EXTERNAL");
  const [expiresOn, setExpiresOn] = useState("2026-02-03");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-2xl">
        <DialogHeader>
          <DialogTitle>Invite to Data Room</DialogTitle>
        </DialogHeader>
        {!canInvite ? (
          <div className="rounded-2xl border bg-slate-50 p-4 text-sm">
            <div className="flex items-start gap-2">
              <Lock className="mt-0.5 h-4 w-4" />
              <div>
                <div className="font-semibold">Permission required</div>
                <div className="mt-1 text-muted-foreground">Only Issuer org members or Admin can invite users.</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="rounded-2xl border bg-slate-50 p-3 text-xs text-muted-foreground">
              Deal: <span className="font-semibold text-slate-900">{dealId}</span> • All invites require an expiry date • Default permission is View Only
            </div>

            <div className="space-y-2">
              <div className="text-xs font-semibold">Email</div>
              <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="user@company.com" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <div className="text-xs font-semibold">Party Type</div>
                <div className="flex gap-2">
                  <Button variant={type === "Internal" ? "default" : "outline"} onClick={() => { setType("Internal"); setRole("INVESTOR"); }}>
                    Internal
                  </Button>
                  <Button variant={type === "External" ? "default" : "outline"} onClick={() => { setType("External"); setRole("EXTERNAL"); }}>
                    External
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-xs font-semibold">Role</div>
                <div className="flex gap-2">
                  {type === "Internal" ? (
                    <>
                      <Button variant={role === "INVESTOR" ? "default" : "outline"} onClick={() => setRole("INVESTOR")}>Investor</Button>
                      <Button variant={role === "MARKET_MAKER" ? "default" : "outline"} onClick={() => setRole("MARKET_MAKER")}>Market Maker</Button>
                    </>
                  ) : (
                    <Button variant={role === "EXTERNAL" ? "default" : "outline"} onClick={() => setRole("EXTERNAL")}>External Guest</Button>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-semibold">Access expiry date</div>
              <Input value={expiresOn} onChange={(e) => setExpiresOn(e.target.value)} placeholder="YYYY-MM-DD" />
            </div>

            <div className="rounded-2xl border p-3 text-xs text-muted-foreground">
              External Guests will authenticate via OTP/guest login. All access is view-only and audited.
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
              <Button onClick={() => onOpenChange(false)}>
                <LinkIcon className="mr-2 h-4 w-4" /> Send Invite
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function CreateFolderDialog({ open, onOpenChange, canManage }) {
  const [name, setName] = useState("");
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-2xl">
        <DialogHeader>
          <DialogTitle>Create Folder</DialogTitle>
        </DialogHeader>
        {!canManage ? (
          <div className="rounded-2xl border bg-slate-50 p-4 text-sm">
            <div className="flex items-start gap-2">
              <Lock className="mt-0.5 h-4 w-4" />
              <div>
                <div className="font-semibold">Permission required</div>
                <div className="mt-1 text-muted-foreground">Only Issuer org members or Admin can create folders.</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="space-y-2">
              <div className="text-xs font-semibold">Folder name</div>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., HR" />
            </div>
            <div className="rounded-2xl border p-3 text-xs text-muted-foreground">
              Folder is stored as a prefix under deals/&lt;dealId&gt;/dataroom/&lt;folder&gt;/
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
              <Button onClick={() => onOpenChange(false)}>
                <FolderPlus className="mr-2 h-4 w-4" /> Create
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default function IMDueDiligenceDataRoomMock() {
  const [role, setRole] = useState("ISSUER");
  const [route, setRoute] = useState("DEALS");
  const [dealQuery, setDealQuery] = useState("");
  const [selectedDealId, setSelectedDealId] = useState(DEALS[0].id);

  const [activeFolder, setActiveFolder] = useState("ALL");
  const [selectedDoc, setSelectedDoc] = useState(null);

  const [audit, setAudit] = useState(AUDIT_SEED);

  // dialogs
  const [inviteOpen, setInviteOpen] = useState(false);
  const [folderOpen, setFolderOpen] = useState(false);

  // admin policy
  const [policy, setPolicy] = useState({
    defaultExternalSharing: true,
    defaultSoftDeleteDays: 14,
  });

  const deal = useMemo(() => DEALS.find((d) => d.id === selectedDealId), [selectedDealId]);

  const canManageRoom = role === "ISSUER" || role === "ADMIN";
  const canInvite = role === "ISSUER" || role === "ADMIN";
  const canViewRoom = true; // everyone can view the room UI, but content access depends on room + user access policy

  // permission enforcement: only Issuer/Admin can upload/modify
  const canUpload = canManageRoom;

  const accessForDeal = useMemo(() => ACCESS.filter((a) => a.dealId === selectedDealId), [selectedDealId]);

  const folders = useMemo(() => {
    const set = new Set(DOCS.filter((d) => d.dealId === selectedDealId).map((d) => d.path));
    return Array.from(set).sort();
  }, [selectedDealId]);

  const docsForView = useMemo(() => {
    const all = DOCS.filter((d) => d.dealId === selectedDealId);
    if (activeFolder === "ALL") return all;
    return all.filter((d) => d.path === activeFolder);
  }, [selectedDealId, activeFolder]);

  const viewerIdentity = useMemo(() => {
    if (role === "ISSUER") return "issuer_member@issuer.com (Issuer)";
    if (role === "MARKET_MAKER") return "intaindemo_facilityagent@intainft.com (Market Maker)";
    if (role === "INVESTOR") return "intaindemo_lender1@intainft.com (Investor)";
    if (role === "EXTERNAL") return "external_guest@company.com (External)";
    return "admin@intainft.com (Admin)";
  }, [role]);

  function addAudit(action, doc) {
    const evt = {
      id: `EVT-${String(audit.length + 1).padStart(2, "0")}`,
      ts: new Date().toLocaleString(),
      dealId: selectedDealId,
      user: viewerIdentity,
      role: ROLES.find((r) => r.key === role)?.label || role,
      action,
      target: doc?.id || "—",
      details: doc?.name || "—",
    };
    setAudit((a) => [evt, ...a]);
  }

  function openViewer(doc) {
    // Enforce room state: if expired, no one can view content.
    if (deal.dataRoom.status !== "ACTIVE") {
      addAudit("ACCESS_DENIED_ROOM_EXPIRED", doc);
      setRoute("AUDIT");
      return;
    }

    // Enforce external sharing toggle: blocks EXTERNAL invites and EXTERNAL viewing
    if (!deal.dataRoom.externalSharing && role === "EXTERNAL") {
      addAudit("ACCESS_DENIED_EXTERNAL_SHARING_OFF", doc);
      setRoute("AUDIT");
      return;
    }

    // Enforce access list for non-issuer roles
    if (role !== "ISSUER" && role !== "ADMIN") {
      const found = accessForDeal.find((a) => a.role === role && a.status === "ACTIVE");
      if (!found) {
        addAudit("ACCESS_DENIED_NO_GRANT", doc);
        setRoute("AUDIT");
        return;
      }
    }

    setSelectedDoc(doc);
    setRoute("VIEWER");
    addAudit("VIEW_START", doc);
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <TopNav
        role={role}
        setRole={(r) => {
          setRole(r);
          // block admin screen for non-admin
          if (route === "ADMIN" && r !== "ADMIN") setRoute("DEALS");
          addAudit("ROLE_SWITCH");
        }}
        route={route}
        setRoute={(next) => {
          if (next === "ADMIN" && role !== "ADMIN") {
            addAudit("ADMIN_BLOCKED");
            setRoute("AUDIT");
            return;
          }
          setRoute(next);
        }}
      />

      <main className="mx-auto max-w-7xl px-4 py-6">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-xl font-semibold tracking-tight" style={{ color: BRAND.accent2 }}>
              {route === "DEALS"
                ? "Deals"
                : route === "ROOM"
                ? "Due Diligence Data Room"
                : route === "VIEWER"
                ? "Secure Viewer"
                : route === "AUDIT"
                ? "Audit"
                : "Admin"}
            </div>
            <div className="mt-1 text-sm text-muted-foreground">
              Role: <span className="font-semibold text-slate-900">{ROLES.find((r) => r.key === role)?.label}</span> • Deal: <span className="font-semibold text-slate-900">{selectedDealId}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="rounded-full">
              <ShieldCheck className="mr-1 h-3.5 w-3.5" /> POC
            </Badge>
            <Badge variant="outline" className="rounded-full">
              <Lock className="mr-1 h-3.5 w-3.5" /> Read-only external
            </Badge>
            <Badge variant="outline" className="rounded-full">
              <Clock className="mr-1 h-3.5 w-3.5" /> Expiry + retention
            </Badge>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div className="space-y-4">
              <DealsList
                selectedDealId={selectedDealId}
                setSelectedDealId={(id) => {
                  setSelectedDealId(id);
                  setActiveFolder("ALL");
                  setSelectedDoc(null);
                  addAudit("DEAL_SELECT");
                }}
                query={dealQuery}
                setQuery={setDealQuery}
                onOpenRoom={(dealId) => {
                  setSelectedDealId(dealId);
                  setActiveFolder("ALL");
                  setSelectedDoc(null);
                  setRoute("ROOM");
                  addAudit("DEAL_SELECT");
                  addAudit("ROOM_OPEN_FROM_TABLE");
                }}
              />

              {deal ? <DealSummary deal={deal} role={role} /> : null}
            </div>
          </div>

          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              {route === "DEALS" && (
                <motion.div key="deals" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.18 }}>
                  <Card className="rounded-2xl shadow-sm">
                    <CardContent className="pt-6">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <div className="text-sm font-semibold">Open Due Diligence Data Room</div>
                          <div className="mt-1 text-sm text-muted-foreground">Navigate to the deal's data room to manage documents and access.</div>
                        </div>
                        <Button onClick={() => setRoute("ROOM")}>
                          <FolderTree className="mr-2 h-4 w-4" /> Open Data Room
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {route === "ROOM" && deal && (
                <motion.div key="room" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.18 }} className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-12">
                    <div className="md:col-span-4">
                      <FolderSidebar
                        folders={folders}
                        activeFolder={activeFolder}
                        setActiveFolder={setActiveFolder}
                        canManage={canManageRoom}
                        onCreateFolder={() => {
                          setFolderOpen(true);
                          addAudit("FOLDER_CREATE_OPEN");
                        }}
                      />
                    </div>
                    <div className="md:col-span-8">
                      <DocTable
                        docs={docsForView}
                        canManage={canUpload}
                        onOpen={(d) => openViewer(d)}
                        onUpload={() => addAudit("UPLOAD_OPEN")}
                        onReplace={() => addAudit("REPLACE_OPEN")}
                        onDelete={(d) => addAudit("DELETE_DOC", d)}
                      />
                    </div>
                  </div>

                  <AccessPanel
                    access={accessForDeal}
                    canManage={canInvite}
                    onInvite={() => {
                      setInviteOpen(true);
                      addAudit("INVITE_OPEN");
                    }}
                  />

                  <Card className="rounded-2xl shadow-sm">
                    <CardContent className="pt-6">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="text-sm">
                          <div className="font-semibold">Lifecycle controls (informational)</div>
                          <div className="text-muted-foreground">
                            Room expiry disables access immediately → soft delete (grace) → hard delete; audit retained.
                          </div>
                        </div>
                        <Button variant="outline" onClick={() => setRoute("AUDIT")}>
                          <Eye className="mr-2 h-4 w-4" /> View Audit
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {route === "VIEWER" && deal && (
                <motion.div key="viewer" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.18 }} className="space-y-4">
                  <Viewer
                    dealId={selectedDealId}
                    doc={selectedDoc}
                    viewerIdentity={viewerIdentity}
                    onClose={() => {
                      addAudit("VIEW_END", selectedDoc);
                      setSelectedDoc(null);
                      setRoute("ROOM");
                    }}
                    onAudit={(action) => addAudit(action, selectedDoc)}
                  />
                </motion.div>
              )}

              {route === "AUDIT" && (
                <motion.div key="audit" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.18 }} className="space-y-4">
                  <AuditPanel audit={audit.filter((a) => a.dealId === selectedDealId)} />
                </motion.div>
              )}

              {route === "ADMIN" && (
                <motion.div key="admin" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.18 }} className="space-y-4">
                  <AdminPolicyPanel
                    policy={policy}
                    setPolicy={(p) => {
                      setPolicy(p);
                      addAudit("ADMIN_POLICY_CHANGE");
                    }}
                  />
                  <Card className="rounded-2xl shadow-sm">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">Admin Actions (Illustrative)</CardTitle>
                        <Pill icon={ShieldCheck} label="Override" tone="warn" />
                      </div>
                      <div className="mt-2 text-xs text-muted-foreground">These actions demonstrate lifecycle and compliance override controls.</div>
                    </CardHeader>
                    <CardContent className="pt-2">
                      <div className="grid gap-3 sm:grid-cols-2">
                        <Button variant="outline" onClick={() => addAudit("APPLY_LEGAL_HOLD")}>
                          <Ban className="mr-2 h-4 w-4" /> Apply Legal Hold
                        </Button>
                        <Button variant="outline" onClick={() => addAudit("RELEASE_LEGAL_HOLD")}>
                          <BadgeCheck className="mr-2 h-4 w-4" /> Release Legal Hold
                        </Button>
                        <Button variant="outline" onClick={() => addAudit("FORCE_SOFT_DELETE")}>
                          <FileDown className="mr-2 h-4 w-4" /> Force Soft Delete
                        </Button>
                        <Button variant="outline" onClick={() => addAudit("FORCE_HARD_DELETE")}>
                          <Trash2 className="mr-2 h-4 w-4" /> Force Hard Delete
                        </Button>
                      </div>
                      <div className="mt-4 rounded-2xl border bg-slate-50 p-3 text-xs text-muted-foreground">
                        Hard delete permanently removes docs under issuer container prefix deals/{selectedDealId}/dataroom/… Audit logs remain.
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      <InviteDialog open={inviteOpen} onOpenChange={setInviteOpen} dealId={selectedDealId} canInvite={canInvite} />
      <CreateFolderDialog open={folderOpen} onOpenChange={setFolderOpen} canManage={canManageRoom} />

      <footer className="mx-auto max-w-7xl px-4 pb-10 pt-2">
        <div className="rounded-2xl border bg-white p-4 text-xs text-muted-foreground">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4" /> IM POC • Due Diligence Data Room • DocSend-like viewer • RBAC + expiry + audit
            </div>
            <div className="flex items-center gap-2">
              <Info className="h-4 w-4" /> Storage: Container-per-Issuer with deal prefixes • No direct blob links to users
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

