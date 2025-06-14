
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ChevronLeft, MapPin, Edit, Sparkles } from 'lucide-react';

const SETTINGS_BY_GENRE = {
  fantasy: [
    { id: 'middle_earth', name: 'Terra di Mezzo', description: 'Terre mistiche con foreste antiche e montagne maestose' },
    { id: 'magical_kingdom', name: 'Regno Magico', description: 'Castello incantato circondato da creature magiche' },
    { id: 'dark_forest', name: 'Foresta Oscura', description: 'Bosco tenebroso pieno di misteri e pericoli' },
    { id: 'floating_islands', name: 'Isole Fluttuanti', description: 'Terre sospese nel cielo tra le nuvole' }
  ],
  scifi: [
    { id: 'space_station', name: 'Stazione Spaziale', description: 'Avamposto tecnologico nello spazio profondo' },
    { id: 'alien_planet', name: 'Pianeta Alieno', description: 'Mondo extraterrestre con ecosistemi unici' },
    { id: 'cyberpunk_city', name: 'Città Cyberpunk', description: 'Metropoli futuristica con neon e grattacieli' },
    { id: 'generation_ship', name: 'Nave Generazionale', description: 'Gigantesca astronave che viaggia tra le stelle' }
  ]
};

interface SettingSelectionProps {
  wizardData: any;
  selectedSetting: any;
  onSettingSelect: (setting: any) => void;
  onNext: () => void;
  onPrev: () => void;
}

const SettingSelection: React.FC<SettingSelectionProps> = ({
  wizardData,
  selectedSetting,
  onSettingSelect,
  onNext,
  onPrev
}) => {
  const [customSetting, setCustomSetting] = useState('');
  const [showCustom, setShowCustom] = useState(false);

  const settings = SETTINGS_BY_GENRE[wizardData.genre?.id as keyof typeof SETTINGS_BY_GENRE] || [];

  const handleCustomSubmit = () => {
    if (customSetting) {
      onSettingSelect({
        id: 'custom',
        name: customSetting,
        description: 'Ambientazione personalizzata',
        custom: true
      });
    }
  };

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
          <span className="text-sm font-medium">Passo 4 di 7</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-bold text-gradient animate-float">
          Scegli l'Ambientazione
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Dove si svolgerà la tua storia con {wizardData.protagonist?.name} e {wizardData.antagonist?.name}?
        </p>
        <div className="flex items-center justify-center gap-2 flex-wrap">
          <Badge variant="secondary">{wizardData.genre?.icon} {wizardData.genre?.name}</Badge>
          <Badge variant="outline">{wizardData.author?.icon} {wizardData.author?.name}</Badge>
        </div>
      </div>

      <div className="flex justify-center gap-4 mb-6">
        <Button 
          variant={!showCustom ? "default" : "outline"}
          onClick={() => setShowCustom(false)}
        >
          Ambientazioni Predefinite
        </Button>
        <Button 
          variant={showCustom ? "default" : "outline"}
          onClick={() => setShowCustom(true)}
        >
          <Edit className="w-4 h-4 mr-2" />
          Personalizza
        </Button>
      </div>

      {!showCustom ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {settings.map((setting) => (
            <Card
              key={setting.id}
              className={`cursor-pointer transition-all duration-200 hover:scale-105 ${
                selectedSetting?.id === setting.id
                  ? 'ring-2 ring-purple-500 bg-gradient-to-br from-purple-500/20 to-orange-500/20'
                  : 'hover:bg-muted/50'
              }`}
              onClick={() => onSettingSelect(setting)}
            >
              <CardHeader className="text-center pb-2">
                <div className="text-4xl mb-2">
                  <MapPin className="w-12 h-12 mx-auto text-purple-400" />
                </div>
                <CardTitle className="text-lg">{setting.name}</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-sm text-muted-foreground">
                  {setting.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="max-w-2xl mx-auto space-y-6">
          <Card className="gradient-dark border-border/50">
            <CardHeader>
              <CardTitle>Crea la Tua Ambientazione</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="setting">Nome dell'Ambientazione</Label>
                <Input
                  id="setting"
                  value={customSetting}
                  onChange={(e) => setCustomSetting(e.target.value)}
                  placeholder="Es. Città Sottomarina, Deserto di Cristallo..."
                  className="bg-input/50"
                />
              </div>

              <Button 
                onClick={handleCustomSubmit}
                disabled={!customSetting}
                className="w-full"
              >
                Conferma Ambientazione
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {(selectedSetting || customSetting) && (
        <div className="text-center">
          <Card className="max-w-md mx-auto gradient-dark border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <MapPin className="w-8 h-8 text-purple-400" />
                <div>
                  <h3 className="font-semibold">{selectedSetting?.name || customSetting}</h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedSetting?.description || 'Ambientazione personalizzata'}
                  </p>
                </div>
              </div>
              <Button 
                onClick={onNext}
                className="w-full gradient-primary hover:opacity-90 transition-opacity"
                size="lg"
              >
                Continua con la Trama
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default SettingSelection;
