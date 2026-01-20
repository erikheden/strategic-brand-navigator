import { useParams, Link } from 'react-router-dom';
import { useBrandIntelligence } from '@/hooks/useBrandIntelligence';
import { HistoricalPerformanceChart } from '@/components/brand-profile/HistoricalPerformanceChart';
import { CompetitorTable } from '@/components/brand-profile/CompetitorTable';
import { CurrentScoreCard } from '@/components/brand-profile/CurrentScoreCard';
import { InsightsPanel } from '@/components/brand-profile/InsightsPanel';
import { SwotPanel } from '@/components/brand-profile/SwotPanel';
import { AgeGroupScoresChart } from '@/components/brand-profile/AgeGroupScoresChart';
import { MaterialityAreasChart } from '@/components/brand-profile/MaterialityAreasChart';
import { ArrowLeft, Loader2, Building2, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

const BrandProfile = () => {
  const { brandName, country } = useParams<{ brandName: string; country: string }>();
  const decodedBrand = decodeURIComponent(brandName || '');
  const decodedCountry = decodeURIComponent(country || '');

  const { data, loading, error, insights } = useBrandIntelligence(decodedBrand, decodedCountry);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading brand intelligence...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-destructive font-medium">Error loading data</p>
          <p className="text-muted-foreground text-sm mt-1">{error}</p>
          <Link to="/">
            <Button variant="outline" className="mt-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-6">
          <Link to="/">
            <Button variant="ghost" size="sm" className="mb-4 -ml-2">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">{decodedBrand}</h1>
              <div className="flex items-center gap-4 mt-2 text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {decodedCountry}
                </span>
                {data.currentData?.industry && (
                  <span className="flex items-center gap-1">
                    <Building2 className="h-4 w-4" />
                    {data.currentData.industry}
                  </span>
                )}
              </div>
            </div>
            
            {data.currentData && (
              <CurrentScoreCard data={data.currentData} />
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Quick Insights Panel */}
        <InsightsPanel insights={insights} brandName={decodedBrand} />

        {/* SWOT Analysis */}
        <SwotPanel
          brandName={decodedBrand}
          currentData={data.currentData}
          historicalScores={data.historicalScores}
          awarenessAttitude={data.awarenessAttitude}
          competitors={data.competitors}
          insights={insights}
        />

        {/* Charts Grid */}
        <div className="grid grid-cols-1 gap-6">
          <HistoricalPerformanceChart 
            data={data.historicalScores}
            brandName={decodedBrand}
            country={decodedCountry}
          />
        </div>

        {/* Demographics Section */}
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-foreground">Demographics & Materiality</h2>
          <p className="text-sm text-muted-foreground">Age-based perception and sustainability priorities</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AgeGroupScoresChart 
            data={data.ageGroupScores}
            brandName={decodedBrand}
          />
          <MaterialityAreasChart 
            data={data.materialityAreas}
            country={decodedCountry}
          />
        </div>

        {/* Competitor Table */}
        <CompetitorTable 
          competitors={data.competitors}
          currentBrand={decodedBrand}
          industry={data.currentData?.industry || ''}
        />
      </main>
    </div>
  );
};

export default BrandProfile;
