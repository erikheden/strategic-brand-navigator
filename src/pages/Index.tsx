import { useState, useMemo } from 'react';
import { useBrandData } from '@/hooks/useBrandData';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { BrandSearch } from '@/components/dashboard/BrandSearch';
import { BrandFilters } from '@/components/dashboard/BrandFilters';
import { BrandRadarChart } from '@/components/dashboard/BrandRadarChart';
import { BrandMomentumChart } from '@/components/dashboard/BrandMomentumChart';
import { CustomExplorerChart } from '@/components/dashboard/CustomExplorerChart';
import { StrategicInsight } from '@/components/dashboard/StrategicInsight';
import { BrandTable } from '@/components/dashboard/BrandTable';
import { Brand } from '@/types/brand';
import { Loader2 } from 'lucide-react';

const Index = () => {
  const { brands, loading, error, stats } = useBrandData();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null);

  const filteredBrands = useMemo(() => {
    let result = brands;
    if (selectedCountry) {
      result = result.filter(b => b.Country === selectedCountry);
    }
    if (selectedIndustry) {
      result = result.filter(b => b.Industry === selectedIndustry);
    }
    return result;
  }, [brands, selectedCountry, selectedIndustry]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading brand data...</p>
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
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      
      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <BrandSearch value={searchQuery} onChange={setSearchQuery} />
          <BrandFilters
            brands={brands}
            selectedCountry={selectedCountry}
            selectedIndustry={selectedIndustry}
            onCountryChange={setSelectedCountry}
            onIndustryChange={setSelectedIndustry}
          />
        </div>

        {/* Charts */}
        <div className="space-y-6">
          <BrandRadarChart
            brands={filteredBrands}
            searchQuery={searchQuery}
            selectedBrand={selectedBrand}
            onSelectBrand={setSelectedBrand}
            medianVolatility={stats.medianVolatility}
            medianInflation={stats.medianInflation}
          />
          <BrandMomentumChart
            brands={filteredBrands}
            searchQuery={searchQuery}
            selectedBrand={selectedBrand}
            onSelectBrand={setSelectedBrand}
          />
          <CustomExplorerChart
            brands={filteredBrands}
            searchQuery={searchQuery}
            selectedBrand={selectedBrand}
            onSelectBrand={setSelectedBrand}
          />
        </div>

        {/* Strategic Insight */}
        <StrategicInsight
          brand={selectedBrand}
          medianVolatility={stats.medianVolatility}
          medianInflation={stats.medianInflation}
        />

        {/* Data Table */}
        <BrandTable
          brands={filteredBrands}
          searchQuery={searchQuery}
          selectedBrand={selectedBrand}
          onSelectBrand={setSelectedBrand}
          medianVolatility={stats.medianVolatility}
          medianInflation={stats.medianInflation}
        />
      </main>
    </div>
  );
};

export default Index;
