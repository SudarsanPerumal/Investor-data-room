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
 * IM Due Diligence Data Room – Responsive Mock UI
 *
 * A secure, role-based document management system for due diligence processes in investment deals.
 *
 * Features:
 * - Deal-level Data Room (one room per deal)
 * - Issuer organization with full management permissions
 * - Storage model: container-per-issuer with deal prefixes
 * - Permission matrix: Issuer manages; Market Maker/Investor read-only
 * - Lifecycle controls: room expiry, user expiry, soft delete, hard delete, legal hold
 * - DocSend-like viewer: read-only, watermark, download/print blocked + audit events
 */

// ============================================================================
// Constants & Configuration
// ============================================================================

const BRAND = {
  name: "IntainMARKETS",
  accent: "#1F5C8B",
  accent2: "#0D3B66",
};

const ROLES = [
  { key: "ISSUER", label: "Issuer (Org Member)" },
  { key: "MARKET_MAKER", label: "Market Maker" },
  { key: "INVESTOR", label: "Investor" },
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
    },
    updatedAt: "2026-01-20",
  },
];

// Documents - Mock document data (folder tree represented as path prefixes)
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
  // Deal Beta access
];

// Audit Log Seed Data - Initial audit events
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
    <span
      className={cn("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium", styles)}
    >
      {Icon ? <Icon className="h-3 w-3" /> : null}
      {label}
    </span>
  );
}

