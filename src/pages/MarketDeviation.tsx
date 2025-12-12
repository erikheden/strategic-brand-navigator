import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { MarketDeviationChart } from '@/components/dashboard/MarketDeviationChart';

const MarketDeviation = () => {
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      
      <main className="container mx-auto px-4 py-6 space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">Market Deviation Analysis</h1>
          <p className="text-muted-foreground">
            Compare how brands perform relative to their market average over time
          </p>
        </div>

        <MarketDeviationChart />
      </main>
    </div>
  );
};

export default MarketDeviation;
