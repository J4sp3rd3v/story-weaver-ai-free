import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ChevronLeft, BookOpen, Edit, Sparkles, Eye, Target, Users } from 'lucide-react';

// Trame organizzate per combinazioni di personaggi
const CHARACTER_BASED_PLOTS = {
  'detective-killer': [
    { id: 'serial_hunt', name: 'La Caccia al Serial Killer', description: 'Un detective esperto segue le tracce di un killer spietato in una partita a scacchi mortale attraverso la città' },
    { id: 'mind_games', name: 'Giochi Mentali', description: 'Il killer sfida direttamente il detective con indizi e messaggi, trasformando la caccia in un duello psicologico' },
    { id: 'cold_case', name: 'Il Caso Irrisolto', description: 'Un vecchio caso riaperto porta il detective faccia a faccia con un killer che credeva morto' },
    { id: 'copycat', name: 'Il Copycat', description: 'Un nuovo killer imita i metodi di un assassino già catturato, confondendo il detective che aveva risolto il caso originale' }
  ],
  'detective-victim': [
    { id: 'personal_vendetta', name: 'Vendetta Personale', description: 'Il detective deve proteggere qualcuno che conosce personalmente da un killer determinato' },
    { id: 'witness_protection', name: 'Testimone in Pericolo', description: 'L\'unico testimone di un crimine è in pericolo e il detective deve tenerlo in vita' },
    { id: 'family_threat', name: 'Minaccia alla Famiglia', description: 'La famiglia del detective diventa il bersaglio di un killer vendicativo' }
  ],
  'killer-victim': [
    { id: 'perfect_crime', name: 'Il Crimine Perfetto', description: 'Un killer meticoloso pianifica l\'omicidio perfetto, ma la vittima nasconde segreti inaspettati' },
    { id: 'survival_game', name: 'Gioco di Sopravvivenza', description: 'La vittima scopre di essere nel mirino e deve usare l\'intelligenza per sopravvivere' },
    { id: 'role_reversal', name: 'Inversione di Ruoli', description: 'La presunta vittima si rivela più pericolosa del killer stesso' }
  ]
};

// Trame generiche per genere (fallback)
const PLOTS_BY_GENRE = {
  fantasy: [
    { id: 'quest', name: 'La Grande Missione', description: 'Un viaggio epico per salvare il mondo da un male antico' },
    { id: 'prophecy', name: 'La Profezia Perduta', description: 'Il protagonista deve compiere una profezia dimenticata' },
    { id: 'rebellion', name: 'La Ribellione', description: 'Una lotta contro un tiranno che opprime il regno' },
    { id: 'artifact', name: 'L\'Artefatto Maledetto', description: 'La ricerca di un oggetto magico dai poteri terribili' }
  ],
  // ... keep existing code (other genre plots)
  scifi: [
    { id: 'invasion', name: 'L\'Invasione Aliena', description: 'La Terra sotto attacco da una forza extraterrestre' },
    { id: 'ai_uprising', name: 'La Rivolta delle IA', description: 'Le macchine si ribellano contro i loro creatori' },
    { id: 'time_paradox', name: 'Il Paradosso Temporale', description: 'Viaggi nel tempo che minacciano la realtà' },
    { id: 'exploration', name: 'L\'Esplorazione Galattica', description: 'La scoperta di nuovi mondi e civiltà' }
  ],
  horror: [
    { id: 'haunted_house', name: 'La Casa Infestata', description: 'Antichi spiriti tormentano una famiglia innocente' },
    { id: 'monster', name: 'Il Mostro', description: 'Una creatura terrificante minaccia la comunità' },
    { id: 'curse', name: 'La Maledizione', description: 'Un antico maleficio si risveglia per vendetta' },
    { id: 'possession', name: 'La Possessione', description: 'Forze demoniache prendono controllo di un innocente' }
  ],
  mystery: [
    { id: 'murder', name: 'L\'Omicidio Misterioso', description: 'Un detective deve risolvere un caso impossibile' },
    { id: 'disappearance', name: 'La Scomparsa', description: 'Una persona sparisce senza lasciare tracce' },
    { id: 'conspiracy', name: 'La Cospirazione', description: 'Segreti nascosti vengono alla luce' },
    { id: 'theft', name: 'Il Grande Furto', description: 'Un\'audace rapina che nasconde motivi più profondi' }
  ],
  romance: [
    { id: 'forbidden_love', name: 'Amore Proibito', description: 'Due anime che non dovrebbero amarsi' },
    { id: 'second_chance', name: 'Una Seconda Possibilità', description: 'Ex amanti si ritrovano dopo anni' },
    { id: 'enemies_to_lovers', name: 'Da Nemici ad Amanti', description: 'Rivali che scoprono di amarsi' },
    { id: 'arranged_marriage', name: 'Matrimonio Combinato', description: 'Un matrimonio d\'interesse che diventa vero amore' }
  ],
  adventure: [
    { id: 'treasure_hunt', name: 'Caccia al Tesoro', description: 'La ricerca di un tesoro leggendario' },
    { id: 'survival', name: 'Sopravvivenza', description: 'Lotta per sopravvivere in condizioni estreme' },
    { id: 'exploration', name: 'Esplorazione', description: 'Scoperta di terre inesplorate e pericolose' },
    { id: 'rescue_mission', name: 'Missione di Salvataggio', description: 'Una corsa contro il tempo per salvare qualcuno' }
  ]
};

