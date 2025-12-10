import { useMemo } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Brand } from '@/types/brand';

interface ChartFiltersProps {
  brands: Brand[];
  selectedCountry: string | null;
  selectedIndustry: string | null;
  onCountryChange: (country: string | null) => void;
  onIndustryChange: (industry: string | null) => void;
}

export function ChartFilters({
  brands,
  selectedCountry,
  selectedIndustry,
  onCountryChange,
  onIndustryChange,
}: ChartFiltersProps) {
  const countries = useMemo(() => {
    const uniqueCountries = [...new Set(brands.map(b => b.Country))].filter(Boolean).sort();
    return uniqueCountries;
  }, [brands]);

  const industries = useMemo(() => {
    const filteredBrands = selectedCountry 
      ? brands.filter(b => b.Country === selectedCountry)
      : brands;
    const uniqueIndustries = [...new Set(filteredBrands.map(b => b.Industry))].filter(Boolean).sort();
    return uniqueIndustries;
  }, [brands, selectedCountry]);

  return (
    <div className="flex items-center gap-2">
      <Select
        value={selectedCountry ?? 'all'}
        onValueChange={(value) => onCountryChange(value === 'all' ? null : value)}
      >
        <SelectTrigger className="h-8 w-[130px] text-xs bg-background">
          <SelectValue placeholder="Country" />
        </SelectTrigger>
        <SelectContent className="bg-card border-border z-50">
          <SelectItem value="all" className="text-xs">All Countries</SelectItem>
          {countries.map((country) => (
            <SelectItem key={country} value={country} className="text-xs">
              {country}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={selectedIndustry ?? 'all'}
        onValueChange={(value) => onIndustryChange(value === 'all' ? null : value)}
      >
        <SelectTrigger className="h-8 w-[150px] text-xs bg-background">
          <SelectValue placeholder="Industry" />
        </SelectTrigger>
        <SelectContent className="bg-card border-border z-50 max-h-[300px]">
          <SelectItem value="all" className="text-xs">All Industries</SelectItem>
          {industries.map((industry) => (
            <SelectItem key={industry} value={industry} className="text-xs">
              {industry}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
