
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles, BookOpen, Zap } from 'lucide-react';

const STORY_GENRES = [
  { id: 'fantasy', name: 'Fantasy Epico', description: 'Draghi, magia e mondi incantati' },
  { id: 'scifi', name: 'Fantascienza', description: 'Futuro, tecnologia e viaggi spaziali' },
  { id: 'horror', name: 'Horror Psicologico', description: 'Suspense e terrore che ti tengono sveglio' },
  { id: 'comedy', name: 'Commedia Assurda', description: 'Situazioni esilaranti e personaggi bizzarri' },
  { id: 'mystery', name: 'Mistero', description: 'Enigmi da risolvere e colpi di scena' },
  { id: 'romance', name: 'Romance Drammatico', description: 'Storie d\'amore intense ed emozionanti' },
  { id: 'adventure', name: 'Avventura', description: 'Esplorazioni e viaggi mozzafiato' },
  { id: 'thriller', name: 'Thriller', description: 'Azione e adrenalina pura' }
];

const FREE_MODELS = [
  'meta-llama/llama-3.2-3b-instruct:free',
  'microsoft/phi-3-mini-128k-instruct:free',
  'huggingfaceh4/zephyr-7b-beta:free',
  'openchat/openchat-7b:free'
];

interface StoryGeneratorProps {
  onStoryGenerated: (story: any) => void;
}

const StoryGenerator: React.FC<StoryGeneratorProps> = ({ onStoryGenerated }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [storyPrompt, setStoryPrompt] = useState('');
  const { toast } = useToast();

  const generateStory = async () => {
    if (!apiKey.trim()) {
      toast({
        title: "API Key Required",
        description: "Inserisci la tua API key di OpenRouter per continuare.",
        variant: "destructive"
      });
      return;
    }

    if (!selectedGenre) {
      toast({
        title: "Genere Richiesto",
        description: "Seleziona un genere per la tua storia.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      const selectedGenreData = STORY_GENRES.find(g => g.id === selectedGenre);
      const basePrompt = storyPrompt || `Crea una storia ${selectedGenreData?.name.toLowerCase()} assurda e coinvolgente`;
      
      // Genera il primo capitolo con il primo modello
      const firstChapter = await generateChapter(
        FREE_MODELS[0],
        `${basePrompt}. Scrivi il primo capitolo di una storia lunga e dettagliata nel genere ${selectedGenreData?.name}. Il capitolo deve essere di almeno 800 parole e lasciare il lettore con la voglia di continuare. Includi personaggi memorabili e una trama intrigante.`,
        apiKey
      );

      if (!firstChapter) {
        throw new Error('Errore nella generazione del primo capitolo');
      }

      const story = {
        id: Date.now().toString(),
        title: `Storia ${selectedGenreData?.name}`,
        genre: selectedGenreData,
        chapters: [
          {
            id: 1,
            title: "Capitolo 1: L'Inizio",
            content: firstChapter,
            wordCount: firstChapter.split(' ').length
          }
        ],
        totalWordCount: firstChapter.split(' ').length,
        createdAt: new Date().toISOString(),
        prompt: basePrompt
      };

      onStoryGenerated(story);
      
      toast({
        title: "Storia Generata!",
        description: "Il primo capitolo è pronto. Continua per sviluppare la storia!",
      });
      
    } catch (error) {
      console.error('Errore nella generazione:', error);
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante la generazione della storia. Controlla la tua API key.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const generateChapter = async (model: string, prompt: string, apiKey: string): Promise<string> => {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': window.location.origin,
        'X-Title': 'StoryMaster AI'
      },
      body: JSON.stringify({
        model: model,
        messages: [
          {
            role: 'system',
            content: 'Sei uno scrittore professionista specializzato nella creazione di storie coinvolgenti e dettagliate. Scrivi sempre in italiano con uno stile vivace e descrittivo.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.8,
        max_tokens: 2000,
        top_p: 0.9,
        frequency_penalty: 0.1,
        presence_penalty: 0.1
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || '';
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600/20 to-orange-600/20 rounded-full border border-purple-500/30">
          <Sparkles className="w-5 h-5 text-yellow-400" />
          <span className="text-sm font-medium">Alimentato da AI multipli</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-bold text-gradient animate-float">
          StoryMaster AI
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Genera storie assurde e coinvolgenti utilizzando i migliori modelli AI gratuiti. 
          Seleziona il genere e lascia che la magia abbia inizio.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="gradient-dark border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-purple-400" />
              Configurazione Storia
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="api-key">API Key OpenRouter</Label>
              <Input
                id="api-key"
                type="password"
                placeholder="sk-or-v1-..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="bg-input/50"
              />
              <p className="text-xs text-muted-foreground">
                La tua API key non viene salvata e rimane privata
              </p>
            </div>

            <div className="space-y-2">
              <Label>Genere della Storia</Label>
              <Select value={selectedGenre} onValueChange={setSelectedGenre}>
                <SelectTrigger className="bg-input/50">
                  <SelectValue placeholder="Scegli un genere..." />
                </SelectTrigger>
                <SelectContent>
                  {STORY_GENRES.map((genre) => (
                    <SelectItem key={genre.id} value={genre.id}>
                      <div>
                        <div className="font-medium">{genre.name}</div>
                        <div className="text-xs text-muted-foreground">{genre.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="prompt">Idea Iniziale (Opzionale)</Label>
              <Textarea
                id="prompt"
                placeholder="Descrivi la tua idea per la storia..."
                value={storyPrompt}
                onChange={(e) => setStoryPrompt(e.target.value)}
                className="bg-input/50 min-h-[100px]"
              />
            </div>

            <Button 
              onClick={generateStory} 
              disabled={isGenerating}
              className="w-full gradient-primary hover:opacity-90 transition-opacity"
              size="lg"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Generando Storia...
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5 mr-2" />
                  Genera Storia Assurda
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card className="gradient-dark border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-orange-400" />
              Modelli AI Utilizzati
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              La tua storia sarà creata utilizzando questi modelli AI gratuiti:
            </p>
            <div className="grid gap-3">
              {FREE_MODELS.map((model, index) => (
                <div key={model} className="flex items-center gap-3 p-3 bg-muted/20 rounded-lg">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <Badge variant="secondary" className="text-xs">
                      {model.split('/')[0]}
                    </Badge>
                    <p className="text-sm font-medium mt-1">
                      {model.split('/')[1]?.split(':')[0]}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 bg-accent/10 rounded-lg border border-accent/20">
              <p className="text-sm text-accent-foreground">
                💡 <strong>Tip:</strong> Ogni capitolo sarà generato da un modello diverso 
                per creare una narrazione più ricca e variata!
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StoryGenerator;