interface PlotSelectionProps {
  wizardData: any;
  selectedPlot: any;
  onPlotSelect: (plot: any) => void;
  onNext: () => void;
  onPrev: () => void;
}

const PlotSelection: React.FC<PlotSelectionProps> = ({
  wizardData,
  selectedPlot,
  onPlotSelect,
  onNext,
  onPrev
}) => {
  const [customPlot, setCustomPlot] = useState('');
  const [showCustom, setShowCustom] = useState(false);
  const [editingPlot, setEditingPlot] = useState('');
  const [currentPlotDialog, setCurrentPlotDialog] = useState<any>(null);

  console.log('PlotSelection - wizardData:', wizardData);
  console.log('PlotSelection - selectedPlot:', selectedPlot);

  // Determina le trame basate sui personaggi
  const getRelevantPlots = () => {
    const protagonist = wizardData?.protagonist;
    const antagonist = wizardData?.antagonist;
    const genreId = wizardData?.genre?.id || 'fantasy';

    // Crea una chiave per la combinazione di personaggi
    let characterKey = '';
    if (protagonist && antagonist) {
      const protType = protagonist.id || protagonist.name?.toLowerCase();
      const antType = antagonist.id || antagonist.name?.toLowerCase();
      
      // Controlla combinazioni specifiche
      if ((protType?.includes('detective') || protType?.includes('investigator')) && 
          (antType?.includes('killer') || antType?.includes('assassin') || antType?.includes('murderer'))) {
        characterKey = 'detective-killer';
      } else if ((protType?.includes('detective') || protType?.includes('investigator')) && 
                 (antType?.includes('victim') || antType?.includes('innocent'))) {
        characterKey = 'detective-victim';
      } else if ((protType?.includes('killer') || protType?.includes('assassin')) && 
                 (antType?.includes('victim') || antType?.includes('innocent'))) {
        characterKey = 'killer-victim';
      }
    }

    // Restituisci trame specifiche per i personaggi se disponibili
    if (characterKey && CHARACTER_BASED_PLOTS[characterKey]) {
      return CHARACTER_BASED_PLOTS[characterKey];
    }

    // Fallback alle trame per genere
    return PLOTS_BY_GENRE[genreId as keyof typeof PLOTS_BY_GENRE] || PLOTS_BY_GENRE.fantasy;
  };

  const plots = getRelevantPlots();
  const isCharacterBased = wizardData?.protagonist && wizardData?.antagonist && 
    ((wizardData.protagonist.id?.includes('detective') && wizardData.antagonist.id?.includes('killer')) ||
     (wizardData.protagonist.id?.includes('detective') && wizardData.antagonist.id?.includes('victim')) ||
     (wizardData.protagonist.id?.includes('killer') && wizardData.antagonist.id?.includes('victim')));

  console.log('PlotSelection - plots:', plots);
  console.log('PlotSelection - isCharacterBased:', isCharacterBased);

  const handleCustomSubmit = () => {
    if (customPlot) {
      onPlotSelect({
        id: 'custom',
        name: 'Trama Personalizzata',
        description: customPlot,
        custom: true
      });
    }
  };

  const handleViewPlot = (plot: any) => {
    setCurrentPlotDialog(plot);
    setEditingPlot(plot.description);
  };

  const handleSavePlotEdit = () => {
    if (editingPlot && currentPlotDialog) {
      const updatedPlot = {
        ...currentPlotDialog,
        description: editingPlot,
        custom: true
      };
      onPlotSelect(updatedPlot);
      setCurrentPlotDialog(null);
    }
  };

  const handleCloseDialog = () => {
    setCurrentPlotDialog(null);
    setEditingPlot('');
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
          <span className="text-sm font-medium">Passo 5 di 7</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-bold text-gradient animate-float">
          Scegli la Trama
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          {isCharacterBased ? 
            `Trame specifiche per ${wizardData?.protagonist?.name} vs ${wizardData?.antagonist?.name}` :
            `Quale conflitto centrale guiderà la tua storia in ${wizardData?.setting?.name || 'questo mondo'}?`
          }
        </p>
        <div className="flex items-center justify-center gap-2 flex-wrap">
          {wizardData?.genre && (
            <Badge variant="secondary">{wizardData.genre.icon} {wizardData.genre.name}</Badge>
          )}
          {wizardData?.setting && (
            <Badge variant="outline">{wizardData.setting.name}</Badge>
          )}
          {isCharacterBased && (
            <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
              <Target className="w-3 h-3 mr-1" />
              Trame Personalizzate
            </Badge>
          )}
        </div>
      </div>

      {isCharacterBased && (
        <Card className="gradient-dark border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="w-4 h-4" />
              <span>
                Abbiamo selezionato trame specifiche basate sui tuoi personaggi: 
                <strong className="text-foreground mx-1">{wizardData.protagonist.name}</strong>
                e
                <strong className="text-foreground mx-1">{wizardData.antagonist.name}</strong>
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-center gap-4 mb-6">
        <Button 
          variant={!showCustom ? "default" : "outline"}
          onClick={() => setShowCustom(false)}
        >
          {isCharacterBased ? 'Trame Suggerite' : 'Trame Predefinite'}
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
          {plots.map((plot) => (
            <Card
              key={plot.id}
              className={`cursor-pointer transition-all duration-200 hover:scale-105 ${
                selectedPlot?.id === plot.id
                  ? 'ring-2 ring-purple-500 bg-gradient-to-br from-purple-500/20 to-orange-500/20'
                  : 'hover:bg-muted/50'
              }`}
              onClick={() => onPlotSelect(plot)}
            >
              <CardHeader className="text-center pb-2">
                <div className="text-4xl mb-2">
                  <BookOpen className="w-12 h-12 mx-auto text-orange-400" />
                </div>
                <CardTitle className="text-lg">{plot.name}</CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-3">
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {plot.description}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewPlot(plot);
                  }}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Visualizza e Modifica
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="max-w-2xl mx-auto space-y-6">
          <Card className="gradient-dark border-border/50">
            <CardHeader>
              <CardTitle>Crea la Tua Trama</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="plot">Descrivi la Trama</Label>
                <Textarea
                  id="plot"
                  value={customPlot}
                  onChange={(e) => setCustomPlot(e.target.value)}
                  placeholder="Descrivi il conflitto principale, gli obiettivi del protagonista e gli ostacoli che dovrà affrontare..."
                  className="bg-input/50 min-h-[120px]"
                />
              </div>

              <Button 
                onClick={handleCustomSubmit}
                disabled={!customPlot}
                className="w-full"
              >
                Conferma Trama
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Dialog per visualizzare e modificare la trama */}
      <Dialog open={!!currentPlotDialog} onOpenChange={(open) => !open && handleCloseDialog()}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              {currentPlotDialog?.name}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="plot-edit">Descrizione della Trama</Label>
              <Textarea
                id="plot-edit"
                value={editingPlot}
                onChange={(e) => setEditingPlot(e.target.value)}
                className="bg-input/50 min-h-[150px]"
                placeholder="Modifica la descrizione della trama..."
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={handleCloseDialog}
              >
                Annulla
              </Button>
              <Button
                onClick={handleSavePlotEdit}
                disabled={!editingPlot}
              >
                <Edit className="w-4 h-4 mr-2" />
                Salva Modifiche
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {(selectedPlot || customPlot) && (
        <div className="text-center">
          <Card className="max-w-md mx-auto gradient-dark border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <BookOpen className="w-8 h-8 text-orange-400" />
                <div>
                  <h3 className="font-semibold">{selectedPlot?.name || 'Trama Personalizzata'}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {selectedPlot?.description || customPlot}
                  </p>
                </div>
              </div>
              {selectedPlot && (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mb-3"
                  onClick={() => handleViewPlot(selectedPlot)}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Visualizza Trama Completa
                </Button>
              )}
              <Button 
                onClick={onNext}
                className="w-full gradient-primary hover:opacity-90 transition-opacity"
                size="lg"
              >
                Continua con lo Stile
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default PlotSelection;
