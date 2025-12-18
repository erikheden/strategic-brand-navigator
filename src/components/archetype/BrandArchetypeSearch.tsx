import { useState, useMemo } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Search } from 'lucide-react';
import { Brand } from '@/types/brand';

interface BrandArchetypeSearchProps {
  brands: Brand[];
  onBrandSelect: (brand: Brand | null) => void;
  selectedBrand: Brand | null;
}

export function BrandArchetypeSearch({ brands, onBrandSelect, selectedBrand }: BrandArchetypeSearchProps) {
  const [selectedCountry, setSelectedCountry] = useState<string>('');

  const countries = useMemo(() => {
    const uniqueCountries = [...new Set(brands.map(b => b.Country))].filter(Boolean).sort();
    return uniqueCountries;
  }, [brands]);

  const filteredBrands = useMemo(() => {
    if (!selectedCountry) return [];
    return brands
      .filter(b => b.Country === selectedCountry)
      .sort((a, b) => a.Brand.localeCompare(b.Brand));
  }, [brands, selectedCountry]);

  const handleCountryChange = (country: string) => {
    setSelectedCountry(country);
    onBrandSelect(null);
  };

  const handleBrandChange = (brandName: string) => {
    const brand = filteredBrands.find(b => b.Brand === brandName);
    onBrandSelect(brand || null);
  };

  return (
    <section className="max-w-xl mx-auto px-4 py-8">
      <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-primary/10">
            <Search className="h-5 w-5 text-primary" />
          </div>
          <h2 className="text-xl font-medium text-foreground">Find Your Brand</h2>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="country" className="text-sm text-muted-foreground">
              Select Market
            </Label>
            <Select value={selectedCountry} onValueChange={handleCountryChange}>
              <SelectTrigger id="country" className="w-full">
                <SelectValue placeholder="Choose a country..." />
              </SelectTrigger>
              <SelectContent>
                {countries.map(country => (
                  <SelectItem key={country} value={country}>
                    {country}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="brand" className="text-sm text-muted-foreground">
              Select Brand
            </Label>
            <Select 
              value={selectedBrand?.Brand || ''} 
              onValueChange={handleBrandChange}
              disabled={!selectedCountry}
            >
              <SelectTrigger id="brand" className="w-full">
                <SelectValue placeholder={selectedCountry ? "Choose a brand..." : "Select a country first"} />
              </SelectTrigger>
              <SelectContent>
                {filteredBrands.map(brand => (
                  <SelectItem key={`${brand.Brand}-${brand.Country}`} value={brand.Brand}>
                    {brand.Brand}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </section>
  );
}
