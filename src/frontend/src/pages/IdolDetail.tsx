import { Layout } from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useIdol, useSubmitInquiry } from "@/hooks/use-backend";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { categoryLabel, formatPrice } from "@/types";
import { Link, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  MessageCircle,
  Package,
  Ruler,
  Tag,
} from "lucide-react";
import { useRef } from "react";
import { toast } from "sonner";

export function IdolDetailPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { idolId } = useParams({ strict: false }) as any;
  const id = BigInt(idolId ?? "0");
  const { data: idol, isLoading } = useIdol(id);
  const submitInquiry = useSubmitInquiry();
  const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER ?? "";
  const lastWhatsAppEnquiryAt = useRef(0);

  function handleWhatsAppEnquiry() {
    if (!idol) return;
    if (!whatsappNumber.trim()) {
      toast.error(
        "WhatsApp is not configured. Add VITE_WHATSAPP_NUMBER to your environment (digits only, e.g. 919876543210).",
      );
      return;
    }
    const now = Date.now();
    if (now - lastWhatsAppEnquiryAt.current < 2500) return;
    lastWhatsAppEnquiryAt.current = now;

    const priceLabel = formatPrice(idol.price);
    const waMessage = `Hi! I'm interested in "${idol.name}" (${priceLabel}). Please share availability and delivery options.`;
    const url = buildWhatsAppUrl(whatsappNumber, waMessage);
    if (url) window.open(url, "_blank", "noopener,noreferrer");

    submitInquiry.mutate(
      {
        idolId: idol.id,
        idolName: idol.name,
        customerName: "WhatsApp enquiry",
        email: "whatsapp@pending.local",
        phone: "—",
        message: `Customer opened WhatsApp from the product page for this idol (ID ${idol.id.toString()}).`,
        preferredContact: "WhatsApp",
        source: "whatsapp",
      },
      {
        onError: (err) => {
          const aborted =
            err instanceof Error && err.name === "AbortError";
          toast.error(
            aborted
              ? "Saving the lead timed out — is the API running? Your WhatsApp chat was opened."
              : "Could not save this lead in the admin panel. Your WhatsApp chat was still opened.",
          );
        },
      },
    );
  }

  if (isLoading) {
    return (
      <Layout>
        <div className="container max-w-6xl mx-auto px-4 py-10">
          <div className="grid md:grid-cols-2 gap-10">
            <Skeleton className="aspect-square rounded-xl" />
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-5 w-1/3" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-12 w-1/2" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!idol) {
    return (
      <Layout>
        <div
          className="container max-w-4xl mx-auto px-4 py-20 text-center"
          data-ocid="idol_detail.not_found.error_state"
        >
          <div className="text-5xl mb-4">🔍</div>
          <h2 className="font-display text-2xl font-bold text-foreground mb-3">
            Idol Not Found
          </h2>
          <p className="text-muted-foreground mb-6">
            The idol you're looking for may have been sold out or removed.
          </p>
          <Link to="/catalog">
            <Button className="gap-2 bg-primary text-primary-foreground">
              <ArrowLeft className="w-4 h-4" />
              Back to Catalog
            </Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <section
        className="bg-card border-b border-border py-4"
        data-ocid="idol_detail.breadcrumb.section"
      >
        <div className="container max-w-6xl mx-auto px-4">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-primary transition-smooth">
              Home
            </Link>
            <span>/</span>
            <Link
              to="/catalog"
              className="hover:text-primary transition-smooth"
            >
              Catalog
            </Link>
            <span>/</span>
            <span className="text-foreground truncate max-w-48">
              {idol.name}
            </span>
          </nav>
        </div>
      </section>

      <section className="py-10 bg-background" data-ocid="idol_detail.section">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-10 lg:gap-14">
            {/* Image */}
            <div className="space-y-4">
              <div className="aspect-square rounded-xl overflow-hidden border border-border bg-muted shadow-subtle">
                {idol.images[0] ? (
                  <img
                    src={idol.images[0]}
                    alt={idol.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-6xl">
                    🪔
                  </div>
                )}
              </div>
              {idol.images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-1">
                  {idol.images.slice(1).map((img) => (
                    <div
                      key={img}
                      className="w-20 h-20 rounded-lg border border-border overflow-hidden shrink-0 bg-muted"
                    >
                      <img
                        src={img}
                        alt={idol.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Details */}
            <div data-ocid="idol_detail.info.panel">
              <div className="flex items-start gap-3 mb-3 flex-wrap">
                <Badge className="bg-primary/10 text-primary border-primary/30">
                  {categoryLabel(idol.category)}
                </Badge>
                {idol.stockQuantity <= 3n && (
                  <Badge className="bg-accent/10 text-accent border-accent/30">
                    Only {Number(idol.stockQuantity)} left
                  </Badge>
                )}
              </div>

              <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
                {idol.name}
              </h1>
              <p className="text-2xl font-display font-bold text-primary mb-6">
                {formatPrice(idol.price)}
              </p>

              <p className="text-muted-foreground font-body leading-relaxed mb-8">
                {idol.description}
              </p>

              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="bg-muted/50 rounded-lg p-3 text-center border border-border">
                  <Ruler className="w-4 h-4 text-primary mx-auto mb-1.5" />
                  <p className="text-xs text-muted-foreground">Height</p>
                  <p className="font-semibold text-sm text-foreground">
                    {Number(idol.heightCm)} cm
                  </p>
                </div>
                <div className="bg-muted/50 rounded-lg p-3 text-center border border-border">
                  <Tag className="w-4 h-4 text-primary mx-auto mb-1.5" />
                  <p className="text-xs text-muted-foreground">Material</p>
                  <p className="font-semibold text-sm text-foreground truncate">
                    {idol.material}
                  </p>
                </div>
                <div className="bg-muted/50 rounded-lg p-3 text-center border border-border">
                  <Package className="w-4 h-4 text-primary mx-auto mb-1.5" />
                  <p className="text-xs text-muted-foreground">In Stock</p>
                  <p className="font-semibold text-sm text-foreground">
                    {Number(idol.stockQuantity)}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link
                    to="/contact"
                    search={{
                      idolId: idol.id.toString(),
                      idolName: idol.name,
                    }}
                    className="flex-1"
                  >
                    <Button
                      size="lg"
                      className="w-full gap-2 bg-primary text-primary-foreground hover:bg-primary/90 shadow-elevated transition-smooth"
                      data-ocid="idol_detail.enquire.primary_button"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Enquire to Purchase
                    </Button>
                  </Link>
                  <Button
                    type="button"
                    size="lg"
                    variant="outline"
                    className="gap-2 border-border border-emerald-600/40 text-emerald-800 hover:bg-emerald-50 dark:text-emerald-200 dark:hover:bg-emerald-950/40"
                    onClick={handleWhatsAppEnquiry}
                    data-ocid="idol_detail.whatsapp.enquire_button"
                  >
                    <span className="text-lg leading-none" aria-hidden>
                      💬
                    </span>
                    WhatsApp enquiry
                  </Button>
                </div>
                <Link to="/catalog" className="sm:w-auto w-full">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto gap-2 border-border hover:border-primary transition-smooth"
                    data-ocid="idol_detail.back.secondary_button"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back to catalog
                  </Button>
                </Link>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Website enquiries appear in the admin panel. WhatsApp opens chat
                and also logs a lead for your team.
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
