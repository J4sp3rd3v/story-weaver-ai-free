
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, User, Film, Sparkles } from 'lucide-react';

const AUTHORS_BY_GENRE = {
  fantasy: [
    {
      id: 'tolkien',
      name: 'J.R.R. Tolkien',
      type: 'writer',
      style: 'Epico e dettagliato',
      description: 'Creatore di mondi fantastici ricchi di mitologia',
      icon: '📚'
    },
    {
      id: 'george_miller',
      name: 'George Miller',
      type: 'director',
      style: 'Azione viscerale',
      description: 'Regista visionario di Mad Max e Happy Feet',
      icon: '🎬'
    },
    {
      id: 'sanderson',
      name: 'Brandon Sanderson',
      type: 'writer',
      style: 'Sistemi magici complessi',
      description: 'Maestro della fantasy moderna',
      icon: '📚'
    },
    {
      id: 'guillermo',
      name: 'Guillermo del Toro',
      type: 'director',
      style: 'Dark fantasy visivo',
      description: 'Creatore di creature e mondi oscuri',
      icon: '🎬'
    }
  ],
  scifi: [
    {
      id: 'asimov',
      name: 'Isaac Asimov',
      type: 'writer',
      style: 'Fantascienza hard',
      description: 'Padre della robotica letteraria',
      icon: '📚'
    },
    {
      id: 'cameron',
      name: 'James Cameron',
      type: 'director',
      style: 'Spettacolare e tecnologico',
      description: 'Visionario di Terminator e Avatar',
      icon: '🎬'
    },
    {
      id: 'dick',
      name: 'Philip K. Dick',
      type: 'writer',
      style: 'Distopico e filosofico',
      description: 'Esploratore della realtà alterata',
      icon: '📚'
    },
    {
      id: 'scott',
      name: 'Ridley Scott',
      type: 'director',
      style: 'Atmosferico e cupo',
      description: 'Creatore di Alien e Blade Runner',
      icon: '🎬'
    }
  ],
  horror: [
    {
      id: 'king',
      name: 'Stephen King',
      type: 'writer',
      style: 'Horror psicologico',
      description: 'Re dell\'horror moderno',
      icon: '📚'
    },
    {
      id: 'carpenter',
      name: 'John Carpenter',
      type: 'director',
      style: 'Horror atmosferico',
      description: 'Maestro del thriller horror',
      icon: '🎬'
    },
    {
      id: 'lovecraft',
      name: 'H.P. Lovecraft',
      type: 'writer',
      style: 'Horror cosmico',
      description: 'Creatore di terrori indicibili',
      icon: '📚'
    },
    {
      id: 'aster',
      name: 'Ari Aster',
      type: 'director',
      style: 'Horror visivo moderno',
      description: 'Regista di Hereditary e Midsommar',
      icon: '🎬'
    }
  ]
  // Add more genres...
};

interface AuthorSelectionProps {
  selectedGenre: any;
  selectedAuthor: any;
  onAuthorSelect: (author: any) => void;
  onNext: () => void;
  onPrev: () => void;
}

const AuthorSelection: React.FC<AuthorSelectionProps> = ({
  selectedGenre,
  selectedAuthor,
  onAuthorSelect,
  onNext,
  onPrev
}) => {
  const authors = AUTHORS_BY_GENRE[selectedGenre?.id as keyof typeof AUTHORS_BY_GENRE] || [];

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
          <span className="text-sm font-medium">Passo 2 di 7</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-bold text-gradient animate-float">
          Scegli l'Autore
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Seleziona lo stile narrativo per la tua storia {selectedGenre?.name.toLowerCase()}.
        </p>
        <Badge variant="secondary" className="bg-gradient-to-r from-purple-500/20 to-orange-500/20">
          {selectedGenre?.icon} {selectedGenre?.name}
        </Badge>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {authors.map((author) => (
          <Card
            key={author.id}
            className={`cursor-pointer transition-all duration-200 hover:scale-105 ${
              selectedAuthor?.id === author.id
                ? 'ring-2 ring-purple-500 bg-gradient-to-br from-purple-500/20 to-orange-500/20'
                : 'hover:bg-muted/50'
            }`}
            onClick={() => onAuthorSelect(author)}
          >
            <CardHeader className="text-center pb-2">
              <div className="text-4xl mb-2">{author.icon}</div>
              <CardTitle className="text-lg flex items-center justify-center gap-2">
                {author.type === 'writer' ? <User className="w-4 h-4" /> : <Film className="w-4 h-4" />}
                {author.name}
              </CardTitle>
              <Badge variant="outline" className="w-fit mx-auto">
                {author.type === 'writer' ? 'Scrittore' : 'Regista'}
              </Badge>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-sm font-medium mb-2 text-accent">
                {author.style}
              </p>
              <p className="text-sm text-muted-foreground">
                {author.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedAuthor && (
        <div className="text-center">
          <Card className="max-w-md mx-auto gradient-dark border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="text-3xl">{selectedAuthor.icon}</div>
                <div>
                  <h3 className="font-semibold flex items-center gap-2">
                    {selectedAuthor.type === 'writer' ? <User className="w-4 h-4" /> : <Film className="w-4 h-4" />}
                    {selectedAuthor.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">{selectedAuthor.description}</p>
                </div>
              </div>
              <Button 
                onClick={onNext}
                className="w-full gradient-primary hover:opacity-90 transition-opacity"
                size="lg"
              >
                <User className="w-5 h-5 mr-2" />
                Continua con i Personaggi
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AuthorSelection;
