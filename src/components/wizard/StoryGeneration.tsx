
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ChevronLeft, Key, Zap, Eye, Sparkles } from 'lucide-react';

interface StoryGenerationProps {
  wizardData: any;
  onApiKeySet: (apiKey: string) => void;
  onGenerate: () => void;
  onPrev: () => void;
}

const StoryGeneration: React.FC<StoryGenerationProps> = ({
  wizardData,
  onApiKeySet,
  onGenerate,
  onPrev
}) => {
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);

  const handleGenerate = () => {
    if (apiKey) {
      onApiKeySet(apiKey);
      onGenerate();
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
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowApiKey(!showApiKey)}
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
            disabled={!apiKey}
            className="w-full gradient-primary hover:opacity-90 transition-opacity"
            size="lg"
          >
            <Zap className="w-5 h-5 mr-2" />
            Genera Storia Epica (≈30 min di lettura)
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default StoryGeneration;
