
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, Palette, Sparkles } from 'lucide-react';

const VISUAL_STYLES = [
  {
    id: 'realistic',
    name: 'Realistico',
    description: 'Immagini fotorealistiche e dettagliate',
    prompt: 'photorealistic, detailed, high quality, 8k',
    preview: '📸'
  },
  {
    id: 'fantasy_art',
    name: 'Arte Fantasy',
    description: 'Stile artistico fantasy con colori vivaci',
    prompt: 'fantasy art, magical, vibrant colors, detailed illustration',
    preview: '🎨'
  },
  {
    id: 'anime',
    name: 'Anime',
    description: 'Stile manga e anime giapponese',
    prompt: 'anime style, manga, japanese animation, detailed',
    preview: '🗾'
  },
  {
    id: 'digital_art',
    name: 'Arte Digitale',
    description: 'Arte digitale moderna e stilizzata',
    prompt: 'digital art, concept art, detailed, artstation quality',
    preview: '💻'
  },
  {
    id: 'oil_painting',
    name: 'Dipinto a Olio',
    description: 'Stile classico pittura a olio',
    prompt: 'oil painting, classical art, detailed brushwork, masterpiece',
    preview: '🖌️'
  },
  {
    id: 'cinematic',
    name: 'Cinematografico',
    description: 'Stile cinematografico drammatico',
    prompt: 'cinematic lighting, dramatic, movie scene, professional photography',
    preview: '🎬'
  },
  {
    id: 'steampunk',
    name: 'Steampunk',
    description: 'Stile retro-futuristico steampunk',
    prompt: 'steampunk style, brass and copper, Victorian era, mechanical',
    preview: '⚙️'
  },
  {
    id: 'watercolor',
    name: 'Acquerello',
    description: 'Delicate sfumature ad acquerello',
    prompt: 'watercolor painting, soft colors, artistic, flowing',
    preview: '🎭'
  }
];

interface StyleSelectionProps {
  selectedStyle: any;
  onStyleSelect: (style: any) => void;
  onNext: () => void;
  onPrev: () => void;
}

const StyleSelection: React.FC<StyleSelectionProps> = ({
  selectedStyle,
  onStyleSelect,
  onNext,
  onPrev
}) => {
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
          <span className="text-sm font-medium">Passo 6 di 7</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-bold text-gradient animate-float">
          Scegli lo Stile Visivo
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Seleziona lo stile artistico per i prompt delle immagini della tua storia.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {VISUAL_STYLES.map((style) => (
          <Card
            key={style.id}
            className={`cursor-pointer transition-all duration-200 hover:scale-105 ${
              selectedStyle?.id === style.id
                ? 'ring-2 ring-purple-500 bg-gradient-to-br from-purple-500/20 to-orange-500/20'
                : 'hover:bg-muted/50'
            }`}
            onClick={() => onStyleSelect(style)}
          >
            <CardHeader className="text-center pb-2">
              <div className="text-4xl mb-2">{style.preview}</div>
              <CardTitle className="text-lg">{style.name}</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-sm text-muted-foreground mb-3">
                {style.description}
              </p>
              <Badge variant="outline" className="text-xs">
                {style.prompt.split(',')[0]}...
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedStyle && (
        <div className="text-center">
          <Card className="max-w-md mx-auto gradient-dark border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="text-3xl">{selectedStyle.preview}</div>
                <div>
                  <h3 className="font-semibold">{selectedStyle.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedStyle.description}</p>
                </div>
              </div>
              <div className="mb-4 p-3 bg-muted/50 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Esempio prompt:</p>
                <p className="text-sm font-mono">{selectedStyle.prompt}</p>
              </div>
              <Button 
                onClick={onNext}
                className="w-full gradient-primary hover:opacity-90 transition-opacity"
                size="lg"
              >
                <Palette className="w-5 h-5 mr-2" />
                Continua con la Generazione
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default StyleSelection;