function TopNav({ role, setRole, route, setRoute }) {
  return (
    <div className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md supports-[backdrop-filter]:bg-white/90 shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <div
            className="flex h-11 w-11 items-center justify-center rounded-xl text-white shadow-sm transition-shadow hover:shadow-md"
            style={{ background: `linear-gradient(135deg, ${BRAND.accent2}, ${BRAND.accent})` }}
          >
            <Layers className="h-5 w-5" />
          </div>
          <div>
            <div className="text-base font-semibold tracking-tight text-slate-900">{BRAND.name}</div>
            <div className="text-xs font-medium text-slate-500">Due Diligence Data Room</div>
          </div>
        </div>

        <div className="hidden items-center gap-1 md:flex">
          <Button
            variant={route === "DEALS" ? "default" : "ghost"}
            onClick={() => setRoute("DEALS")}
            className="h-9 px-4 text-sm font-medium"
          >
            <LayoutDashboard className="mr-2 h-4 w-4" /> Deals
          </Button>
          <Button
            variant={route === "ROOM" ? "default" : "ghost"}
            onClick={() => setRoute("ROOM")}
            className="h-9 px-4 text-sm font-medium"
          >
            <FolderTree className="mr-2 h-4 w-4" /> Data Room
          </Button>
          <Button
            variant={route === "VIEWER" ? "default" : "ghost"}
            onClick={() => setRoute("VIEWER")}
            className="h-9 px-4 text-sm font-medium"
          >
            <FileText className="mr-2 h-4 w-4" /> Viewer
          </Button>
          <Button
            variant={route === "AUDIT" ? "default" : "ghost"}
            onClick={() => setRoute("AUDIT")}
            className="h-9 px-4 text-sm font-medium"
          >
            <Eye className="mr-2 h-4 w-4" /> Audit
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" aria-label="Notifications" className="h-9 w-9">
            <Bell className="h-4 w-4" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-9 gap-2 border-slate-200 px-3">
                <User className="h-4 w-4" />
                <span className="hidden text-sm font-medium sm:inline">{ROLES.find((r) => r.key === role)?.label}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="text-xs font-semibold text-slate-500">Switch Role</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {ROLES.map((r) => (
                <DropdownMenuItem
                  key={r.key}
                  onClick={() => setRole(r.key)}
                  className="text-sm"
                  disabled={r.key === role}
                >
                  {r.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="mx-auto max-w-7xl border-t border-slate-100 px-6 pb-3 pt-3 md:hidden">
        <Tabs value={route} onValueChange={setRoute}>
          <TabsList className="grid w-full grid-cols-4 bg-slate-50">
            <TabsTrigger value="DEALS" className="text-xs">
              Deals
            </TabsTrigger>
            <TabsTrigger value="ROOM" className="text-xs">
              Room
            </TabsTrigger>
            <TabsTrigger value="VIEWER" className="text-xs">
              Viewer
            </TabsTrigger>
            <TabsTrigger value="AUDIT" className="text-xs">
              Audit
            </TabsTrigger>
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
    return DEALS.filter((d) =>
      [d.id, d.issuerOrg, d.poolId, d.status, d.dataRoom.status].some((x) => String(x).toLowerCase().includes(q))
    );
  }, [query]);

  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader className="border-b border-slate-100 pb-4">
        <div className="flex items-center justify-between gap-4">
          <CardTitle className="text-lg font-semibold text-slate-900">Deals</CardTitle>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search deals…"
                className="h-9 w-64 border-slate-200 pl-9 text-sm focus-visible:ring-2 focus-visible:ring-slate-400"
              />
            </div>
            <Button variant="outline" size="icon" aria-label="Filter" className="h-9 w-9 border-slate-200">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Pill icon={ShieldCheck} label="Custody: IM-controlled" tone="ok" />
          <Pill icon={Clock} label="Expiry + retention" />
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-hidden">
          <div className="grid grid-cols-12 gap-0 border-b border-slate-200 bg-slate-50/50 px-8 py-4 text-xs font-semibold uppercase tracking-wider text-slate-600">
            <div className="col-span-2">Deal ID</div>
            <div className="col-span-3">Issuer</div>
            <div className="col-span-2">Pool</div>
            <div className="col-span-1">Status</div>
            <div className="col-span-1">Room Status</div>
            <div className="col-span-2">Expiry</div>
            <div className="col-span-1">Updated</div>
          </div>
          <div className="divide-y divide-slate-100">
            {filtered.map((d) => (
              <button
                key={d.id}
                onClick={() => {
                  setSelectedDealId(d.id);
                  onOpenRoom();
                }}
                className={cn(
                  "grid w-full grid-cols-12 gap-0 px-8 py-6 text-left transition-all hover:bg-blue-50/30 cursor-pointer",
                  selectedDealId === d.id && "bg-blue-50/50 hover:bg-blue-50/50"
                )}
              >
                <div className="col-span-2 flex items-center min-w-0">
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setSelectedDealId(d.id);
                      onOpenRoom();
                    }}
                    className="text-base font-semibold truncate hover:underline transition-colors"
                    style={{ color: "#018e82" }}
                  >
                    {d.id}
                  </a>
                </div>
                <div className="col-span-3 flex items-center min-w-0">
                  <div className="text-sm text-slate-700 truncate" title={d.issuerOrg}>
                    {d.issuerOrg}
                  </div>
                </div>
                <div className="col-span-2 flex items-center min-w-0">
                  <div className="text-sm font-medium text-slate-600 truncate" title={d.poolId}>
                    {d.poolId}
                  </div>
                </div>
                <div className="col-span-1 flex items-center">
                  <Badge variant="outline" className="text-xs truncate max-w-full">
                    {d.status}
                  </Badge>
                </div>
                <div className="col-span-1 flex items-center">
                  <Badge
                    variant={d.dataRoom.status === "ACTIVE" ? "secondary" : "outline"}
                    className="text-xs truncate max-w-full"
                  >
                    {d.dataRoom.status}
                  </Badge>
                </div>
                <div className="col-span-2 flex items-center min-w-0">
                  <div className="text-sm text-slate-600 truncate">{d.dataRoom.expiry}</div>
                </div>
                <div className="col-span-1 flex items-center min-w-0">
                  <div className="text-sm text-slate-600 truncate">{d.updatedAt}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function DealSummary({ deal, role }) {
  const canManage = role === "ISSUER";
  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader className="border-b border-slate-100 pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-slate-900">Deal Summary</CardTitle>
          <Badge variant="outline" className="rounded-full border-slate-200 text-xs">
            <ShieldCheck className="mr-1 h-3 w-3" /> One Data Room / Deal
          </Badge>
        </div>
        <div className="mt-2 text-sm text-slate-600">
          Due diligence data room is temporary and controlled by IM custody + RBAC.
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-4">
            <div className="text-xs font-medium uppercase tracking-wider text-slate-500">Deal ID</div>
            <div className="mt-2 text-base font-semibold text-slate-900">{deal.id}</div>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-4">
            <div className="text-xs font-medium uppercase tracking-wider text-slate-500">Issuer (Org)</div>
            <div className="mt-2 text-base font-semibold text-slate-900">{deal.issuerOrg}</div>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-4">
            <div className="text-xs font-medium uppercase tracking-wider text-slate-500">Data Room Status</div>
            <div className="mt-2">
              <Badge variant={deal.dataRoom.status === "ACTIVE" ? "secondary" : "outline"} className="text-xs">
                {deal.dataRoom.status}
              </Badge>
            </div>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-4">
            <div className="text-xs font-medium uppercase tracking-wider text-slate-500">Expiry</div>
            <div className="mt-2 text-base font-semibold text-slate-900">{deal.dataRoom.expiry}</div>
          </div>
        </div>

        <div className="mt-6 rounded-lg border border-blue-100 bg-blue-50/50 p-4">
          <div className="flex items-start gap-3">
            <Info className="mt-0.5 h-4 w-4 text-blue-600" />
            <div>
              <div className="text-sm font-semibold text-blue-900">Storage layout (informational)</div>
              <div className="mt-1 text-sm text-blue-700">
                Container-per-Issuer: <span className="font-mono font-semibold">issuer-&#123;issuerId&#125;</span> →
                deals/
                <span className="font-mono font-semibold">{deal.id}</span>/dataroom/…
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-2">
          <Pill icon={Lock} label={canManage ? "Issuer can manage" : "Read-only"} tone={canManage ? "ok" : "default"} />
          <Pill icon={CalendarClock} label={`Room expiry: ${deal.dataRoom.expiry}`} />
          {deal.dataRoom.legalHold ? (
            <Pill icon={Ban} label="Legal hold" tone="warn" />
          ) : (
            <Pill icon={BadgeCheck} label="No legal hold" tone="ok" />
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function FolderSidebar({ folders, activeFolder, setActiveFolder, canManage, onCreateFolder }) {
  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader className="border-b border-slate-100 pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-slate-900">Folders</CardTitle>
          {canManage ? (
            <Button
              variant="outline"
              size="icon"
              aria-label="Create folder"
              onClick={onCreateFolder}
              className="h-8 w-8 border-slate-200"
            >
              <FolderPlus className="h-4 w-4" />
            </Button>
          ) : null}
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-1">
          <button
            onClick={() => setActiveFolder("ALL")}
            className={cn(
              "w-full rounded-lg border px-4 py-2.5 text-left text-sm font-medium transition-colors",
              activeFolder === "ALL"
                ? "border-blue-300 bg-blue-50 text-blue-900"
                : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
            )}
          >
            All documents
          </button>
          {folders.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFolder(f)}
              className={cn(
                "w-full rounded-lg border px-4 py-2.5 text-left text-sm font-medium transition-colors",
                activeFolder === f
                  ? "border-blue-300 bg-blue-50 text-blue-900"
                  : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
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
    <Card className="border-slate-200 shadow-sm">
      <CardHeader className="border-b border-slate-100 pb-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <CardTitle className="text-lg font-semibold text-slate-900">Documents</CardTitle>
          <div className="flex flex-wrap items-center gap-2">
            {canManage ? (
              <>
                <Button variant="outline" onClick={onUpload} className="h-9 border-slate-200 text-sm">
                  <Upload className="mr-2 h-4 w-4" /> Upload
                </Button>
                <Button variant="outline" onClick={onReplace} className="h-9 border-slate-200 text-sm">
                  <RefreshCw className="mr-2 h-4 w-4" /> Replace
                </Button>
              </>
            ) : null}
          </div>
        </div>
        <div className="mt-2 text-sm text-slate-600">
          Viewer is DocSend-like: watermark + audit + blocked download/print.
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-hidden">
          <div className="grid grid-cols-12 gap-0 border-b border-slate-200 bg-slate-50/50 px-6 py-3 text-xs font-semibold uppercase tracking-wider text-slate-600">
            <div className="col-span-5">Document</div>
            <div className="col-span-1">Folder</div>
            <div className="col-span-2">Uploaded</div>
            <div className="col-span-3">By</div>
            <div className="col-span-1 text-right">Actions</div>
          </div>
          <div className="divide-y divide-slate-100">
            {docs.map((d) => (
              <div
                key={d.id}
                className="grid grid-cols-12 gap-0 px-6 py-4 text-sm transition-colors hover:bg-slate-50/50"
              >
                <div className="col-span-5 min-w-0">
                  <div className="font-semibold text-slate-900 truncate">{d.name}</div>
                  <div className="mt-1 text-xs text-slate-500 truncate">
                    {d.type} • {d.size} • {d.pages} pages • {d.id}
                  </div>
                </div>
                <div className="col-span-1 text-slate-600 truncate">{d.path.replace("/", "")}</div>
                <div className="col-span-2 text-slate-600">{d.uploadedAt}</div>
                <div className="col-span-3 min-w-0 pr-2">
                  <div className="truncate text-slate-600" title={d.uploadedBy}>
                    {d.uploadedBy}
                  </div>
                </div>
                <div className="col-span-1 flex justify-end gap-1.5 shrink-0">
                  <Button size="sm" variant="outline" onClick={() => onOpen(d)} className="h-8 text-xs">
                    <Eye className="mr-1.5 h-3.5 w-3.5" /> View
                  </Button>
                  {canManage ? (
                    <Button size="sm" variant="outline" onClick={() => onDelete(d)} className="h-8 w-8 p-0">
                      <Trash2 className="h-3.5 w-3.5" />
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
    <Card className="border-slate-200 shadow-sm">
      <CardHeader className="border-b border-slate-100 pb-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <CardTitle className="text-lg font-semibold text-slate-900">Access & Invitations</CardTitle>
          <div className="flex items-center gap-2">
            <Pill icon={Users} label="Per-user expiry" />
            {canManage ? (
              <Button onClick={onInvite} className="h-9 text-sm">
                <Plus className="mr-2 h-4 w-4" /> Invite
              </Button>
            ) : null}
          </div>
        </div>
        <div className="mt-2 text-sm text-slate-600">
          Issuer can invite internal roles (Market Maker, Investor). All non-issuer access is view-only.
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-hidden">
          <div className="grid grid-cols-12 gap-0 border-b border-slate-200 bg-slate-50/50 px-6 py-3 text-xs font-semibold uppercase tracking-wider text-slate-600">
            <div className="col-span-4">Email</div>
            <div className="col-span-2">Type</div>
            <div className="col-span-2">Role</div>
            <div className="col-span-2">Expires</div>
            <div className="col-span-2">Status</div>
          </div>
          <div className="divide-y divide-slate-100">
            {access.map((a) => (
              <div
                key={a.id}
                className="grid grid-cols-12 gap-0 px-6 py-4 text-sm transition-colors hover:bg-slate-50/50"
              >
                <div className="col-span-4 truncate font-medium text-slate-900">{a.email}</div>
                <div className="col-span-2 text-slate-600">{a.partyType}</div>
                <div className="col-span-2">
                  <Badge variant="outline" className="rounded-full text-xs">
                    {a.role.replace("_", " ")}
                  </Badge>
                </div>
                <div className="col-span-2 text-slate-600">{a.expiresOn}</div>
                <div className="col-span-2">
                  <Badge variant={a.status === "ACTIVE" ? "secondary" : "outline"} className="text-xs">
                    {a.status}
                  </Badge>
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
    <Card className="border-slate-200 shadow-sm">
      <CardHeader className="border-b border-slate-100 pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-slate-900">Audit Log</CardTitle>
          <Pill icon={Eye} label="Immutable" />
        </div>
        <div className="mt-2 text-sm text-slate-600">
          Tracks view sessions, denied access, blocked downloads/prints, expiry events, and revocations.
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-hidden">
          <div className="grid grid-cols-12 gap-0 border-b border-slate-200 bg-slate-50/50 px-6 py-3 text-xs font-semibold uppercase tracking-wider text-slate-600">
            <div className="col-span-2">Time</div>
            <div className="col-span-2">Deal</div>
            <div className="col-span-3">User</div>
            <div className="col-span-2">Role</div>
            <div className="col-span-1">Action</div>
            <div className="col-span-2">Target</div>
          </div>
          <div className="divide-y divide-slate-100">
            {audit.map((e) => (
              <div
                key={e.id}
                className="grid grid-cols-12 gap-0 px-6 py-4 text-sm transition-colors hover:bg-slate-50/50"
              >
                <div className="col-span-2 text-slate-600">{e.ts}</div>
                <div className="col-span-2 text-slate-600">{e.dealId}</div>
                <div className="col-span-3 truncate font-medium text-slate-900">{e.user}</div>
                <div className="col-span-2 text-slate-600">{e.role}</div>
                <div className="col-span-1">
                  <Badge variant="outline" className="rounded-full text-xs">
                    {e.action}
                  </Badge>
                </div>
                <div className="col-span-2 text-slate-600">
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
    <Card className="border-slate-200 shadow-sm">
      <CardHeader className="border-b border-slate-100 pb-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="min-w-0">
            <CardTitle className="text-lg font-semibold text-slate-900">Secure Viewer</CardTitle>
            <div className="mt-1.5 truncate text-sm text-slate-600">
              {doc ? `${doc.name} • ${doc.pages} pages • ${doc.id}` : "Select a document to view"}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {doc ? (
              <>
                <Button
                  variant="outline"
                  size="icon"
                  aria-label="Print"
                  onClick={() => onAudit("PRINT_BLOCKED")}
                  className="h-9 w-9 border-slate-200"
                >
                  <Printer className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  aria-label="Download"
                  onClick={() => onAudit("DOWNLOAD_BLOCKED")}
                  className="h-9 w-9 border-slate-200"
                >
                  <Download className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  aria-label="Fullscreen"
                  onClick={() => onAudit("FULLSCREEN")}
                  className="h-9 w-9 border-slate-200"
                >
                  <Maximize2 className="h-4 w-4" />
                </Button>
              </>
            ) : null}
            <Button variant="outline" onClick={onClose} className="h-9 border-slate-200 text-sm">
              <X className="mr-2 h-4 w-4" /> Close
            </Button>
          </div>
        </div>
        {doc ? (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <Pill icon={ShieldCheck} label="Session: 10 min" tone="ok" />
            <Pill icon={Lock} label="Read-only" />
            <Pill icon={Eye} label="Tracked" />
          </div>
        ) : null}
      </CardHeader>
      <CardContent className="pt-6">
        {!doc ? (
          <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-12 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-white shadow-sm">
              <FileText className="h-7 w-7 text-slate-400" />
            </div>
            <div className="mt-4 text-base font-semibold text-slate-900">No document open</div>
            <div className="mt-1.5 text-sm text-slate-600">Open a document from the Data Room to view it here.</div>
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
                  style={{
                    width: "min(920px, 100%)",
                    transform: `scale(${zoom / 100})`,
                    transformOrigin: "top center",
                  }}
                >
                  <div className="border-b px-6 py-4">
                    <div className="text-lg font-semibold" style={{ color: BRAND.accent2 }}>
                      {doc.name.replace(".pdf", "")} — Preview
                    </div>
                    <div className="mt-1 text-sm text-muted-foreground">
                      Deal: {dealId} • Doc: {doc.id}
                    </div>
                  </div>
                  <div className="px-6 py-10">
                    <div className="text-center">
                      <div className="text-sm font-semibold">Wireframe Page {page}</div>
                      <div className="mt-1 text-sm text-muted-foreground">
                        Mock canvas. Integrate PDF.js in implementation.
                      </div>
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

function InviteDialog({ open, onOpenChange, dealId, canInvite }) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("INVESTOR");
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
                <div className="mt-1 text-muted-foreground">Only Issuer org members can invite users.</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="rounded-2xl border bg-slate-50 p-3 text-xs text-muted-foreground">
              Deal: <span className="font-semibold text-slate-900">{dealId}</span> • All invites require an expiry date
              • Default permission is View Only
            </div>

            <div className="space-y-2">
              <div className="text-xs font-semibold">Email</div>
              <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="user@company.com" />
            </div>

            <div className="space-y-2">
              <div className="text-xs font-semibold">Role</div>
              <div className="flex gap-2">
                <Button variant={role === "INVESTOR" ? "default" : "outline"} onClick={() => setRole("INVESTOR")}>
                  Investor
                </Button>
                <Button
                  variant={role === "MARKET_MAKER" ? "default" : "outline"}
                  onClick={() => setRole("MARKET_MAKER")}
                >
                  Market Maker
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-semibold">Access expiry date</div>
              <Input value={expiresOn} onChange={(e) => setExpiresOn(e.target.value)} placeholder="YYYY-MM-DD" />
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
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
                <div className="mt-1 text-muted-foreground">Only Issuer org members can create folders.</div>
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
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
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

  // ==========================================================================
  // Computed Values & Derived State
  // ==========================================================================

  const deal = useMemo(() => DEALS.find((d) => d.id === selectedDealId), [selectedDealId]);

  // Permission Flags
  const canManageRoom = role === "ISSUER";
  const canInvite = role === "ISSUER";
  const canUpload = canManageRoom; // Only Issuer can upload/modify documents

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

  // Viewer Identity for Watermarking
  const viewerIdentity = useMemo(() => {
    if (role === "ISSUER") return "issuer_member@issuer.com (Issuer)";
    if (role === "MARKET_MAKER") return "intaindemo_facilityagent@intainft.com (Market Maker)";
    if (role === "INVESTOR") return "intaindemo_lender1@intainft.com (Investor)";
    return "issuer_member@issuer.com (Issuer)";
  }, [role]);

  // ==========================================================================
  // Event Handlers & Business Logic
  // ==========================================================================

  /**
   * Adds an audit event to the audit log
   * @param {string} action - Action type (e.g., "VIEW_START", "DOWNLOAD_BLOCKED")
   * @param {Object} doc - Document object (optional)
   */
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

  /**
   * Opens the secure document viewer with access validation
   * @param {Object} doc - Document object to view
   */
  function openViewer(doc) {
    // Enforce room state: if expired, no one can view content
    if (deal.dataRoom.status !== "ACTIVE") {
      addAudit("ACCESS_DENIED_ROOM_EXPIRED", doc);
      setRoute("AUDIT");
      return;
    }

    // Enforce access list for non-issuer roles
    if (role !== "ISSUER") {
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

  // ==========================================================================
  // Render
  // ==========================================================================

  return (
    <div className="min-h-screen bg-slate-50">
      <TopNav
        role={role}
        setRole={(r) => {
          setRole(r);
          addAudit("ROLE_SWITCH");
        }}
        route={route}
        setRoute={setRoute}
      />

      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-2xl font-semibold tracking-tight text-slate-900">
              {route === "DEALS"
                ? "Deals"
                : route === "ROOM"
                  ? "Due Diligence Data Room"
                  : route === "VIEWER"
                    ? "Secure Viewer"
                    : "Audit"}
            </div>
            <div className="mt-2 text-sm text-slate-600">
              Role: <span className="font-semibold text-slate-900">{ROLES.find((r) => r.key === role)?.label}</span> •
              Deal: <span className="font-semibold text-slate-900">{selectedDealId}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="rounded-full border-slate-200 text-xs">
              <ShieldCheck className="mr-1.5 h-3 w-3" /> POC
            </Badge>
            <Badge variant="outline" className="rounded-full border-slate-200 text-xs">
              <Clock className="mr-1.5 h-3 w-3" /> Expiry + retention
            </Badge>
          </div>
        </div>

        <div className="space-y-4">
          <AnimatePresence mode="wait">
            {route === "DEALS" && (
              <motion.div
                key="deals"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18 }}
                className="space-y-4"
              >
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
                  onOpenRoom={() => {
                    setRoute("ROOM");
                    addAudit("ROOM_OPEN_FROM_TABLE");
                  }}
                />

                {deal ? <DealSummary deal={deal} role={role} /> : null}
              </motion.div>
            )}

            {route === "ROOM" && deal && (
              <motion.div
                key="room"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18 }}
                className="space-y-4"
              >
                <div className="grid gap-4 md:grid-cols-12">
                  <div className="md:col-span-3">
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
                  <div className="md:col-span-9">
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
              <motion.div
                key="viewer"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18 }}
                className="space-y-4"
              >
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
              <motion.div
                key="audit"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18 }}
                className="space-y-4"
              >
                <AuditPanel audit={audit.filter((a) => a.dealId === selectedDealId)} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <InviteDialog open={inviteOpen} onOpenChange={setInviteOpen} dealId={selectedDealId} canInvite={canInvite} />
      <CreateFolderDialog open={folderOpen} onOpenChange={setFolderOpen} canManage={canManageRoom} />

      <footer className="mx-auto max-w-7xl px-4 pb-10 pt-2">
        <div className="rounded-2xl border bg-white p-4 text-xs text-muted-foreground">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4" /> IM POC • Due Diligence Data Room • DocSend-like viewer • RBAC + expiry
              + audit
            </div>
            <div className="flex items-center gap-2">
              <Info className="h-4 w-4" /> Storage: Container-per-Issuer with deal prefixes • No direct blob links to
              users
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
