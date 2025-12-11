import { Link } from 'react-router-dom';
import { BarChart3, Sparkles } from 'lucide-react';
import { MethodologyModal } from './MethodologyModal';
import { Button } from '@/components/ui/button';

export function DashboardHeader() {
  return (
    <header className="border-b border-border bg-card shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary text-primary-foreground">
            <BarChart3 className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-foreground">Global Brand Resilience Index</h1>
            <p className="text-sm text-muted-foreground">2025 Strategic Analysis Dashboard</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button asChild variant="outline" size="sm">
            <Link to="/insights" className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              AI Insights
            </Link>
          </Button>
          <MethodologyModal />
        </div>
      </div>
    </header>
  );
}
