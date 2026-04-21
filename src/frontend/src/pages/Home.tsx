import { Layout } from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useIdols } from "@/hooks/use-backend";
import { type Idol, categoryLabel, formatPrice } from "@/types";
import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, Award, Leaf, Star, Truck } from "lucide-react";
import { motion } from "motion/react";

const TRUST_SIGNALS = [
  {
    icon: Award,
    title: "Master Artisans",
    desc: "Handcrafted by skilled craftsmen with 20+ years of expertise",
  },
  {
    icon: Leaf,
    title: "Eco-Friendly Options",
    desc: "Natural and biodegradable idols that honor nature",
  },
  {
    icon: Truck,
    title: "Safe Delivery",
    desc: "Carefully packed and delivered to your doorstep",
  },
  {
    icon: Star,
    title: "Blessed Quality",
    desc: "Each idol crafted with devotion and attention to detail",
  },
];

function IdolCard({ idol, index }: { idol: Idol; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.5 }}
      data-ocid={`featured.idol.item.${index + 1}`}
    >
      <Link
        to="/catalog/$idolId"
        params={{ idolId: idol.id.toString() }}
        className="group block"
      >
        <div className="bg-card rounded-xl border border-border overflow-hidden shadow-subtle hover:shadow-elevated transition-smooth hover:-translate-y-1">
          <div className="aspect-square overflow-hidden bg-muted relative">
            {idol.images[0] ? (
              <img
                src={idol.images[0]}
                alt={idol.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-smooth"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-4xl">
                🪔
              </div>
            )}
            <Badge className="absolute top-2 right-2 bg-primary/90 text-primary-foreground text-xs">
              {categoryLabel(idol.category)}
            </Badge>
          </div>
          <div className="p-4">
            <h3 className="font-display font-semibold text-foreground text-sm truncate mb-1">
              {idol.name}
            </h3>
            <p className="text-xs text-muted-foreground mb-2">
              {idol.material} · {Number(idol.heightCm)} cm
            </p>
            <div className="flex items-center justify-between">
              <span className="font-display font-bold text-primary text-base">
                {formatPrice(idol.price)}
              </span>
              <Button
                size="sm"
                variant="outline"
                className="text-xs h-7 px-3 border-primary/40 text-primary hover:bg-primary hover:text-primary-foreground transition-smooth"
              >
                View
              </Button>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export function HomePage() {
  const { data: idols = [], isLoading } = useIdols();
  const featuredIdols = idols.slice(0, 6);

  return (
    <Layout>
      {/* Hero Section */}
      <section
        className="relative min-h-[580px] flex items-center overflow-hidden"
        data-ocid="hero.section"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.96 0.02 65) 0%, oklch(0.98 0.015 55) 50%, oklch(0.97 0.01 60) 100%)",
        }}
      >
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        <div className="container max-w-7xl mx-auto px-4 py-12 grid md:grid-cols-2 gap-8 items-center relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <Badge className="mb-4 bg-secondary/20 text-secondary-foreground border-secondary/30 font-body text-xs px-3 py-1">
              🪔 Ganesh Chaturthi Special Collection
            </Badge>
            <h1 className="font-display text-5xl md:text-6xl font-bold text-foreground leading-tight mb-4">
              Shop Premium
              <br />
              <span className="text-primary">Ganpati Idols</span>
            </h1>
            <p className="font-body text-lg text-muted-foreground mb-8 leading-relaxed max-w-md">
              Handcrafted Murtis to Bring Home Prosperity &amp; Joy This Festive
              Season
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/catalog"
                data-ocid="hero.explore_catalog.primary_button"
              >
                <Button
                  size="lg"
                  className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90 shadow-elevated transition-smooth px-7"
                >
                  Explore Collections
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link to="/contact" data-ocid="hero.contact.secondary_button">
                <Button
                  size="lg"
                  variant="outline"
                  className="gap-2 border-border hover:border-primary hover:text-primary transition-smooth px-7"
                >
                  Enquire Now
                </Button>
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="relative flex justify-center"
          >
            <div className="relative w-full max-w-lg">
              <div
                className="absolute inset-0 rounded-3xl opacity-20 blur-3xl"
                style={{
                  background:
                    "radial-gradient(circle, oklch(0.75 0.18 65), oklch(0.65 0.22 45))",
                }}
              />
              <img
                src="/assets/generated/ganpati-hero.dim_1200x600.jpg"
                alt="Premium Ganpati Idol"
                className="relative z-10 w-full rounded-3xl shadow-elevated object-cover aspect-[4/3]"
              />
              <div className="absolute -bottom-3 -right-3 bg-card border border-border rounded-xl px-4 py-2.5 shadow-elevated z-20">
                <p className="text-xs text-muted-foreground font-body">
                  Starting from
                </p>
                <p className="font-display font-bold text-primary text-lg">
                  ₹1,200
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Idols */}
      <section className="py-16 bg-background" data-ocid="featured.section">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="h-px flex-1 max-w-16 bg-border" />
              <span className="text-xl">✦</span>
              <div className="h-px flex-1 max-w-16 bg-border" />
            </div>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-display text-3xl md:text-4xl font-bold text-foreground"
            >
              Featured Ganpati Idols
            </motion.h2>
            <p className="text-muted-foreground mt-3 font-body">
              Discover our most beloved sacred murtis
            </p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {Array.from({ length: 6 }, (_, i) => `skel-${i}`).map((key) => (
                <div
                  key={key}
                  className="bg-card rounded-xl border border-border overflow-hidden animate-pulse"
                >
                  <div className="aspect-square bg-muted" />
                  <div className="p-4 space-y-2">
                    <div className="h-3 bg-muted rounded w-3/4" />
                    <div className="h-3 bg-muted rounded w-1/2" />
                    <div className="h-7 bg-muted rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {featuredIdols.map((idol, i) => (
                <IdolCard key={idol.id.toString()} idol={idol} index={i} />
              ))}
            </div>
          )}

          <div className="text-center mt-10">
            <Link to="/catalog" data-ocid="featured.view_all.button">
              <Button
                variant="outline"
                size="lg"
                className="gap-2 border-primary/40 text-primary hover:bg-primary hover:text-primary-foreground transition-smooth px-8"
              >
                View All Idols
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Signals */}
      <section
        className="py-14 bg-muted/40 border-y border-border"
        data-ocid="trust.section"
      >
        <div className="container max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {TRUST_SIGNALS.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <item.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-display font-semibold text-foreground text-sm mb-1">
                  {item.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-background" data-ocid="cta.section">
        <div className="container max-w-3xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Can't find the perfect idol?
            </h2>
            <p className="text-muted-foreground font-body mb-8 text-lg">
              Contact us for custom orders. We create bespoke Ganpati murtis
              tailored to your specific requirements.
            </p>
            <Link to="/contact" data-ocid="cta.contact.primary_button">
              <Button
                size="lg"
                className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90 shadow-elevated transition-smooth px-10"
              >
                Get in Touch
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
