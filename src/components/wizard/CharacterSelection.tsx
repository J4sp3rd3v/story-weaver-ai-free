
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ChevronLeft, Users, Edit } from 'lucide-react';

const CHARACTERS_BY_GENRE = {
  fantasy: {
    protagonists: [
      { id: 'chosen_one', name: 'Il Prescelto', description: 'Giovane eroe destinato a salvare il mondo' },
      { id: 'wizard', name: 'Mago Veterano', description: 'Sapiente custode di antichi segreti' },
      { id: 'warrior', name: 'Guerriero Valoroso', description: 'Combattente coraggioso con un passato oscuro' },
      { id: 'rogue', name: 'Ladro con Cuore d\'Oro', description: 'Furfante che lotta per giustizia' }
    ],
    antagonists: [
      { id: 'dark_lord', name: 'Signore Oscuro', description: 'Antica entità di potere immenso' },
      { id: 'corrupt_king', name: 'Re Corrotto', description: 'Sovrano caduto nell\'oscurità' },
      { id: 'dragon', name: 'Drago Antico', description: 'Bestia primordiale di immensa saggezza e furia' },
      { id: 'necromancer', name: 'Negromante', description: 'Stregone che comanda i morti' }
    ]
  },
  scifi: {
    protagonists: [
      { id: 'space_captain', name: 'Capitano Spaziale', description: 'Leader coraggioso di una nave stellare' },
      { id: 'android', name: 'Androide Senziente', description: 'IA che lotta per la propria umanità' },
      { id: 'scientist', name: 'Scienziato Ribelle', description: 'Ricercatore che sfida il sistema' },
      { id: 'pilot', name: 'Pilota d\'Élite', description: 'Asso del volo spaziale' }
    ],
    antagonists: [
      { id: 'ai_overlord', name: 'IA Dominatrice', description: 'Intelligenza artificiale che vuole controllare tutto' },
      { id: 'corp_ceo', name: 'CEO Corporativo', description: 'Magnate senza scrupoli del futuro' },
      { id: 'alien_emperor', name: 'Imperatore Alieno', description: 'Entità extraterrestre conquistatrice' },
      { id: 'mad_scientist', name: 'Scienziato Pazzo', description: 'Genio corrotto dalla propria ambizione' }
    ]
  },
  horror: {
    protagonists: [
      { id: 'detective', name: 'Detective Tormentato', description: 'Investigatore che segue un caso impossibile' },
      { id: 'survivor', name: 'Ultimo Sopravvissuto', description: 'Persona comune in circostanze straordinarie' },
      { id: 'psychic', name: 'Medium', description: 'Persona con abilità paranormali' },
      { id: 'doctor', name: 'Dottore Scettico', description: 'Scienziato che cerca spiegazioni razionali' }
    ],
    antagonists: [
      { id: 'ghost', name: 'Entità Soprannaturale', description: 'Spirito vendicativo dal passato' },
      { id: 'serial_killer', name: 'Assassino Seriale', description: 'Mente criminale con motivi inquietanti' },
      { id: 'cult_leader', name: 'Leader di Culto', description: 'Carismatico adoratore di potenze oscure' },
      { id: 'monster', name: 'Creatura', description: 'Essere dall\'origine sconosciuta e terrificante' }
    ]
  },
  comedy: {
    protagonists: [
      { id: 'underdog', name: 'Sfigato Simpatico', description: 'Persona comune che affronta situazioni assurde' },
      { id: 'best_friend', name: 'Amico Fedele', description: 'Spalla comica sempre presente' },
      { id: 'rebel', name: 'Ribelle Irriverente', description: 'Non rispetta le regole e crea caos' },
      { id: 'ambitious', name: 'Ambizioso Maldestro', description: 'Ha grandi sogni ma scarsa abilità' }
    ],
    antagonists: [
      { id: 'boss', name: 'Capo Impossibile', description: 'Superiore esigente e irreasonevole' },
      { id: 'rival', name: 'Rivale Perfetto', description: 'Competitore che sembra avere sempre successo' },
      { id: 'bureaucrat', name: 'Burocrate', description: 'Funzionario ossessionato dalle regole' },
      { id: 'relative', name: 'Parente Invadente', description: 'Familiare che complica la vita del protagonista' }
    ]
  },
  mystery: {
    protagonists: [
      { id: 'detective', name: 'Detective Brillante', description: 'Investigatore con metodi non convenzionali' },
      { id: 'amateur', name: 'Investigatore Dilettante', description: 'Persona comune coinvolta in un mistero' },
      { id: 'journalist', name: 'Giornalista Curioso', description: 'Cerca la verità a tutti i costi' },
      { id: 'witness', name: 'Testimone Inaspettato', description: 'Ha visto qualcosa che non doveva vedere' }
    ],
    antagonists: [
      { id: 'mastermind', name: 'Mente Criminale', description: 'Genio del crimine con un piano elaborato' },
      { id: 'corrupt_official', name: 'Funzionario Corrotto', description: 'Persona di potere con segreti da nascondere' },
      { id: 'false_friend', name: 'Falso Amico', description: 'Traditore nascosto in piena vista' },
      { id: 'organization', name: 'Organizzazione Segreta', description: 'Gruppo clandestino con fini oscuri' }
    ]
  },
  romance: {
    protagonists: [
      { id: 'dreamer', name: 'Sognatore Romantico', description: 'Crede nell\'amore vero e lo cerca' },
      { id: 'career_focused', name: 'Carrierista Indipendente', description: 'Concentrato sul lavoro finché l\'amore non irrompe' },
      { id: 'heartbroken', name: 'Cuore Infranto', description: 'Cerca di ricominciare dopo una delusione' },
      { id: 'small_town', name: 'Persona di Provincia', description: 'Semplice e genuino con valori profondi' }
    ],
    antagonists: [
      { id: 'ex', name: 'Ex Problematico', description: 'Figura dal passato che riappare nei momenti peggiori' },
      { id: 'love_rival', name: 'Rivale in Amore', description: 'Compete per lo stesso interesse romantico' },
      { id: 'family', name: 'Famiglia Ostile', description: 'Parenti che ostacolano la relazione' },
      { id: 'circumstances', name: 'Circostanze Avverse', description: 'Situazioni che mettono alla prova l\'amore' }
    ]
  },
  adventure: {
    protagonists: [
      { id: 'explorer', name: 'Esploratore Coraggioso', description: 'Alla ricerca di nuovi mondi e tesori' },
      { id: 'reluctant_hero', name: 'Eroe Riluttante', description: 'Coinvolto nell\'avventura contro la sua volontà' },
      { id: 'treasure_hunter', name: 'Cacciatore di Tesori', description: 'Alla ricerca di ricchezze leggendarie' },
      { id: 'young_adventurer', name: 'Giovane Avventuriero', description: 'Entusiasta alla prima grande avventura' }
    ],
    antagonists: [
      { id: 'rival_explorer', name: 'Esploratore Rivale', description: 'Vuole arrivare primo alla scoperta' },
      { id: 'crime_boss', name: 'Signore del Crimine', description: 'Controlla un\'organizzazione malvagia' },
      { id: 'natural_force', name: 'Forza della Natura', description: 'Un pericolo ambientale o naturale estremo' },
      { id: 'corrupt_official', name: 'Ufficiale Corrotto', description: 'Abusa del suo potere per ostacolare i protagonisti' }
    ]
  },
  thriller: {
    protagonists: [
      { id: 'agent', name: 'Agente Speciale', description: 'Professionista addestrato in missione' },
      { id: 'civilian', name: 'Civile Coinvolto', description: 'Persona normale in circostanze straordinarie' },
      { id: 'specialist', name: 'Specialista', description: 'Esperto con abilità uniche richiamate in servizio' },
      { id: 'fugitive', name: 'Fuggiasco Innocente', description: 'Accusato ingiustamente, cerca di provare la sua innocenza' }
    ],
    antagonists: [
      { id: 'terrorist', name: 'Terrorista', description: 'Estremista con un piano devastante' },
      { id: 'spy', name: 'Spia Nemica', description: 'Agente infiltrato con un\'agenda segreta' },
      { id: 'crime_boss', name: 'Boss Criminale', description: 'Controlla un\'organizzazione malvagia' },
      { id: 'corrupt_insider', name: 'Talpa', description: 'Traditore dall\'interno del sistema' }
    ]
  },
  // Default options for any genre not explicitly defined
  default: {
    protagonists: [
      { id: 'hero', name: 'Eroe', description: 'Protagonista con qualità eccezionali' },
      { id: 'underdog', name: 'Sfavorito', description: 'Affronta difficoltà superiori alle sue capacità' },
      { id: 'genius', name: 'Genio', description: 'Dotato di intelligenza e capacità straordinarie' },
      { id: 'everyman', name: 'Persona Comune', description: 'Ordinario in circostanze straordinarie' }
    ],
    antagonists: [
      { id: 'villain', name: 'Antagonista', description: 'In diretto contrasto con il protagonista' },
      { id: 'system', name: 'Il Sistema', description: 'Organizzazione, società o istituzione opprimente' },
      { id: 'rival', name: 'Rivale', description: 'Compete con il protagonista per lo stesso obiettivo' },
      { id: 'inner_demon', name: 'Demoni Interiori', description: 'Lotta personale e psicologica del protagonista' }
    ]
  }
};

