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

// I migliori modelli GRATUITI di OpenRouter per la generazione di storie
const BEST_FREE_MODELS = [
  'meta-llama/llama-3.2-3b-instruct:free',
  'microsoft/phi-3-mini-128k-instruct:free',
  'mistralai/mistral-7b-instruct:free',
  'huggingfaceh4/zephyr-7b-beta:free',
  'openchat/openchat-7b:free',
  'google/gemma-7b-it:free'
];

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
  const [generationProgress, setGenerationProgress] = useState('');
  const { toast } = useToast();

  const generateStoryWithMultipleModels = async (apiKey: string) => {
    try {
      setGenerationProgress('Generando la struttura della storia...');
      
      // Step 1: Generate story outline with the best free model
      const outline = await generateStoryOutline(apiKey);
      
      setGenerationProgress('Generando le scene dettagliate...');
      
      // Step 2: Generate detailed scenes using multiple free models
      const scenes = await generateDetailedScenes(apiKey, outline);
      
      setGenerationProgress('Finalizzando la storia...');
      
      // Step 3: Create final story object
      const story = createFinalStory(outline, scenes);
      
      return story;

    } catch (error) {
      console.error('Errore nella generazione multi-modello:', error);
      throw error;
    }
  };

  const generateStoryOutline = async (apiKey: string) => {
    const outlinePrompt = `
Crea una struttura dettagliata per una storia di almeno 6-8 scene in italiano:

GENERE: ${wizardData.genre?.name} - ${wizardData.genre?.description}
STILE AUTORE: ${wizardData.author?.name} - ${wizardData.author?.description}
PROTAGONISTA: ${wizardData.protagonist?.name} - ${wizardData.protagonist?.description}
ANTAGONISTA: ${wizardData.antagonist?.name} - ${wizardData.antagonist?.description}
AMBIENTAZIONE: ${wizardData.setting?.name} - ${wizardData.setting?.description}
TRAMA: ${wizardData.plot?.name} - ${wizardData.plot?.description}

Crea una struttura con:
- Titolo accattivante
- 6-8 scene interconnesse che formano una storia completa
- Ogni scena deve avere: titolo, breve riassunto (3-4 frasi), personaggi coinvolti
- La storia deve essere di almeno 4000-5000 parole totali per 30 minuti di lettura
- Assicurati che ci sia continuità narrativa tra le scene

Formato:
TITOLO: [titolo]

SCENA 1: [titolo scena]
RIASSUNTO: [cosa succede in 3-4 frasi]
PERSONAGGI: [chi è coinvolto]

SCENA 2: [titolo scena]
RIASSUNTO: [cosa succede in 3-4 frasi]
PERSONAGGI: [chi è coinvolto]

[continua per tutte le scene]
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
        model: BEST_FREE_MODELS[0], // Use best free model for outline
        messages: [
          {
            role: 'system',
            content: 'Sei un esperto creatore di trame e strutture narrative. Crei storie ben strutturate e coinvolgenti con archi narrativi completi.'
          },
          {
            role: 'user',
            content: outlinePrompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000,
        top_p: 0.9
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || '';
  };

  const generateDetailedScenes = async (apiKey: string, outline: string) => {
    const scenes = [];
    const sceneMatches = outline.match(/SCENA \d+:.*?(?=SCENA \d+:|$)/gs) || [];
    
    console.log(`Generando ${sceneMatches.length} scene dettagliate...`);

    for (let i = 0; i < sceneMatches.length; i++) {
      const sceneOutline = sceneMatches[i];
      const modelIndex = i % BEST_FREE_MODELS.length;
      const selectedModel = BEST_FREE_MODELS[modelIndex];
      
      setGenerationProgress(`Generando scena ${i + 1} di ${sceneMatches.length} con ${selectedModel.split('/')[0]}...`);
      
      try {
        const sceneContent = await generateSingleScene(apiKey, selectedModel, sceneOutline, outline, i + 1);
        scenes.push(sceneContent);
        
        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error(`Errore nella generazione della scena ${i + 1}:`, error);
        // Fallback to another free model
        try {
          const fallbackModel = BEST_FREE_MODELS[(i + 1) % BEST_FREE_MODELS.length];
          const fallbackContent = await generateSingleScene(apiKey, fallbackModel, sceneOutline, outline, i + 1);
          scenes.push(fallbackContent);
        } catch (fallbackError) {
          console.error(`Errore anche nel fallback per scena ${i + 1}:`, fallbackError);
        }
      }
    }

    return scenes;
  };

  const generateSingleScene = async (apiKey: string, model: string, sceneOutline: string, fullOutline: string, sceneNumber: number) => {
    const scenePrompt = `
Basandoti su questa struttura narrativa completa:
${fullOutline}

Scrivi in dettaglio questa specifica scena:
${sceneOutline}

Requisiti:
- Scrivi almeno 600-800 parole per questa scena
- Mantieni coerenza con l'intera storia
- Include dialoghi vivaci e descrizioni dettagliate
- Usa lo stile di ${wizardData.author?.name}
- Mantieni il tono del genere ${wizardData.genre?.name}
- Assicurati che la scena si colleghi bene alle altre
- Includi un prompt per immagine cinematografica in inglese alla fine

Formato:
TITOLO_SCENA: [titolo della scena]
CONTENUTO: [contenuto dettagliato di 600-800 parole]
IMMAGINE: [prompt cinematografico in inglese]
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
        model: model,
        messages: [
          {
            role: 'system',
            content: `Sei uno scrittore professionista nel genere ${wizardData.genre?.name}. Scrivi scene dettagliate e coinvolgenti nello stile di ${wizardData.author?.name}.`
          },
          {
            role: 'user',
            content: scenePrompt
          }
        ],
        temperature: 0.8,
        max_tokens: 1500,
        top_p: 0.9
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content || '';
    
    return parseSceneContent(content, sceneNumber);
  };

  const parseSceneContent = (content: string, sceneNumber: number) => {
    const lines = content.split('\n');
    let title = `Scena ${sceneNumber}`;
    let sceneContent = '';
    let imagePrompt = 'A dramatic cinematic scene, high quality, professional lighting';

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      if (line.startsWith('TITOLO_SCENA:')) {
        title = line.replace('TITOLO_SCENA:', '').trim();
      } else if (line.startsWith('CONTENUTO:')) {
        // Gather all content lines
        for (let j = i + 1; j < lines.length; j++) {
          if (lines[j].trim().startsWith('IMMAGINE:')) {
            break;
          }
          sceneContent += lines[j] + '\n';
        }
      } else if (line.startsWith('IMMAGINE:')) {
        imagePrompt = line.replace('IMMAGINE:', '').trim();
      }
    }

    // If parsing failed, use the whole content
    if (!sceneContent.trim()) {
      sceneContent = content;
    }

    return {
      id: `scene-${sceneNumber}`,
      title: title,
      content: sceneContent.trim(),
      imagePrompt: imagePrompt
    };
  };

  const createFinalStory = (outline: string, scenes: any[]) => {
    // Extract title from outline
    const titleMatch = outline.match(/TITOLO:\s*(.+)/);
    const title = titleMatch ? titleMatch[1].trim() : 'La Tua Storia Epica';

    // Calculate total word count
    let wordCount = 0;
    scenes.forEach(scene => {
      wordCount += scene.content.split(' ').filter((word: string) => word.length > 0).length;
    });

    const estimatedReadingTime = Math.max(1, Math.ceil(wordCount / 200));

    const story = {
      id: Date.now().toString(),
      title: title,
      content: scenes.map(scene => scene.content).join('\n\n'),
      scenes: scenes,
      estimatedReadingTime,
      wordCount
    };

    console.log('Storia finale creata:', story);
    return story;
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
    setGenerationProgress('Inizializzazione...');
    onApiKeySet(apiKey);
    
    try {
      const story = await generateStoryWithMultipleModels(apiKey);
      
      toast({
        title: "Storia Epica Generata!",
        description: `Storia completa di ${story.scenes.length} scene e ${story.wordCount} parole!`,
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
      setGenerationProgress('');
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
          Genera la Tua Storia Epica
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Utilizza i migliori modelli AI gratuiti per creare una storia di 6-8 scene interconnesse!
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
            <h4 className="font-semibold mb-2">Migliori Modelli Gratuiti Utilizzati:</h4>
            <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
              {BEST_FREE_MODELS.map((model, index) => (
                <div key={model} className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-gradient-to-r from-green-500 to-blue-500 rounded-full"></div>
                  {model.split('/')[0]} - {model.split('/')[1]?.split(':')[0]}
                </div>
              ))}
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

          {generationProgress && (
            <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">{generationProgress}</span>
              </div>
            </div>
          )}

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
                Genera Storia Epica (6-8 scene, 30+ min lettura)
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default StoryGeneration;
