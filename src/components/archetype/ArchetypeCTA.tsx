import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, BarChart3, Users, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

export function ArchetypeCTA() {
  return (
    <section className="max-w-4xl mx-auto px-4 py-12">
      <div className="bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 rounded-2xl p-8 md:p-12 text-center">
        <h2 className="text-2xl md:text-3xl font-light text-foreground mb-4">
          Want Deeper Insights?
        </h2>
        <p className="text-muted-foreground max-w-xl mx-auto mb-8">
          Your archetype is just the beginning. Discover comprehensive sustainability analytics, 
          competitor benchmarking, and strategic recommendations tailored to your brand.
        </p>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <BenefitCard 
            icon={<BarChart3 className="h-5 w-5" />}
            title="Historical Analysis"
            description="Track your brand's sustainability journey over 14+ years"
          />
          <BenefitCard 
            icon={<Users className="h-5 w-5" />}
            title="Competitor Benchmarking"
            description="See how you compare against industry peers"
          />
          <BenefitCard 
            icon={<FileText className="h-5 w-5" />}
            title="Strategic Reports"
            description="Get actionable insights and recommendations"
          />
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button asChild size="lg" className="gap-2">
            <a href="https://sb-index.com/contact" target="_blank" rel="noopener noreferrer">
              Request a Consultation
              <ArrowRight className="h-4 w-4" />
            </a>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link to="/">
              Explore the Dashboard
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

function BenefitCard({ 
  icon, 
  title, 
  description 
}: { 
  icon: ReactNode; 
  title: string; 
  description: string;
}) {
  return (
    <div className="text-left p-4 bg-background/50 rounded-xl">
      <div className="text-primary mb-2">{icon}</div>
      <h3 className="font-medium text-foreground mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
