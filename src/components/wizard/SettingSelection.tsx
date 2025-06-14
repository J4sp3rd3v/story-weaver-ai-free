
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
  ],
  horror: [
    { id: 'haunted_mansion', name: 'Villa Infestata', description: 'Antica dimora piena di spiriti inquieti' },
    { id: 'abandoned_hospital', name: 'Ospedale Abbandonato', description: 'Struttura medica dimenticata dal tempo' },
    { id: 'dark_cemetery', name: 'Cimitero Tenebroso', description: 'Camposanto avvolto da nebbie misteriose' },
    { id: 'cursed_town', name: 'Città Maledetta', description: 'Borgo isolato con un terribile segreto' }
  ],
  comedy: [
    { id: 'circus', name: 'Circo Itinerante', description: 'Tendone colorato pieno di personaggi eccentrici' },
    { id: 'office_building', name: 'Ufficio Aziendale', description: 'Grattacielo corporativo con impiegati assurdi' },
    { id: 'small_town', name: 'Paesino di Provincia', description: 'Borgo tranquillo con abitanti bizzarri' },
    { id: 'hotel', name: 'Hotel Strampalato', description: 'Albergo gestito da personaggi surreali' }
  ],
  mystery: [
    { id: 'old_library', name: 'Biblioteca Antica', description: 'Archivio pieno di segreti nascosti' },
    { id: 'manor_house', name: 'Villa Signorile', description: 'Dimora elegante con stanze segrete' },
    { id: 'foggy_port', name: 'Porto Nebbioso', description: 'Molo avvolto dalla nebbia del mistero' },
    { id: 'detective_office', name: 'Ufficio del Detective', description: 'Studio privato di un investigatore' }
  ],
  romance: [
    { id: 'paris_cafe', name: 'Caffè Parigino', description: 'Bistrot romantico sotto la Torre Eiffel' },
    { id: 'beach_resort', name: 'Resort Tropicale', description: 'Spiaggia paradisiaca con tramonti mozzafiato' },
    { id: 'countryside_villa', name: 'Villa in Campagna', description: 'Dimora rustica tra vigneti e colline' },
    { id: 'bookstore', name: 'Libreria Accogliente', description: 'Negozio di libri caldo e intimo' }
  ],
  adventure: [
    { id: 'jungle_temple', name: 'Tempio nella Giungla', description: 'Antica struttura nascosta tra la vegetazione' },
    { id: 'mountain_peak', name: 'Vetta Montagnosa', description: 'Cima innevata che sfida i coraggiosi' },
    { id: 'desert_oasis', name: 'Oasi nel Deserto', description: 'Rifugio verde nel cuore delle sabbie' },
    { id: 'pirate_ship', name: 'Nave Pirata', description: 'Vascello solcando mari tempestosi' }
  ],
  thriller: [
    { id: 'underground_bunker', name: 'Bunker Sotterraneo', description: 'Rifugio segreto sotto la superficie' },
    { id: 'speeding_train', name: 'Treno in Corsa', description: 'Convoglio ad alta velocità pieno di pericoli' },
    { id: 'skyscraper', name: 'Grattacielo', description: 'Torre di vetro e acciaio nelle altezze' },
    { id: 'secret_laboratory', name: 'Laboratorio Segreto', description: 'Struttura nascosta per esperimenti' }
  ]
};

// Fallback settings for any genre
const DEFAULT_SETTINGS = [
  { id: 'generic_city', name: 'Città Moderna', description: 'Ambiente urbano contemporaneo' },
  { id: 'countryside', name: 'Campagna', description: 'Paesaggio rurale e tranquillo' },
  { id: 'seaside', name: 'Costa Marina', description: 'Località sul mare con spiagge' },
  { id: 'mountains', name: 'Montagne', description: 'Paesaggio alpino e selvaggio' }
];

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

  // Get settings for the current genre, with fallback to default settings
  const genreKey = wizardData?.genre?.id as keyof typeof SETTINGS_BY_GENRE;
  const settings = SETTINGS_BY_GENRE[genreKey] || DEFAULT_SETTINGS;

  const handleCustomSubmit = () => {
    if (customSetting.trim()) {
      onSettingSelect({
        id: 'custom',
        name: customSetting.trim(),
        description: 'Ambientazione personalizzata',
        custom: true
      });
    }
  };

  const handleSettingClick = (setting: any) => {
    console.log('Setting selected:', setting);
    onSettingSelect(setting);
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
          Dove si svolgerà la tua storia con {wizardData?.protagonist?.name || 'il protagonista'} e {wizardData?.antagonist?.name || 'l\'antagonista'}?
        </p>
        <div className="flex items-center justify-center gap-2 flex-wrap">
          {wizardData?.genre && (
            <Badge variant="secondary">{wizardData.genre.icon} {wizardData.genre.name}</Badge>
          )}
          {wizardData?.author && (
            <Badge variant="outline">{wizardData.author.icon} {wizardData.author.name}</Badge>
          )}
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
              onClick={() => handleSettingClick(setting)}
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
                disabled={!customSetting.trim()}
                className="w-full"
              >
                Conferma Ambientazione
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {(selectedSetting || (showCustom && customSetting.trim())) && (
        <div className="text-center">
          <Card className="max-w-md mx-auto gradient-dark border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <MapPin className="w-8 h-8 text-purple-400" />
                <div>
                  <h3 className="font-semibold">
                    {selectedSetting?.name || customSetting}
                  </h3>
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
