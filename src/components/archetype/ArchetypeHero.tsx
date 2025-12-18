import { QUADRANT_CONFIG } from '@/types/brand';

export function ArchetypeHero() {
  const archetypes = Object.entries(QUADRANT_CONFIG);

  return (
    <section className="text-center py-12 px-4">
      <h1 className="text-4xl md:text-5xl font-light tracking-tight text-foreground mb-4">
        Discover Your Brand's Strategic Archetype
      </h1>
      <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
        Where does your brand stand in the sustainability landscape? Find out which of the four strategic archetypes best describes your brand's position.
      </p>
      
      <div className="flex flex-wrap justify-center gap-4 md:gap-8">
        {archetypes.map(([key, config]) => (
          <div 
            key={key}
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-border/50 bg-card/50"
          >
            <span className="text-xl">{config.emoji}</span>
            <span className="text-sm font-medium text-foreground">{config.name}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
