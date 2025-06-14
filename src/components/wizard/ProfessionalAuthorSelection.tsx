
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, Sparkles, Feather, Clock, Lightbulb } from 'lucide-react';
import { AUTHOR_STYLES } from '@/data/storyElements';

interface ProfessionalAuthorSelectionProps {
  selectedGenre: any;
  selectedAuthor: any;
  onAuthorSelect: (author: any) => void;
  onNext: () => void;
  onPrev: () => void;
}

const ProfessionalAuthorSelection: React.FC<ProfessionalAuthorSelectionProps> = ({
  selectedGenre,
  selectedAuthor,
  onAuthorSelect,
  onNext,
  onPrev
}) => {
  // Filter authors compatible with selected genre
  const compatibleAuthors = AUTHOR_STYLES.filter(author => 
    author.genres.includes(selectedGenre?.id)
  );

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="flex items-center gap-4 mb-6">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onPrev}
          className="hover:bg-muted/50"
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Indietro
        </Button>
      </div>

      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600/20 to-orange-600/20 rounded-full border border-purple-500/30">
          <Sparkles className="w-5 h-5 text-yellow-400" />
          <span className="text-sm font-medium">Passo 2 di 7 - Stile Autoriale</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-bold text-gradient animate-float">
          Maestro dello Stile
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Scegli lo stile di un grande maestro della letteratura. Ogni autore porterà 
          le proprie tecniche narrative e la propria voce unica alla tua storia 
          <span className="text-purple-400 font-semibold"> {selectedGenre?.name}</span>.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {compatibleAuthors.map((author) => (
          <Card
            key={author.id}
            className={`cursor-pointer transition-all duration-300 hover:scale-[1.02] ${
              selectedAuthor?.id === author.id
                ? 'ring-2 ring-purple-500 bg-gradient-to-br from-purple-500/20 to-orange-500/20'
                : 'hover:bg-muted/30'
            }`}
            onClick={() => onAuthorSelect(author)}
          >
            <CardHeader>
              <div className="flex items-start gap-4">
                <div className="text-3xl">{author.icon}</div>
                <div className="flex-1">
                  <CardTitle className="text-xl mb-1">{author.name}</CardTitle>
                  <div className="flex items-center gap-2 mb-3">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{author.period}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {author.description}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Feather className="w-4 h-4 text-purple-400" />
                  <span className="text-sm font-medium">Firma Stilistica:</span>
                </div>
                <p className="text-sm text-muted-foreground italic">
                  "{author.signature}"
                </p>
              </div>
              
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb className="w-4 h-4 text-orange-400" />
                  <span className="text-sm font-medium">Tecniche Narrative:</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {author.techniques.slice(0, 3).map((technique) => (
                    <Badge key={technique} variant="secondary" className="text-xs">
                      {technique}
                    </Badge>
                  ))}
                  {author.techniques.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{author.techniques.length - 3}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Show tone adjustments for selected genre */}
              {selectedGenre && author.toneAdjustments && (
                <div className="p-3 bg-accent/10 rounded-lg border border-accent/20">
                  <p className="text-xs font-medium text-accent-foreground mb-1">
                    Adattamento per {selectedGenre.name}:
                  </p>
                  {Object.entries(author.toneAdjustments).map(([tone, description]) => (
                    selectedGenre.tones?.includes(tone) && (
                      <p key={tone} className="text-xs text-accent-foreground/80">
                        • {description}
                      </p>
                    )
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {compatibleAuthors.length === 0 && (
        <div className="text-center p-8">
          <p className="text-muted-foreground">
            Nessun autore compatibile trovato per il genere selezionato.
          </p>
        </div>
      )}

      {selectedAuthor && (
        <div className="text-center">
          <Card className="max-w-2xl mx-auto gradient-dark border-border/50">
            <CardContent className="p-6">
              <div className="flex items-start gap-4 mb-6">
                <div className="text-4xl">{selectedAuthor.icon}</div>
                <div className="text-left flex-1">
                  <h3 className="text-xl font-bold mb-2">{selectedAuthor.name}</h3>
                  <p className="text-muted-foreground mb-4">{selectedAuthor.description}</p>
                  
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-semibold text-sm mb-2">Tutte le Tecniche:</h4>
                      <div className="flex flex-wrap gap-1">
                        {selectedAuthor.techniques.map((technique: string) => (
                          <Badge key={technique} variant="secondary" className="text-xs">
                            {technique}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="text-sm">
                      <strong>Specializzazione:</strong>
                      <p className="text-muted-foreground italic mt-1">
                        "{selectedAuthor.signature}"
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <Button 
                onClick={onNext}
                className="w-full gradient-primary hover:opacity-90 transition-opacity"
                size="lg"
              >
                <Feather className="w-5 h-5 mr-2" />
                Continua con i Personaggi →
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ProfessionalAuthorSelection;
