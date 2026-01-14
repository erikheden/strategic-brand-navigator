import { Link } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useBrandScoreCard } from '@/hooks/useBrandScoreCard';
import { BrandSelector } from '@/components/scorecard/BrandSelector';
import { ScoreCardDisplay } from '@/components/scorecard/ScoreCardDisplay';
import sbIndexLogo from '@/assets/sb-index-logo.png';

export default function BrandScoreCard() {
  const {
    loading,
    error,
    countries,
    getBrandsForCountry,
    scoreCardData,
    loadingScoreCard,
    fetchScoreCardData,
    clearSelection,
  } = useBrandScoreCard();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <img src={sbIndexLogo} alt="SB Index" className="h-8" />
          </Link>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/5 to-background py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">
            Brand Sustainability Score Card
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Generate a comprehensive sustainability performance report for any brand in our database. 
            See how they compare against industry peers and market averages.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-3 text-muted-foreground">Loading brands...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-destructive/10 text-destructive rounded-lg p-4 text-center">
            {error}
          </div>
        )}

        {/* Brand Selector */}
        {!loading && !error && (
          <BrandSelector
            countries={countries}
            getBrandsForCountry={getBrandsForCountry}
            onBrandSelect={fetchScoreCardData}
            disabled={loadingScoreCard}
          />
        )}

        {/* Loading Score Card */}
        {loadingScoreCard && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-3 text-muted-foreground">Generating score card...</span>
          </div>
        )}

        {/* Score Card Display */}
        {scoreCardData && !loadingScoreCard && (
          <ScoreCardDisplay
            data={scoreCardData}
            onClose={clearSelection}
          />
        )}

        {/* Empty State */}
        {!loading && !error && !scoreCardData && !loadingScoreCard && (
          <div className="text-center py-12 text-muted-foreground">
            <p>Select a country and brand above to generate a score card.</p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-auto">
        <div className="max-w-4xl mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Sustainable Brand Index. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
