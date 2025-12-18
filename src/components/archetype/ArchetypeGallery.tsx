import { QUADRANT_CONFIG, QuadrantType } from '@/types/brand';

interface ArchetypeGalleryProps {
  exampleBrands?: Record<QuadrantType, string[]>;
}

export function ArchetypeGallery({ exampleBrands }: ArchetypeGalleryProps) {
  const archetypes: QuadrantType[] = ['fortress', 'challenger', 'sleeper', 'danger'];

  return (
    <section className="max-w-5xl mx-auto px-4 py-12">
      <h2 className="text-2xl font-light text-center text-foreground mb-8">
        The Four Strategic Archetypes
      </h2>
      
      <div className="grid md:grid-cols-2 gap-6">
        {archetypes.map(type => {
          const config = QUADRANT_CONFIG[type];
          const examples = exampleBrands?.[type] || [];
          
          return (
            <div 
              key={type}
              className="bg-card border border-border rounded-xl p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-4">
                <div 
                  className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl shrink-0"
                  style={{ backgroundColor: config.bgColor }}
                >
                  {config.emoji}
                </div>
                <div className="flex-1">
                  <h3 
                    className="text-lg font-semibold mb-1"
                    style={{ color: config.color }}
                  >
                    {config.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {config.description}
                  </p>
                  {examples.length > 0 && (
                    <div className="text-xs text-muted-foreground">
                      <span className="font-medium">Examples: </span>
                      {examples.slice(0, 3).join(', ')}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quadrant Framework Explanation */}
      <div className="mt-12 bg-muted/30 rounded-xl p-6 border border-border">
        <h3 className="text-lg font-medium text-foreground mb-4 text-center">
          How Archetypes Are Determined
        </h3>
        <div className="grid md:grid-cols-2 gap-6 text-sm text-muted-foreground">
          <div>
            <h4 className="font-medium text-foreground mb-2">Stability (X-Axis)</h4>
            <p>
              Measures how consistent a brand's sustainability perception has been over time. 
              High stability indicates reliable, predictable brand perception.
            </p>
          </div>
          <div>
            <h4 className="font-medium text-foreground mb-2">Inflation Performance (Y-Axis)</h4>
            <p>
              Tracks how well a brand maintained or improved its sustainability perception 
              during economic uncertainty. Positive values indicate resilient growth.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
