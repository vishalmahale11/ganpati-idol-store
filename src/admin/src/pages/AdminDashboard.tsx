import { AdminLayout } from "@/components/AdminLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAllIdols, useInquiries } from "@/hooks/use-backend";
import { categoryLabel, formatPrice } from "@/types";
import { Link } from "@tanstack/react-router";
import { Eye, MessageSquare, Package, Users } from "lucide-react";

export function AdminDashboardPage() {
  const { data: idols = [] } = useAllIdols();
  const { data: inquiries = [] } = useInquiries();

  const activeIdols = idols.filter((i) => i.isActive).length;
  const unreadInquiries = inquiries.filter(
    (i) => !i.isRead && !i.isArchived,
  ).length;

  const stats = [
    {
      label: "Total Idols",
      value: idols.length,
      icon: Package,
      color: "text-primary",
    },
    {
      label: "Active Listings",
      value: activeIdols,
      icon: Eye,
      color: "text-secondary-foreground",
    },
    {
      label: "Inquiries",
      value: inquiries.length,
      icon: MessageSquare,
      color: "text-primary",
    },
    {
      label: "Unread",
      value: unreadInquiries,
      icon: Users,
      color: "text-accent",
    },
  ];

  return (
    <AdminLayout>
      <div data-ocid="admin.dashboard.page">
        <div className="mb-7">
          <h1 className="font-display text-2xl font-bold text-foreground">
            Dashboard
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Ganpati Store Admin Overview
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-card border border-border rounded-xl p-5 shadow-subtle"
            >
              <div className="flex items-start justify-between mb-3">
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
                <span className="font-display text-2xl font-bold text-foreground">
                  {stat.value}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          <div className="bg-card border border-border rounded-xl p-5 shadow-subtle">
            <h2 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2">
              <Package className="w-4 h-4 text-primary" />
              Recent Idols
            </h2>
            <div className="space-y-3">
              {idols.slice(0, 4).map((idol) => (
                <div
                  key={idol.id.toString()}
                  className="flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {idol.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatPrice(idol.price)} · {categoryLabel(idol.category)}
                    </p>
                  </div>
                  <Badge
                    className={
                      idol.isActive
                        ? "bg-primary/10 text-primary border-primary/30 text-xs"
                        : "bg-muted text-muted-foreground text-xs"
                    }
                  >
                    {idol.isActive ? "Active" : "Hidden"}
                  </Badge>
                </div>
              ))}
              {idols.length === 0 && (
                <p className="text-sm text-muted-foreground py-4 text-center">
                  No idols yet
                </p>
              )}
            </div>
            <Link to="/idols">
              <Button
                variant="outline"
                size="sm"
                className="mt-4 w-full text-xs border-border hover:border-primary hover:text-primary"
                data-ocid="admin.dashboard.manage_idols.link"
              >
                Manage All Idols
              </Button>
            </Link>
          </div>

          <div className="bg-card border border-border rounded-xl p-5 shadow-subtle">
            <h2 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-primary" />
              Recent Inquiries
            </h2>
            {inquiries.length === 0 ? (
              <div
                className="text-center py-8"
                data-ocid="admin.dashboard.inquiries.empty_state"
              >
                <p className="text-sm text-muted-foreground">
                  No inquiries yet
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {inquiries.slice(0, 4).map((inq) => (
                  <div
                    key={inq.id.toString()}
                    className="flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {inq.customerName}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {inq.idolName}
                      </p>
                    </div>
                    {!inq.isRead && (
                      <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
                    )}
                  </div>
                ))}
              </div>
            )}
            <Link to="/inquiries">
              <Button
                variant="outline"
                size="sm"
                className="mt-4 w-full text-xs border-border hover:border-primary hover:text-primary"
                data-ocid="admin.dashboard.view_inquiries.link"
              >
                View All Inquiries
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
