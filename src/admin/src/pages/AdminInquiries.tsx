import { AdminLayout } from "@/components/AdminLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useArchiveInquiry,
  useInquiries,
  useMarkInquiryRead,
} from "@/hooks/use-backend";
import type { Inquiry, InquirySource } from "@/types";
import {
  Archive,
  CheckCircle,
  Clock,
  Mail,
  MessageSquare,
  Phone,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

function formatDate(ts: bigint): string {
  return new Date(Number(ts)).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function sourceLabel(source: InquirySource): string {
  return source === "whatsapp" ? "WhatsApp" : "Website";
}

function InquiryRow({
  inquiry,
  index,
  onView,
}: { inquiry: Inquiry; index: number; onView: (inq: Inquiry) => void }) {
  const markRead = useMarkInquiryRead();
  const archive = useArchiveInquiry();

  async function handleMarkRead(e: React.MouseEvent) {
    e.stopPropagation();
    await markRead.mutateAsync(inquiry.id);
    toast.success("Marked as read");
  }

  async function handleArchive(e: React.MouseEvent) {
    e.stopPropagation();
    await archive.mutateAsync(inquiry.id);
    toast.success("Inquiry archived");
  }

  return (
    <tr
      className={`border-b border-border ${!inquiry.isRead ? "bg-primary/[0.03]" : ""}`}
      data-ocid={`admin.inquiries.item.${index + 1}`}
    >
      <td className="px-4 py-3">
        <button
          type="button"
          className="flex items-center gap-2 w-full text-left hover:opacity-75 transition-smooth"
          onClick={() => onView(inquiry)}
        >
          {!inquiry.isRead && (
            <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
          )}
          <div className="min-w-0">
            <p className="font-medium text-foreground text-sm truncate">
              {inquiry.customerName}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {inquiry.email}
            </p>
            <div className="mt-1 xl:hidden">
              <Badge
                variant="secondary"
                className={`text-[10px] px-1.5 py-0 ${
                  inquiry.source === "whatsapp"
                    ? "bg-emerald-100 text-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-200"
                    : ""
                }`}
              >
                {sourceLabel(inquiry.source)}
              </Badge>
            </div>
          </div>
        </button>
      </td>
      <td className="px-4 py-3 hidden md:table-cell">
        <p className="text-sm text-foreground truncate max-w-40">
          {inquiry.idolName}
        </p>
        {inquiry.idolId == null && (
          <p className="text-[10px] text-muted-foreground mt-0.5">
            No linked idol
          </p>
        )}
      </td>
      <td className="px-4 py-3 hidden lg:table-cell">
        <span className="text-xs text-muted-foreground">
          {inquiry.preferredContact}
        </span>
      </td>
      <td className="px-4 py-3 hidden xl:table-cell">
        <Badge
          variant="secondary"
          className={
            inquiry.source === "whatsapp"
              ? "bg-emerald-100 text-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-200"
              : ""
          }
        >
          {sourceLabel(inquiry.source)}
        </Badge>
      </td>
      <td className="px-4 py-3 hidden md:table-cell">
        <span className="text-xs text-muted-foreground">
          {formatDate(inquiry.createdAt)}
        </span>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-1.5">
          {!inquiry.isRead && (
            <Button
              size="sm"
              variant="ghost"
              onClick={handleMarkRead}
              className="h-7 px-2 text-xs text-muted-foreground hover:text-primary"
              data-ocid={`admin.inquiries.mark_read.${index + 1}`}
              aria-label="Mark as read"
            >
              <CheckCircle className="w-3.5 h-3.5" />
            </Button>
          )}
          <Button
            size="sm"
            variant="ghost"
            onClick={handleArchive}
            className="h-7 px-2 text-xs text-muted-foreground hover:text-muted-foreground/60"
            data-ocid={`admin.inquiries.archive.${index + 1}`}
            aria-label="Archive"
          >
            <Archive className="w-3.5 h-3.5" />
          </Button>
        </div>
      </td>
    </tr>
  );
}

function InquiriesTable({ items }: { items: Inquiry[] }) {
  const [viewing, setViewing] = useState<Inquiry | null>(null);
  const markRead = useMarkInquiryRead();

  async function handleView(inq: Inquiry) {
    setViewing(inq);
    if (!inq.isRead) await markRead.mutateAsync(inq.id);
  }

  if (items.length === 0) {
    return (
      <div
        className="text-center py-16"
        data-ocid="admin.inquiries.empty_state"
      >
        <MessageSquare className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
        <p className="text-muted-foreground text-sm">No inquiries here</p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-card border border-border rounded-xl overflow-hidden shadow-subtle">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">
                Customer
              </th>
              <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground hidden md:table-cell">
                Idol
              </th>
              <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground hidden lg:table-cell">
                Contact Pref.
              </th>
              <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground hidden xl:table-cell">
                Source
              </th>
              <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground hidden md:table-cell">
                Date
              </th>
              <th className="text-right px-4 py-3 text-xs font-medium text-muted-foreground">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {items.map((inq, i) => (
              <InquiryRow
                key={inq.id.toString()}
                inquiry={inq}
                index={i}
                onView={handleView}
              />
            ))}
          </tbody>
        </table>
      </div>

      <Dialog
        open={!!viewing}
        onOpenChange={(o) => {
          if (!o) setViewing(null);
        }}
      >
        {viewing && (
          <DialogContent
            className="max-w-md"
            data-ocid="admin.inquiry_detail.dialog"
          >
            <DialogHeader>
              <DialogTitle className="font-display">
                Inquiry from {viewing.customerName}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-muted/50 rounded-lg p-3 border border-border">
                  <div className="flex items-center gap-2 mb-1">
                    <Mail className="w-3.5 h-3.5 text-primary" />
                    <p className="text-xs text-muted-foreground">Email</p>
                  </div>
                  <p className="text-sm font-medium text-foreground break-all">
                    {viewing.email}
                  </p>
                </div>
                <div className="bg-muted/50 rounded-lg p-3 border border-border">
                  <div className="flex items-center gap-2 mb-1">
                    <Phone className="w-3.5 h-3.5 text-primary" />
                    <p className="text-xs text-muted-foreground">Phone</p>
                  </div>
                  <p className="text-sm font-medium text-foreground">
                    {viewing.phone}
                  </p>
                </div>
              </div>
              <div className="bg-muted/50 rounded-lg p-3 border border-border">
                <p className="text-xs text-muted-foreground mb-1">
                  Interested Idol
                </p>
                <p className="text-sm font-medium text-foreground">
                  {viewing.idolName || "General Enquiry"}
                </p>
              </div>
              <div className="bg-muted/50 rounded-lg p-3 border border-border">
                <p className="text-xs text-muted-foreground mb-2">Message</p>
                <p className="text-sm text-foreground leading-relaxed">
                  {viewing.message}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  {formatDate(viewing.createdAt)}
                </div>
                <Badge className="text-xs">{viewing.preferredContact}</Badge>
                <Badge
                  variant="secondary"
                  className={
                    viewing.source === "whatsapp"
                      ? "text-xs bg-emerald-100 text-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-200"
                      : "text-xs"
                  }
                >
                  {sourceLabel(viewing.source)}
                </Badge>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </>
  );
}

export function AdminInquiriesPage() {
  const { data: inquiries = [], isLoading } = useInquiries();

  const active = inquiries.filter((i) => !i.isArchived);
  const unread = active.filter((i) => !i.isRead);
  const archived = inquiries.filter((i) => i.isArchived);

  return (
    <AdminLayout>
      <div data-ocid="admin.inquiries.page">
        <div className="mb-6">
          <h1 className="font-display text-2xl font-bold text-foreground">
            Inquiries
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {unread.length > 0 ? `${unread.length} unread` : "All caught up"} ·{" "}
            {active.length} total
          </p>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }, (_, i) => `skel-${i}`).map((key) => (
              <div
                key={key}
                className="bg-card border border-border rounded-xl h-14 animate-pulse"
              />
            ))}
          </div>
        ) : (
          <Tabs defaultValue="active" data-ocid="admin.inquiries.filter.tab">
            <TabsList className="mb-5">
              <TabsTrigger
                value="active"
                data-ocid="admin.inquiries.filter.active.tab"
              >
                Active
                {active.length > 0 && (
                  <span className="ml-1.5 bg-primary/10 text-primary rounded-full px-1.5 text-xs">
                    {active.length}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger
                value="unread"
                data-ocid="admin.inquiries.filter.unread.tab"
              >
                Unread
                {unread.length > 0 && (
                  <span className="ml-1.5 bg-primary text-primary-foreground rounded-full px-1.5 text-xs">
                    {unread.length}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger
                value="archived"
                data-ocid="admin.inquiries.filter.archived.tab"
              >
                Archived
              </TabsTrigger>
            </TabsList>
            <TabsContent value="active">
              <InquiriesTable items={active} />
            </TabsContent>
            <TabsContent value="unread">
              <InquiriesTable items={unread} />
            </TabsContent>
            <TabsContent value="archived">
              <InquiriesTable items={archived} />
            </TabsContent>
          </Tabs>
        )}
      </div>
    </AdminLayout>
  );
}
