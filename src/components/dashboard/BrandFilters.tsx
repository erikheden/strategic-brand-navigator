import { useMemo } from 'react';
import { Filter, X } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Brand } from '@/types/brand';

interface BrandFiltersProps {
  brands: Brand[];
  selectedCountry: string | null;
  selectedIndustry: string | null;
  onCountryChange: (country: string | null) => void;
  onIndustryChange: (industry: string | null) => void;
}

export function BrandFilters({
  brands,
  selectedCountry,
  selectedIndustry,
  onCountryChange,
  onIndustryChange,
}: BrandFiltersProps) {
  const countries = useMemo(() => {
    const uniqueCountries = [...new Set(brands.map(b => b.Country))].sort();
    return uniqueCountries;
  }, [brands]);

  const industries = useMemo(() => {
    const filteredBrands = selectedCountry 
      ? brands.filter(b => b.Country === selectedCountry)
      : brands;
    const uniqueIndustries = [...new Set(filteredBrands.map(b => b.Industry))].sort();
    return uniqueIndustries;
  }, [brands, selectedCountry]);

  const hasFilters = selectedCountry || selectedIndustry;

  const clearFilters = () => {
    onCountryChange(null);
    onIndustryChange(null);
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Filter className="h-4 w-4" />
        <span className="font-medium">Filters:</span>
      </div>

      <Select
        value={selectedCountry ?? 'all'}
        onValueChange={(value) => onCountryChange(value === 'all' ? null : value)}
      >
        <SelectTrigger className="w-[180px] bg-card">
          <SelectValue placeholder="All Countries" />
        </SelectTrigger>
        <SelectContent className="bg-card border-border z-50">
          <SelectItem value="all">All Countries</SelectItem>
          {countries.map((country) => (
            <SelectItem key={country} value={country}>
              {country}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={selectedIndustry ?? 'all'}
        onValueChange={(value) => onIndustryChange(value === 'all' ? null : value)}
      >
        <SelectTrigger className="w-[220px] bg-card">
          <SelectValue placeholder="All Industries" />
        </SelectTrigger>
        <SelectContent className="bg-card border-border z-50 max-h-[300px]">
          <SelectItem value="all">All Industries</SelectItem>
          {industries.map((industry) => (
            <SelectItem key={industry} value={industry}>
              {industry}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {hasFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={clearFilters}
          className="h-9 gap-1.5 text-muted-foreground hover:text-foreground"
        >
          <X className="h-3.5 w-3.5" />
          Clear
        </Button>
      )}
    </div>
  );
}
