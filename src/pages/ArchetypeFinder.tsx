import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useBrandData } from '@/hooks/useBrandData';
import { Brand, QuadrantType, getQuadrant } from '@/types/brand';
import { ArchetypeHero } from '@/components/archetype/ArchetypeHero';
import { BrandArchetypeSearch } from '@/components/archetype/BrandArchetypeSearch';
import { ArchetypeResult } from '@/components/archetype/ArchetypeResult';
import { ArchetypeGallery } from '@/components/archetype/ArchetypeGallery';
import { ArchetypeCTA } from '@/components/archetype/ArchetypeCTA';
import sbIndexLogo from '@/assets/sb-index-logo.png';

export default function ArchetypeFinder() {
  const { brands, loading, stats } = useBrandData();
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);

  // Get example brands for each quadrant
  const exampleBrands = useMemo(() => {
    if (brands.length === 0) return undefined;

    const examples: Record<QuadrantType, string[]> = {
      fortress: [],
      challenger: [],
      sleeper: [],
      danger: []
    };

    // Get a few notable examples for each quadrant
    brands.forEach(brand => {
      if (brand.Inflation_Performance === null) return;
      
      const quadrant = getQuadrant(
        brand.Volatility,
        brand.Inflation_Performance,
        stats.medianVolatility,
        stats.medianInflation
      );

      if (examples[quadrant].length < 5) {
        examples[quadrant].push(brand.Brand);
      }
    });

    return examples;
  }, [brands, stats]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <img src={sbIndexLogo} alt="SB Index" className="h-8" />
          </Link>
          <Button asChild variant="ghost" size="sm" className="gap-2">
            <Link to="/">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="pb-16">
        <ArchetypeHero />
        
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-pulse text-muted-foreground">Loading brand data...</div>
          </div>
        ) : (
          <>
            <BrandArchetypeSearch 
              brands={brands}
              onBrandSelect={setSelectedBrand}
              selectedBrand={selectedBrand}
            />

            {selectedBrand && (
              <ArchetypeResult 
                brand={selectedBrand}
                medianVolatility={stats.medianVolatility}
                medianInflation={stats.medianInflation}
              />
            )}

            {selectedBrand && <ArchetypeCTA />}

            <ArchetypeGallery exampleBrands={exampleBrands} />

            {!selectedBrand && <ArchetypeCTA />}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-8 text-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} SB Index. All rights reserved.</p>
      </footer>
    </div>
  );
}
