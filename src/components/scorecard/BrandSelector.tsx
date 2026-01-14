import { useState, useMemo } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Search, Building2 } from 'lucide-react';
import { Brand } from '@/types/brand';

interface BrandSelectorProps {
  countries: string[];
  getBrandsForCountry: (country: string) => Brand[];
  onBrandSelect: (brand: Brand) => void;
  disabled?: boolean;
}

export function BrandSelector({ 
  countries, 
  getBrandsForCountry, 
  onBrandSelect,
  disabled 
}: BrandSelectorProps) {
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [selectedBrandName, setSelectedBrandName] = useState<string>('');

  const filteredBrands = useMemo(() => {
    if (!selectedCountry) return [];
    return getBrandsForCountry(selectedCountry);
  }, [selectedCountry, getBrandsForCountry]);

  const handleCountryChange = (country: string) => {
    setSelectedCountry(country);
    setSelectedBrandName('');
  };

  const handleBrandChange = (brandName: string) => {
    setSelectedBrandName(brandName);
    const brand = filteredBrands.find(b => b.Brand === brandName);
    if (brand) {
      onBrandSelect(brand);
    }
  };

  return (
    <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 rounded-lg bg-primary/10">
          <Search className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground">Generate Score Card</h2>
          <p className="text-sm text-muted-foreground">Select a brand to view its sustainability performance</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="country" className="text-sm font-medium text-foreground">
            Market
          </Label>
          <Select value={selectedCountry} onValueChange={handleCountryChange} disabled={disabled}>
            <SelectTrigger id="country" className="w-full">
              <SelectValue placeholder="Select country..." />
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
          <Label htmlFor="brand" className="text-sm font-medium text-foreground">
            Brand
          </Label>
          <Select 
            value={selectedBrandName} 
            onValueChange={handleBrandChange}
            disabled={!selectedCountry || disabled}
          >
            <SelectTrigger id="brand" className="w-full">
              <SelectValue placeholder={selectedCountry ? "Select brand..." : "Select country first"} />
            </SelectTrigger>
            <SelectContent>
              {filteredBrands.map(brand => (
                <SelectItem key={`${brand.Brand}-${brand.Country}`} value={brand.Brand}>
                  <div className="flex items-center gap-2">
                    <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>{brand.Brand}</span>
                    <span className="text-xs text-muted-foreground">• {brand.Industry}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
