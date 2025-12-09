import { useState, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brand, getQuadrant, QUADRANT_CONFIG, QuadrantType } from '@/types/brand';
import { ArrowUpDown, ArrowUp, ArrowDown, TableIcon, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface BrandTableProps {
  brands: Brand[];
  searchQuery: string;
  selectedBrand: Brand | null;
  onSelectBrand: (brand: Brand) => void;
  medianVolatility: number;
  medianInflation: number;
}

type SortKey = 'Brand' | 'Country' | 'Industry' | 'Current_Score' | 'Volatility' | 'Inflation_Performance' | 'Cluster_Name';
type SortOrder = 'asc' | 'desc';

export function BrandTable({
  brands,
  searchQuery,
  selectedBrand,
  onSelectBrand,
  medianVolatility,
  medianInflation,
}: BrandTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>('Current_Score');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  const filteredAndSortedBrands = useMemo(() => {
    let filtered = brands;
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = brands.filter(
        b =>
          b.Brand.toLowerCase().includes(query) ||
          b.Country.toLowerCase().includes(query) ||
          b.Industry.toLowerCase().includes(query)
      );
    }

    return [...filtered].sort((a, b) => {
      const aValue = a[sortKey];
      const bValue = b[sortKey];

      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortOrder === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      return sortOrder === 'asc'
        ? (aValue as number) - (bValue as number)
        : (bValue as number) - (aValue as number);
    });
  }, [brands, searchQuery, sortKey, sortOrder]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('desc');
    }
  };

  const SortIcon = ({ columnKey }: { columnKey: SortKey }) => {
    if (sortKey !== columnKey) {
      return <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground" />;
    }
    return sortOrder === 'asc' ? (
      <ArrowUp className="h-3.5 w-3.5" />
    ) : (
      <ArrowDown className="h-3.5 w-3.5" />
    );
  };

  const quadrantStyles: Record<QuadrantType, string> = {
    fortress: 'bg-fortress-bg text-fortress',
    challenger: 'bg-challenger-bg text-challenger',
    sleeper: 'bg-sleeper-bg text-sleeper',
    danger: 'bg-danger-bg text-danger',
  };

  return (
    <Card className="shadow-card">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
          <TableIcon className="h-5 w-5 text-primary" />
          Brand Data
          <span className="ml-2 text-sm font-normal text-muted-foreground">
            ({filteredAndSortedBrands.length} brands)
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border overflow-hidden">
          <div className="max-h-[400px] overflow-auto">
            <Table>
              <TableHeader className="sticky top-0 bg-muted/80 backdrop-blur-sm">
                <TableRow>
                  <TableHead className="w-[200px]">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 gap-1 -ml-3 font-medium"
                      onClick={() => handleSort('Brand')}
                    >
                      Brand
                      <SortIcon columnKey="Brand" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 gap-1 -ml-3 font-medium"
                      onClick={() => handleSort('Country')}
                    >
                      Country
                      <SortIcon columnKey="Country" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 gap-1 -ml-3 font-medium"
                      onClick={() => handleSort('Industry')}
                    >
                      Industry
                      <SortIcon columnKey="Industry" />
                    </Button>
                  </TableHead>
                  <TableHead className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 gap-1 -mr-1 font-medium"
                        onClick={() => handleSort('Current_Score')}
                      >
                        Score
                        <SortIcon columnKey="Current_Score" />
                      </Button>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent className="max-w-[200px]">
                            <p className="text-xs">The brand's official Sustainable Brand Index Score</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </TableHead>
                  <TableHead className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 gap-1 -mr-1 font-medium"
                        onClick={() => handleSort('Volatility')}
                      >
                        Volatility
                        <SortIcon columnKey="Volatility" />
                      </Button>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent className="max-w-[200px]">
                            <p className="text-xs">Measures how much the brand's score fluctuates over time. Lower volatility indicates more stable performance.</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </TableHead>
                  <TableHead className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 gap-1 -mr-1 font-medium"
                        onClick={() => handleSort('Inflation_Performance')}
                      >
                        Inflation Perf.
                        <SortIcon columnKey="Inflation_Performance" />
                      </Button>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent className="max-w-[220px]">
                            <p className="text-xs">Measures brand performance relative to market conditions. Positive values indicate outperformance, negative values suggest underperformance.</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 gap-1 -ml-3 font-medium"
                      onClick={() => handleSort('Cluster_Name')}
                    >
                      Cluster
                      <SortIcon columnKey="Cluster_Name" />
                    </Button>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSortedBrands.map((brand) => {
                  const quadrant = getQuadrant(
                    brand.Volatility,
                    brand.Inflation_Performance,
                    medianVolatility,
                    medianInflation
                  );
                  const isSelected = selectedBrand?.Brand === brand.Brand;

                  return (
                    <TableRow
                      key={`${brand.Brand}-${brand.Country}`}
                      className={`cursor-pointer transition-colors hover:bg-muted/50 ${
                        isSelected ? 'bg-primary/5 hover:bg-primary/10' : ''
                      }`}
                      onClick={() => onSelectBrand(brand)}
                    >
                      <TableCell className="font-medium">{brand.Brand}</TableCell>
                      <TableCell>{brand.Country}</TableCell>
                      <TableCell className="text-muted-foreground">{brand.Industry}</TableCell>
                      <TableCell className="text-right font-mono">{brand.Current_Score.toFixed(1)}</TableCell>
                      <TableCell className="text-right font-mono">{brand.Volatility.toFixed(2)}</TableCell>
                      <TableCell className="text-right font-mono">
                        {brand.Inflation_Performance !== null
                          ? brand.Inflation_Performance.toFixed(2)
                          : '—'}
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${quadrantStyles[quadrant]}`}>
                          {QUADRANT_CONFIG[quadrant].emoji} {QUADRANT_CONFIG[quadrant].name}
                        </span>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
