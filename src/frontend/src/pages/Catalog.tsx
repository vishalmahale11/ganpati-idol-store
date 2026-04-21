import { Layout } from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useIdols } from "@/hooks/use-backend";
import { ALL_CATEGORIES, type Idol, categoryLabel, formatPrice } from "@/types";
import { Link } from "@tanstack/react-router";
import { Filter, Search } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

function IdolCard({ idol, index }: { idol: Idol; index: number }) {
  return (
    <motion.div
      key={idol.id.toString()}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      data-ocid={`catalog.idol.item.${index + 1}`}
    >
      <Link
        to="/catalog/$idolId"
        params={{ idolId: idol.id.toString() }}
        className="group block h-full"
      >
        <div className="bg-card rounded-xl border border-border overflow-hidden shadow-subtle hover:shadow-elevated transition-smooth hover:-translate-y-1 h-full flex flex-col">
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
            {idol.stockQuantity <= 3n && (
              <Badge className="absolute top-2 left-2 bg-accent text-accent-foreground text-xs">
                Only {Number(idol.stockQuantity)} left
              </Badge>
            )}
          </div>
          <div className="p-4 flex-1 flex flex-col">
            <h3 className="font-display font-semibold text-foreground text-sm line-clamp-2 mb-1">
              {idol.name}
            </h3>
            <p className="text-xs text-muted-foreground mb-3">
              {idol.material} · {Number(idol.heightCm)} cm
            </p>
            <div className="mt-auto flex items-center justify-between gap-2">
              <span className="font-display font-bold text-primary">
                {formatPrice(idol.price)}
              </span>
              <Button
                size="sm"
                className="text-xs h-7 px-3 bg-primary text-primary-foreground hover:bg-primary/90 transition-smooth"
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

export function CatalogPage() {
  const { data: idols = [], isLoading } = useIdols();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const filtered = idols.filter((idol) => {
    const matchesSearch =
      idol.name.toLowerCase().includes(search.toLowerCase()) ||
      idol.material.toLowerCase().includes(search.toLowerCase());
    const matchesCat =
      activeCategory === "All" ||
      categoryLabel(idol.category) === activeCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <Layout>
      {/* Page Header */}
      <section
        className="bg-card border-b border-border py-10"
        data-ocid="catalog.header.section"
      >
        <div className="container max-w-7xl mx-auto px-4">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Link to="/" className="hover:text-primary transition-smooth">
              Home
            </Link>
            <span>/</span>
            <span className="text-foreground">Catalog</span>
          </nav>
          <h1 className="font-display text-4xl font-bold text-foreground mb-2">
            Ganpati Idol Collection
          </h1>
          <p className="text-muted-foreground font-body">
            Sacred handcrafted murtis for every home and occasion
          </p>
        </div>
      </section>

      <section className="py-10 bg-background" data-ocid="catalog.section">
        <div className="container max-w-7xl mx-auto px-4">
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or material…"
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                data-ocid="catalog.search_input"
              />
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Filter className="w-4 h-4 text-muted-foreground shrink-0" />
              {["All", ...ALL_CATEGORIES.map((c) => c.label)].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  data-ocid={`catalog.filter.${cat.toLowerCase().replace(/\s+/g, "_")}.tab`}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-smooth ${
                    activeCategory === cat
                      ? "bg-primary text-primary-foreground border-primary"
                      : "border-border text-muted-foreground hover:border-primary hover:text-primary bg-card"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <p className="text-sm text-muted-foreground mb-6">
            {isLoading
              ? "Loading…"
              : `${filtered.length} idol${filtered.length !== 1 ? "s" : ""} found`}
          </p>

          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {Array.from({ length: 8 }, (_, i) => `skel-${i}`).map((key) => (
                <div
                  key={key}
                  className="bg-card rounded-xl border border-border overflow-hidden animate-pulse"
                >
                  <div className="aspect-square bg-muted" />
                  <div className="p-4 space-y-2">
                    <div className="h-3 bg-muted rounded w-3/4" />
                    <div className="h-3 bg-muted rounded w-1/2" />
                    <div className="h-8 bg-muted rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20" data-ocid="catalog.empty_state">
              <div className="text-5xl mb-4">🪔</div>
              <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                No idols found
              </h3>
              <p className="text-muted-foreground mb-6">
                Try adjusting your search or filter
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearch("");
                  setActiveCategory("All");
                }}
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {filtered.map((idol, i) => (
                <IdolCard key={idol.id.toString()} idol={idol} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
