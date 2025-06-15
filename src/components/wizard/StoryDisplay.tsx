
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { BookOpen, Copy, Image, RotateCcw, Clock, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface StoryDisplayProps {
  story: {
    id: string;
    title: string;
    content: string;
    scenes: Array<{
      id: string;
      title: string;
      content: string;
      imagePrompt: string;
    }>;
    estimatedReadingTime: number;
    wordCount: number;
  };
  onReset: () => void;
}

const StoryDisplay: React.FC<StoryDisplayProps> = ({ story, onReset }) => {
  const [selectedScene, setSelectedScene] = useState(0);
  const { toast } = useToast();

  // Safety checks for story structure
  if (!story || typeof story !== 'object') {
    console.error('Invalid story object:', story);
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <h2 className="text-2xl font-bold mb-4">Errore: Storia non valida</h2>
        <p className="text-muted-foreground mb-4">
          I dati della storia non sono validi.
        </p>
        <Button onClick={onReset}>Ricomincia</Button>
      </div>
    );
  }

  if (!story.title) {
    console.error('Story missing title:', story);
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <h2 className="text-2xl font-bold mb-4">Errore: Titolo mancante</h2>
        <p className="text-muted-foreground mb-4">
          La storia non ha un titolo valido.
        </p>
        <Button onClick={onReset}>Ricomincia</Button>
      </div>
    );
  }

  if (!Array.isArray(story.scenes) || story.scenes.length === 0) {
    console.error('Story missing scenes:', story);
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <h2 className="text-2xl font-bold mb-4">Errore: Scene mancanti</h2>
        <p className="text-muted-foreground mb-4">
          La storia non contiene scene valide.
        </p>
        <Button onClick={onReset}>Ricomincia</Button>
      </div>
    );
  }

  // Ensure selectedScene is within bounds
  const safeSelectedScene = Math.max(0, Math.min(selectedScene, story.scenes.length - 1));
  const currentScene = story.scenes[safeSelectedScene];

  if (!currentScene) {
    console.error('Current scene is undefined:', { selectedScene: safeSelectedScene, scenesLength: story.scenes.length });
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <h2 className="text-2xl font-bold mb-4">Errore: Scena non trovata</h2>
        <p className="text-muted-foreground mb-4">
          La scena selezionata non è disponibile.
        </p>
        <Button onClick={onReset}>Ricomincia</Button>
      </div>
    );
  }

  const copyImagePrompt = (prompt: string) => {
    if (!prompt) {
      toast({
        title: "Prompt non disponibile",
        description: "Non c'è un prompt disponibile per questa scena.",
        variant: "destructive"
      });
      return;
    }
    
    navigator.clipboard.writeText(prompt);
    toast({
      title: "Prompt copiato!",
      description: "Il prompt per Fooocus è stato copiato negli appunti.",
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
          ✨ Storia Generata con Successo!
        </Badge>
        <h1 className="text-4xl md:text-5xl font-bold text-gradient">{story.title}</h1>
        <div className="flex items-center justify-center gap-4 text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{story.estimatedReadingTime || 0} min di lettura</span>
          </div>
          <div className="flex items-center gap-1">
            <FileText className="w-4 h-4" />
            <span>{(story.wordCount || 0).toLocaleString()} parole</span>
          </div>
          <div className="flex items-center gap-1">
            <BookOpen className="w-4 h-4" />
            <span>{story.scenes.length} scene</span>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Scene Navigation */}
        <div className="lg:col-span-1">
          <Card className="gradient-dark border-border/50 sticky top-6">
            <CardHeader>
              <CardTitle className="text-lg">Scene della Storia</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {story.scenes.map((scene, index) => (
                <Button
                  key={scene.id || `scene-${index}`}
                  variant={safeSelectedScene === index ? "default" : "ghost"}
                  className="w-full justify-start text-left h-auto p-3"
                  onClick={() => setSelectedScene(index)}
                >
                  <div>
                    <div className="font-semibold text-sm mb-1">
                      Scena {index + 1}
                    </div>
                    <div className="text-xs text-muted-foreground line-clamp-2">
                      {scene.title || `Scena ${index + 1}`}
                    </div>
                  </div>
                </Button>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Story Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Current Scene */}
          <Card className="gradient-dark border-border/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Scena {safeSelectedScene + 1}: {currentScene.title || `Scena ${safeSelectedScene + 1}`}
                </CardTitle>
                <Badge variant="outline">
                  {safeSelectedScene + 1} di {story.scenes.length}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="prose prose-invert max-w-none">
                <p className="text-base leading-relaxed whitespace-pre-wrap">
                  {currentScene.content || 'Contenuto non disponibile'}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Image Prompt */}
          <Card className="gradient-dark border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Image className="w-5 h-5" />
                Prompt per Fooocus
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-muted/50 p-4 rounded-lg mb-4">
                <p className="font-mono text-sm">{currentScene.imagePrompt || 'Prompt non disponibile'}</p>
              </div>
              <Button 
                onClick={() => copyImagePrompt(currentScene.imagePrompt)}
                className="w-full"
                variant="outline"
                disabled={!currentScene.imagePrompt}
              >
                <Copy className="w-4 h-4 mr-2" />
                Copia Prompt per Fooocus
              </Button>
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex justify-between">
            <Button
              onClick={() => setSelectedScene(Math.max(0, safeSelectedScene - 1))}
              disabled={safeSelectedScene === 0}
              variant="outline"
            >
              ← Scena Precedente
            </Button>
            <Button
              onClick={() => setSelectedScene(Math.min(story.scenes.length - 1, safeSelectedScene + 1))}
              disabled={safeSelectedScene === story.scenes.length - 1}
              variant="outline"
            >
              Scena Successiva →
            </Button>
          </div>
        </div>
      </div>

      <Separator />

      {/* Actions */}
      <div className="text-center space-y-4">
        <h3 className="text-xl font-semibold">Vuoi creare un'altra storia?</h3>
        <Button 
          onClick={onReset}
          className="gradient-primary hover:opacity-90 transition-opacity"
          size="lg"
        >
          <RotateCcw className="w-5 h-5 mr-2" />
          Crea Nuova Storia
        </Button>
      </div>
    </div>
  );
};

export default StoryDisplay;
