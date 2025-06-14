
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { ChevronLeft, Key, Zap, Eye, Sparkles, Loader2 } from 'lucide-react';

interface StoryGenerationProps {
  wizardData: any;
  onApiKeySet: (apiKey: string) => void;
  onGenerate: () => void;
  onStoryGenerated: (story: any) => void;
  onPrev: () => void;
}

const StoryGeneration: React.FC<StoryGenerationProps> = ({
  wizardData,
  onApiKeySet,
  onGenerate,
  onStoryGenerated,
  onPrev
}) => {
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const generateStoryContent = async (apiKey: string) => {
    try {
      // Costruisci il prompt basato sui dati del wizard
      const prompt = `
Scrivi una storia completa e coinvolgente in italiano con le seguenti caratteristiche:

GENERE: ${wizardData.genre?.name} - ${wizardData.genre?.description}
STILE AUTORE: ${wizardData.author?.name} - ${wizardData.author?.description}
PROTAGONISTA: ${wizardData.protagonist?.name} - ${wizardData.protagonist?.description}
ANTAGONISTA: ${wizardData.antagonist?.name} - ${wizardData.antagonist?.description}
AMBIENTAZIONE: ${wizardData.setting?.name} - ${wizardData.setting?.description}
TRAMA: ${wizardData.plot?.name} - ${wizardData.plot?.description}
STILE VISIVO: ${wizardData.style?.name}

Crea una storia suddivisa in 4-5 scene, ognuna di almeno 400-500 parole.
Per ogni scena, includi:
1. Un titolo accattivante
2. Una descrizione dettagliata e coinvolgente
3. Un prompt per generare un'immagine della scena (in inglese, stile cinematografico)

Formato richiesto:
TITOLO STORIA: [titolo accattivante]

SCENA 1: [titolo scena]
[contenuto della scena]
IMMAGINE: [prompt per immagine in inglese]

SCENA 2: [titolo scena]
[contenuto della scena]
IMMAGINE: [prompt per immagine in inglese]

[continua per tutte le scene]

La storia deve essere completa, con un inizio coinvolgente, sviluppo della trama e una conclusione soddisfacente.
`;

      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin,
          'X-Title': 'StoryMaster AI'
        },
        body: JSON.stringify({
          model: 'meta-llama/llama-3.2-3b-instruct:free',
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
          max_tokens: 4000,
          top_p: 0.9,
          frequency_penalty: 0.1,
          presence_penalty: 0.1
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const storyContent = data.choices[0]?.message?.content || '';

      if (!storyContent) {
        throw new Error('Contenuto della storia vuoto');
      }

      // Parsa il contenuto della storia
      const story = parseStoryContent(storyContent);
      return story;

    } catch (error) {
      console.error('Errore nella generazione della storia:', error);
      throw error;
    }
  };

  const parseStoryContent = (content: string) => {
    const lines = content.split('\n');
    let title = 'La Tua Storia Epica';
    const scenes = [];
    let currentScene = null;
    let wordCount = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      if (line.startsWith('TITOLO STORIA:')) {
        title = line.replace('TITOLO STORIA:', '').trim();
      } else if (line.startsWith('SCENA ')) {
        if (currentScene) {
          scenes.push(currentScene);
        }
        currentScene = {
          id: `scene-${scenes.length + 1}`,
          title: line,
          content: '',
          imagePrompt: ''
        };
      } else if (line.startsWith('IMMAGINE:')) {
        if (currentScene) {
          currentScene.imagePrompt = line.replace('IMMAGINE:', '').trim();
        }
      } else if (line && currentScene && !line.startsWith('SCENA ')) {
        if (!line.startsWith('IMMAGINE:')) {
          currentScene.content += line + '\n';
        }
      }
    }

    if (currentScene) {
      scenes.push(currentScene);
    }

    // Calcola le parole totali
    scenes.forEach(scene => {
      wordCount += scene.content.split(' ').length;
    });

    const estimatedReadingTime = Math.ceil(wordCount / 200);

    return {
      id: Date.now().toString(),
      title,
      content: content,
      scenes,
      estimatedReadingTime,
      wordCount
    };
  };

  const handleGenerate = async () => {
    if (!apiKey.trim()) {
      toast({
        title: "API Key Required",
        description: "Inserisci la tua API key di OpenRouter per continuare.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    onApiKeySet(apiKey);
    
    try {
      const story = await generateStoryContent(apiKey);
      
      toast({
        title: "Storia Generata!",
        description: "La tua storia epica è pronta!",
      });

      onStoryGenerated(story);
      
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

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="flex items-center gap-4 mb-6">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onPrev}
          className="hover:bg-muted/50"
          disabled={isGenerating}
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Indietro
        </Button>
      </div>

      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600/20 to-orange-600/20 rounded-full border border-purple-500/30">
          <Sparkles className="w-5 h-5 text-yellow-400" />
          <span className="text-sm font-medium">Passo 7 di 7</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-bold text-gradient animate-float">
          Genera la Tua Storia
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Inserisci la tua API Key di OpenRouter per generare una storia epica!
        </p>
      </div>

      {/* Story Summary */}
      <Card className="gradient-dark border-border/50">
        <CardHeader>
          <CardTitle className="text-center">Riepilogo della Tua Storia</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div>
                <span className="text-sm text-muted-foreground">Genere:</span>
                <p className="font-semibold">{wizardData.genre?.icon} {wizardData.genre?.name}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Autore/Stile:</span>
                <p className="font-semibold">{wizardData.author?.icon} {wizardData.author?.name}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Protagonista:</span>
                <p className="font-semibold">{wizardData.protagonist?.name}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Antagonista:</span>
                <p className="font-semibold">{wizardData.antagonist?.name}</p>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <span className="text-sm text-muted-foreground">Ambientazione:</span>
                <p className="font-semibold">{wizardData.setting?.name}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Trama:</span>
                <p className="font-semibold">{wizardData.plot?.name}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Stile Visivo:</span>
                <p className="font-semibold">{wizardData.style?.preview} {wizardData.style?.name}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* API Key Input */}
      <Card className="gradient-dark border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="w-5 h-5" />
            OpenRouter API Key
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="apikey">API Key</Label>
            <div className="flex gap-2">
              <Input
                id="apikey"
                type={showApiKey ? "text" : "password"}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-or-v1-..."
                className="bg-input/50"
                disabled={isGenerating}
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowApiKey(!showApiKey)}
                disabled={isGenerating}
              >
                <Eye className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          <div className="p-4 bg-muted/50 rounded-lg">
            <h4 className="font-semibold mb-2">Come ottenere la tua API Key:</h4>
            <ol className="text-sm text-muted-foreground space-y-1">
              <li>1. Vai su <a href="https://openrouter.ai" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:underline">openrouter.ai</a></li>
              <li>2. Crea un account o accedi</li>
              <li>3. Vai nelle impostazioni API</li>
              <li>4. Genera una nuova API Key</li>
              <li>5. Incolla la chiave qui sopra</li>
            </ol>
          </div>

          <Button 
            onClick={handleGenerate}
            disabled={!apiKey || isGenerating}
            className="w-full gradient-primary hover:opacity-90 transition-opacity"
            size="lg"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Generando Storia Epica...
              </>
            ) : (
              <>
                <Zap className="w-5 h-5 mr-2" />
                Genera Storia Epica (≈30 min di lettura)
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default StoryGeneration;
