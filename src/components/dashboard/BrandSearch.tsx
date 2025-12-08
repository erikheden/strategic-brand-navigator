import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface BrandSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export function BrandSearch({ value, onChange }: BrandSearchProps) {
  return (
    <div className="relative w-full max-w-md">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="text"
        placeholder="Search brands..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-10 h-11 bg-card border-border shadow-sm focus-visible:ring-primary"
      />
    </div>
  );
}