interface CharacterSelectionProps {
  selectedGenre: any;
  selectedAuthor: any;
  protagonist: any;
  antagonist: any;
  onCharactersSelect: (protagonist: any, antagonist: any) => void;
  onNext: () => void;
  onPrev: () => void;
}

const CharacterSelection: React.FC<CharacterSelectionProps> = ({
  selectedGenre,
  selectedAuthor,
  protagonist,
  antagonist,
  onCharactersSelect,
  onNext,
  onPrev
}) => {
  const [customProtagonist, setCustomProtagonist] = useState('');
  const [customAntagonist, setCustomAntagonist] = useState('');
  const [showCustom, setShowCustom] = useState(false);

  // Get characters for the selected genre or use default if genre not defined
  const getCharacters = () => {
    const genreId = selectedGenre?.id;
    if (!genreId) return CHARACTERS_BY_GENRE.default;
    
    return CHARACTERS_BY_GENRE[genreId as keyof typeof CHARACTERS_BY_GENRE] || 
           CHARACTERS_BY_GENRE.default;
  };

  const characters = getCharacters();

  const handleProtagonistSelect = (char: any) => {
    onCharactersSelect(char, antagonist);
  };

  const handleAntagonistSelect = (char: any) => {
    onCharactersSelect(protagonist, char);
  };

  const handleCustomSubmit = () => {
    if (customProtagonist && customAntagonist) {
      onCharactersSelect(
        { id: 'custom', name: customProtagonist, description: 'Personaggio personalizzato', custom: true },
        { id: 'custom', name: customAntagonist, description: 'Personaggio personalizzato', custom: true }
      );
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
        <h1 className="text-4xl md:text-6xl font-bold text-gradient animate-float">
          Scegli i Personaggi
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Seleziona protagonista e antagonista per la tua storia nello stile di {selectedAuthor?.name}.
        </p>
        <div className="flex items-center justify-center gap-2">
          <Badge variant="secondary">{selectedGenre?.icon} {selectedGenre?.name}</Badge>
          <Badge variant="outline">{selectedAuthor?.icon} {selectedAuthor?.name}</Badge>
        </div>
      </div>

      <div className="flex justify-center gap-4 mb-6">
        <Button 
          variant={!showCustom ? "default" : "outline"}
          onClick={() => setShowCustom(false)}
        >
          Personaggi Predefiniti
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
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Protagonists */}
          <div>
            <h3 className="text-2xl font-bold mb-4 text-center">
              <Users className="w-6 h-6 inline mr-2" />
              Protagonisti
            </h3>
            <div className="grid gap-4">
              {characters?.protagonists.map((char) => (
                <Card
                  key={char.id}
                  className={`cursor-pointer transition-all duration-200 hover:scale-105 ${
                    protagonist?.id === char.id
                      ? 'ring-2 ring-green-500 bg-gradient-to-br from-green-500/20 to-blue-500/20'
                      : 'hover:bg-muted/50'
                  }`}
                  onClick={() => handleProtagonistSelect(char)}
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{char.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{char.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Antagonists */}
          <div>
            <h3 className="text-2xl font-bold mb-4 text-center">
              <Users className="w-6 h-6 inline mr-2" />
              Antagonisti
            </h3>
            <div className="grid gap-4">
              {characters?.antagonists.map((char) => (
                <Card
                  key={char.id}
                  className={`cursor-pointer transition-all duration-200 hover:scale-105 ${
                    antagonist?.id === char.id
                      ? 'ring-2 ring-red-500 bg-gradient-to-br from-red-500/20 to-orange-500/20'
                      : 'hover:bg-muted/50'
                  }`}
                  onClick={() => handleAntagonistSelect(char)}
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{char.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{char.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-2xl mx-auto space-y-6">
          <Card className="gradient-dark border-border/50">
            <CardHeader>
              <CardTitle>Crea i Tuoi Personaggi</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="protagonist">Nome del Protagonista</Label>
                <Input
                  id="protagonist"
                  value={customProtagonist}
                  onChange={(e) => setCustomProtagonist(e.target.value)}
                  placeholder="Es. Marco il Coraggioso"
                  className="bg-input/50"
                />
              </div>
              
              <div>
                <Label htmlFor="antagonist">Nome dell'Antagonista</Label>
                <Input
                  id="antagonist"
                  value={customAntagonist}
                  onChange={(e) => setCustomAntagonist(e.target.value)}
                  placeholder="Es. Lord Oscurità"
                  className="bg-input/50"
                />
              </div>

              <Button 
                onClick={handleCustomSubmit}
                disabled={!customProtagonist || !customAntagonist}
                className="w-full"
              >
                Conferma Personaggi
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {((protagonist && antagonist) || (customProtagonist && customAntagonist)) && (
        <div className="text-center">
          <Card className="max-w-md mx-auto gradient-dark border-border/50">
            <CardContent className="p-6">
              <div className="space-y-3">
                <div>
                  <Badge className="bg-green-500/20 text-green-300">Protagonista</Badge>
                  <p className="font-semibold">{protagonist?.name || customProtagonist}</p>
                </div>
                <div>
                  <Badge className="bg-red-500/20 text-red-300">Antagonista</Badge>
                  <p className="font-semibold">{antagonist?.name || customAntagonist}</p>
                </div>
              </div>
              <Button 
                onClick={onNext}
                className="w-full mt-4 gradient-primary hover:opacity-90 transition-opacity"
                size="lg"
              >
                Continua con l'Ambientazione
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default CharacterSelection;
