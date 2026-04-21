import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useSubmitInquiry } from "@/hooks/use-backend";
import { Link } from "@tanstack/react-router";
import {
  CheckCircle,
  type LucideIcon,
  Mail,
  MapPin,
  Phone,
  Send,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

interface ContactInfoItem {
  icon: LucideIcon;
  label: string;
  value: string;
  href: string | null;
}

const CONTACT_INFO: ContactInfoItem[] = [
  {
    icon: Phone,
    label: "Call Us",
    value: "+91 98765 43210",
    href: "tel:+919876543210",
  },
  {
    icon: Mail,
    label: "Email Us",
    value: "namaste@ganpatistore.in",
    href: "mailto:namaste@ganpatistore.in",
  },
  {
    icon: MapPin,
    label: "Visit Us",
    value: "Mumbai, Maharashtra",
    href: null,
  },
];

function ContactInfoRow({ item }: { item: ContactInfoItem }) {
  const content = (
    <>
      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
        <item.icon className="w-4 h-4 text-primary" />
      </div>
      <div>
        <p className="text-xs text-muted-foreground">{item.label}</p>
        <p className="font-medium text-foreground text-sm">{item.value}</p>
      </div>
    </>
  );
  if (item.href) {
    return (
      <a
        href={item.href}
        className="flex items-center gap-4 group hover:text-primary transition-smooth"
      >
        {content}
      </a>
    );
  }
  return <div className="flex items-center gap-4">{content}</div>;
}

const PREFERRED_CONTACT_OPTIONS = ["Phone", "Email", "WhatsApp"];

export function ContactPage() {
  const submit = useSubmitInquiry();
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    customerName: "",
    email: "",
    phone: "",
    message: "",
    idolName: "",
    preferredContact: "Phone",
  });

  function handleChange(field: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.customerName || !form.email || !form.phone || !form.message) {
      toast.error("Please fill in all required fields");
      return;
    }
    try {
      await submit.mutateAsync({
        idolId: 0n,
        idolName: form.idolName || "General Enquiry",
        customerName: form.customerName,
        email: form.email,
        phone: form.phone,
        message: form.message,
        preferredContact: form.preferredContact,
      });
      setSuccess(true);
    } catch {
      toast.error("Failed to send inquiry. Please try again.");
    }
  }

  return (
    <Layout>
      {/* Header */}
      <section
        className="bg-card border-b border-border py-10"
        data-ocid="contact.header.section"
      >
        <div className="container max-w-6xl mx-auto px-4">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Link to="/" className="hover:text-primary transition-smooth">
              Home
            </Link>
            <span>/</span>
            <span className="text-foreground">Contact</span>
          </nav>
          <h1 className="font-display text-4xl font-bold text-foreground mb-2">
            Get in Touch
          </h1>
          <p className="text-muted-foreground font-body">
            Reach out to enquire about our sacred Ganpati idols
          </p>
        </div>
      </section>

      <section className="py-12 bg-background" data-ocid="contact.section">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-5 gap-10">
            <div className="md:col-span-2">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="font-display text-2xl font-bold text-foreground mb-3">
                  Contact Details
                </h2>
                <p className="text-muted-foreground font-body text-sm mb-7 leading-relaxed">
                  Have questions about our sacred idols? We're here to help you
                  find the perfect Ganpati for your home or event.
                </p>

                <div className="space-y-4 mb-8">
                  {CONTACT_INFO.map((item) => (
                    <ContactInfoRow key={item.label} item={item} />
                  ))}
                </div>

                <div className="bg-muted/50 rounded-xl border border-border p-5">
                  <h3 className="font-display font-semibold text-foreground mb-1 text-sm">
                    Festival Season Hours
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Mon–Sat: 9:00 AM – 8:00 PM
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Sunday: 10:00 AM – 6:00 PM
                  </p>
                  <p className="text-xs text-primary mt-2 font-medium">
                    🪔 Extended hours during Ganesh Chaturthi
                  </p>
                </div>
              </motion.div>
            </div>

            <div className="md:col-span-3">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-card rounded-xl border border-border shadow-subtle p-6 md:p-8"
              >
                {success ? (
                  <div
                    className="text-center py-10"
                    data-ocid="contact.success_state"
                  >
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="font-display text-2xl font-bold text-foreground mb-2">
                      Thank You!
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      Your inquiry has been received. We'll contact you within
                      24 hours.
                    </p>
                    <Button
                      type="button"
                      onClick={() => {
                        setSuccess(false);
                        setForm({
                          customerName: "",
                          email: "",
                          phone: "",
                          message: "",
                          idolName: "",
                          preferredContact: "Phone",
                        });
                      }}
                      variant="outline"
                      className="gap-2 border-primary/40 text-primary"
                    >
                      Send Another Inquiry
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <h3 className="font-display text-xl font-bold text-foreground mb-1">
                      Send Inquiry
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      We'll respond within 24 hours
                    </p>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label
                          htmlFor="customerName"
                          className="text-xs font-medium"
                        >
                          Full Name *
                        </Label>
                        <Input
                          id="customerName"
                          value={form.customerName}
                          onChange={(e) =>
                            handleChange("customerName", e.target.value)
                          }
                          placeholder="Ramesh Sharma"
                          required
                          data-ocid="contact.name.input"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="phone" className="text-xs font-medium">
                          Phone Number *
                        </Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={form.phone}
                          onChange={(e) =>
                            handleChange("phone", e.target.value)
                          }
                          placeholder="+91 98765 43210"
                          required
                          data-ocid="contact.phone.input"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="email" className="text-xs font-medium">
                        Email Address *
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={form.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        placeholder="ramesh@example.com"
                        required
                        data-ocid="contact.email.input"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="idolName" className="text-xs font-medium">
                        Interested Idol (optional)
                      </Label>
                      <Input
                        id="idolName"
                        value={form.idolName}
                        onChange={(e) =>
                          handleChange("idolName", e.target.value)
                        }
                        placeholder="e.g. Shubh Drishti Ganpati"
                        data-ocid="contact.idol_name.input"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium">
                        Preferred Contact Method
                      </Label>
                      <div className="flex gap-3">
                        {PREFERRED_CONTACT_OPTIONS.map((opt) => (
                          <button
                            key={opt}
                            type="button"
                            onClick={() =>
                              handleChange("preferredContact", opt)
                            }
                            data-ocid={`contact.preferred_contact.${opt.toLowerCase()}.radio`}
                            className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-smooth ${
                              form.preferredContact === opt
                                ? "bg-primary text-primary-foreground border-primary"
                                : "border-border text-muted-foreground hover:border-primary hover:text-primary"
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="message" className="text-xs font-medium">
                        Message *
                      </Label>
                      <Textarea
                        id="message"
                        rows={4}
                        value={form.message}
                        onChange={(e) =>
                          handleChange("message", e.target.value)
                        }
                        placeholder="Tell us about the idol you're looking for, size, occasion, budget…"
                        required
                        data-ocid="contact.message.textarea"
                      />
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full gap-2 bg-primary text-primary-foreground hover:bg-primary/90 shadow-elevated transition-smooth"
                      disabled={submit.isPending}
                      data-ocid="contact.submit.submit_button"
                    >
                      {submit.isPending ? (
                        <span className="flex items-center gap-2">
                          <span className="w-4 h-4 border-2 border-primary-foreground/40 border-t-primary-foreground rounded-full animate-spin" />
                          Sending…
                        </span>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Send Inquiry
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
