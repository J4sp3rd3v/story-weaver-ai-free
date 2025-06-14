
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Sparkles, Palette, Target } from 'lucide-react';
import { PROFESSIONAL_GENRES } from '@/data/storyElements';

interface GenreSelectionProps {
  selectedGenre: any;
  onGenreSelect: (genre: any) => void;
  onNext: () => void;
}

const GenreSelection: React.FC<GenreSelectionProps> = ({
  selectedGenre,
  onGenreSelect,
  onNext
}) => {
  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600/20 to-orange-600/20 rounded-full border border-purple-500/30">
          <Sparkles className="w-5 h-5 text-yellow-400" />
          <span className="text-sm font-medium">Passo 1 di 7 - Scelte Professionali</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-bold text-gradient animate-float">
          Genere Narrativo
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Scegli un genere raffinato per la tua storia. Ogni genere è calibrato per offrire 
          narrazioni di qualità letteraria con stili e temi specifici.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {PROFESSIONAL_GENRES.map((genre) => (
          <Card
            key={genre.id}
            className={`cursor-pointer transition-all duration-300 hover:scale-[1.02] ${
              selectedGenre?.id === genre.id
                ? 'ring-2 ring-purple-500 bg-gradient-to-br from-purple-500/20 to-orange-500/20'
                : 'hover:bg-muted/30'
            }`}
            onClick={() => onGenreSelect(genre)}
          >
            <CardHeader>
              <div className="flex items-start gap-4">
                <div className="text-3xl">{genre.icon}</div>
                <div className="flex-1">
                  <CardTitle className="text-xl mb-2">{genre.name}</CardTitle>
                  <p className="text-sm text-muted-foreground mb-4">
                    {genre.description}
                  </p>
                  <div className={`h-2 rounded-full bg-gradient-to-r ${genre.color} opacity-70`}></div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Palette className="w-4 h-4 text-purple-400" />
                  <span className="text-sm font-medium">Toni Narrativi:</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {genre.tones.slice(0, 3).map((tone) => (
                    <Badge key={tone} variant="secondary" className="text-xs">
                      {tone}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-4 h-4 text-orange-400" />
                  <span className="text-sm font-medium">Stile:</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {genre.writingStyle}
                </p>
              </div>

              <div className="text-xs text-muted-foreground">
                <strong>Lunghezza target:</strong> {genre.targetLength}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedGenre && (
        <div className="text-center">
          <Card className="max-w-2xl mx-auto gradient-dark border-border/50">
            <CardContent className="p-6">
              <div className="flex items-start gap-4 mb-6">
                <div className="text-4xl">{selectedGenre.icon}</div>
                <div className="text-left flex-1">
                  <h3 className="text-xl font-bold mb-2">{selectedGenre.name}</h3>
                  <p className="text-muted-foreground mb-4">{selectedGenre.description}</p>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-sm mb-2">Temi Principali:</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {selectedGenre.themes.map((theme: string) => (
                          <li key={theme}>• {theme}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm mb-2">Caratteristiche:</h4>
                      <p className="text-sm text-muted-foreground">
                        {selectedGenre.writingStyle}
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
                <BookOpen className="w-5 h-5 mr-2" />
                Scegli lo Stile Autoriale →
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default GenreSelection;
