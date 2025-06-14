
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Sparkles } from 'lucide-react';

const STORY_GENRES = [
  {
    id: 'fantasy',
    name: 'Fantasy Epico',
    description: 'Draghi, magia e mondi incantati',
    icon: '🐉',
    color: 'from-purple-600 to-blue-600'
  },
  {
    id: 'scifi',
    name: 'Fantascienza',
    description: 'Futuro, tecnologia e viaggi spaziali',
    icon: '🚀',
    color: 'from-blue-600 to-cyan-600'
  },
  {
    id: 'horror',
    name: 'Horror Psicologico',
    description: 'Suspense e terrore che ti tengono sveglio',
    icon: '👻',
    color: 'from-red-600 to-orange-600'
  },
  {
    id: 'comedy',
    name: 'Commedia Assurda',
    description: 'Situazioni esilaranti e personaggi bizzarri',
    icon: '😂',
    color: 'from-yellow-600 to-orange-600'
  },
  {
    id: 'mystery',
    name: 'Mistero',
    description: 'Enigmi da risolvere e colpi di scena',
    icon: '🔍',
    color: 'from-gray-600 to-slate-600'
  },
  {
    id: 'romance',
    name: 'Romance Drammatico',
    description: 'Storie d\'amore intense ed emozionanti',
    icon: '💖',
    color: 'from-pink-600 to-rose-600'
  },
  {
    id: 'adventure',
    name: 'Avventura',
    description: 'Esplorazioni e viaggi mozzafiato',
    icon: '🗺️',
    color: 'from-green-600 to-emerald-600'
  },
  {
    id: 'thriller',
    name: 'Thriller',
    description: 'Azione e adrenalina pura',
    icon: '⚡',
    color: 'from-orange-600 to-red-600'
  }
];

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
          <span className="text-sm font-medium">Passo 1 di 7</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-bold text-gradient animate-float">
          Scegli il Genere
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Seleziona il genere della tua storia. Ogni genere avrà autori e personaggi specifici.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {STORY_GENRES.map((genre) => (
          <Card
            key={genre.id}
            className={`cursor-pointer transition-all duration-200 hover:scale-105 ${
              selectedGenre?.id === genre.id
                ? 'ring-2 ring-purple-500 bg-gradient-to-br from-purple-500/20 to-orange-500/20'
                : 'hover:bg-muted/50'
            }`}
            onClick={() => onGenreSelect(genre)}
          >
            <CardHeader className="text-center pb-2">
              <div className="text-4xl mb-2">{genre.icon}</div>
              <CardTitle className="text-lg">{genre.name}</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-sm text-muted-foreground mb-3">
                {genre.description}
              </p>
              <div className={`h-2 rounded-full bg-gradient-to-r ${genre.color} opacity-60`}></div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedGenre && (
        <div className="text-center">
          <Card className="max-w-md mx-auto gradient-dark border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="text-3xl">{selectedGenre.icon}</div>
                <div>
                  <h3 className="font-semibold">{selectedGenre.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedGenre.description}</p>
                </div>
              </div>
              <Button 
                onClick={onNext}
                className="w-full gradient-primary hover:opacity-90 transition-opacity"
                size="lg"
              >
                <BookOpen className="w-5 h-5 mr-2" />
                Continua con gli Autori
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default GenreSelection;
