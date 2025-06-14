
// Dati modulari per elementi narrativi professionali

export interface GenreData {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  tones: string[];
  themes: string[];
  writingStyle: string;
  targetLength: string;
}

export interface AuthorStyle {
  id: string;
  name: string;
  description: string;
  icon: string;
  period: string;
  techniques: string[];
  signature: string;
  genres: string[];
  toneAdjustments: Record<string, string>;
}

export interface CharacterArchetype {
  id: string;
  name: string;
  description: string;
  motivations: string[];
  flaws: string[];
  strengths: string[];
  archetypeFamily: string;
  compatibleGenres: string[];
}

export interface SettingTemplate {
  id: string;
  name: string;
  description: string;
  atmosphere: string[];
  conflicts: string[];
  opportunities: string[];
  visualElements: string[];
  compatibleGenres: string[];
}

export interface PlotStructure {
  id: string;
  name: string;
  description: string;
  acts: Array<{
    name: string;
    purpose: string;
    keyEvents: string[];
  }>;
  conflictTypes: string[];
  resolution: string;
  compatibleGenres: string[];
}

// GENERI PROFESSIONALI RAFFINATI
export const PROFESSIONAL_GENRES: GenreData[] = [
  {
    id: 'literary-fantasy',
    name: 'Fantasy Letterario',
    description: 'Fantasy sofisticato con profondità psicologica e temi universali',
    icon: '📚',
    color: 'from-purple-600 to-indigo-700',
    tones: ['contemplativo', 'epico', 'malinconia poetica', 'mistero arcano'],
    themes: ['crescita personale', 'potere e corruzione', 'sacrificio', 'eredità'],
    writingStyle: 'Prosa ricca, descrizioni evocative, dialoghi profondi',
    targetLength: '6000-8000 parole'
  },
  {
    id: 'noir-thriller',
    name: 'Noir Psicologico',
    description: 'Thriller introspettivo con atmosfere dark e personaggi complessi',
    icon: '🌙',
    color: 'from-gray-800 to-slate-900',
    tones: ['cupo', 'introspettivo', 'tensione crescente', 'rivelazione graduale'],
    themes: ['colpa e redenzione', 'verità nascosta', 'giustizia morale', 'identità'],
    writingStyle: 'Stile asciutto, tensione costante, flashback strategici',
    targetLength: '5000-7000 parole'
  },
  {
    id: 'magical-realism',
    name: 'Realismo Magico',
    description: 'Realtà quotidiana arricchita da elementi fantastici sottili',
    icon: '✨',
    color: 'from-emerald-600 to-teal-700',
    tones: ['onirico', 'nostalgico', 'surreale', 'emotivamente intenso'],
    themes: ['memoria e tempo', 'amore e perdita', 'tradizione vs modernità', 'destino'],
    writingStyle: 'Prosa poetica, simbolismo ricco, transizioni fluide',
    targetLength: '4000-6000 parole'
  },
  {
    id: 'historical-drama',
    name: 'Dramma Storico',
    description: 'Narrazioni ambientate nel passato con ricerca accurata',
    icon: '⚔️',
    color: 'from-amber-700 to-orange-800',
    tones: ['epico', 'intimista', 'drammatico', 'riflessivo'],
    themes: ['onore e dovere', 'cambiamento sociale', 'sopravvivenza', 'legacy'],
    writingStyle: 'Linguaggio d\'epoca, dettagli storici accurati, conflitti umani',
    targetLength: '6000-8000 parole'
  }
];

// STILI AUTORIALI SPECIFICI
export const AUTHOR_STYLES: AuthorStyle[] = [
  {
    id: 'borges-style',
    name: 'Jorge Luis Borges',
    description: 'Labirinti concettuali, paradossi temporali, erudizione sottile',
    icon: '🌀',
    period: 'XX secolo',
    techniques: ['meta-narrazione', 'riferimenti letterari', 'strutture circolari', 'paradossi logici'],
    signature: 'Racconti brevi densi di significato filosofico',
    genres: ['literary-fantasy', 'magical-realism'],
    toneAdjustments: {
      'contemplativo': 'Riflessione filosofica profonda',
      'misterioso': 'Enigmi intellettuali stratificati'
    }
  },
  {
    id: 'chandler-style',
    name: 'Raymond Chandler',
    description: 'Detective hard-boiled, dialoghi taglienti, atmosfere urbane',
    icon: '🕵️',
    period: 'Metà XX secolo',
    techniques: ['prima persona', 'descrizioni cinematografiche', 'dialoghi realistici', 'ritmo serrato'],
    signature: 'Investigatori cinici in città corrotte',
    genres: ['noir-thriller'],
    toneAdjustments: {
      'cupo': 'Cinismo urbano con umanità nascosta',
      'tensione': 'Suspense costruita attraverso l\'atmosfera'
    }
  },
  {
    id: 'marquez-style',
    name: 'Gabriel García Márquez',
    description: 'Realismo magico, saghe familiari, tempo ciclico',
    icon: '🦋',
    period: 'XX secolo',
    techniques: ['realismo magico', 'narrazione epica', 'simbolismo ricco', 'tempo non-lineare'],
    signature: 'Storie generazionali con elementi fantastici naturali',
    genres: ['magical-realism', 'literary-fantasy'],
    toneAdjustments: {
      'onirico': 'Fusione naturale tra reale e magico',
      'nostalgico': 'Malinconia per tempi perduti'
    }
  },
  {
    id: 'dumas-style',
    name: 'Alexandre Dumas',
    description: 'Avventure epiche, personaggi eroici, intrighi di corte',
    icon: '⚔️',
    period: 'XIX secolo',
    techniques: ['narrazione epica', 'dialoghi teatrali', 'azione dinamica', 'conflitti d\'onore'],
    signature: 'Eroi coraggiosi in ambientazioni storiche grandiose',
    genres: ['historical-drama'],
    toneAdjustments: {
      'epico': 'Grandiosità negli eventi e nei personaggi',
      'drammatico': 'Conflitti morali intensi'
    }
  }
];

// ARCHETIPI CARATTERIALI PROFESSIONALI
export const CHARACTER_ARCHETYPES: CharacterArchetype[] = [
  {
    id: 'reluctant-sage',
    name: 'Il Saggio Riluttante',
    description: 'Detentore di conoscenza che rifiuta il ruolo di mentore',
    motivations: ['proteggere la conoscenza', 'evitare responsabilità', 'redenzione personale'],
    flaws: ['isolamento', 'arroganza intellettuale', 'paura del fallimento'],
    strengths: ['saggezza profonda', 'intuizione', 'esperienza'],
    archetypeFamily: 'mentor',
    compatibleGenres: ['literary-fantasy', 'magical-realism']
  },
  {
    id: 'broken-detective',
    name: 'Il Detective Infranto',
    description: 'Investigatore segnato dal passato che cerca verità e redenzione',
    motivations: ['giustizia personale', 'redenzione', 'proteggere gli innocenti'],
    flaws: ['alcoolismo/dipendenze', 'cinismo', 'isolamento emotivo'],
    strengths: ['intuizione', 'determinazione', 'empatia nascosta'],
    archetypeFamily: 'hero',
    compatibleGenres: ['noir-thriller']
  },
  {
    id: 'memory-keeper',
    name: 'Il Custode della Memoria',
    description: 'Personaggio che preserva storie e tradizioni in via di estinzione',
    motivations: ['preservare il passato', 'tramandare saggezza', 'connettere generazioni'],
    flaws: ['nostalgia paralizzante', 'resistenza al cambiamento', 'solitudine'],
    strengths: ['conoscenza storica', 'narrazione', 'connessione emotiva'],
    archetypeFamily: 'guardian',
    compatibleGenres: ['magical-realism', 'historical-drama']
  }
];

// AMBIENTAZIONI SPECIFICHE
export const SETTING_TEMPLATES: SettingTemplate[] = [
  {
    id: 'forgotten-library',
    name: 'Biblioteca Dimenticata',
    description: 'Antica biblioteca che custodisce segreti perduti nel tempo',
    atmosphere: ['misteriosa', 'polverosa', 'carica di magia latente', 'silenziosa'],
    conflicts: ['conoscenza proibita', 'guardiani antichi', 'tempo che scorre'],
    opportunities: ['scoperte rivoluzionarie', 'alleanze inaspettate', 'poteri nascosti'],
    visualElements: ['scaffali infiniti', 'luce filtrata', 'manoscritti antichi', 'echi del passato'],
    compatibleGenres: ['literary-fantasy', 'magical-realism']
  },
  {
    id: 'rain-soaked-city',
    name: 'Città sotto la Pioggia',
    description: 'Metropoli notturna dove ogni ombra nasconde segreti',
    atmosphere: ['noir', 'umida', 'elettrica', 'claustrofobica'],
    conflicts: ['corruzione sistemica', 'criminalità organizzata', 'isolamento urbano'],
    opportunities: ['alleanze inaspettate', 'verità nascoste', 'redenzione'],
    visualElements: ['luci al neon riflesse', 'vicoli bagnati', 'fumo di sigarette', 'finestre illuminate'],
    compatibleGenres: ['noir-thriller']
  },
  {
    id: 'ancestral-village',
    name: 'Villaggio Ancestrale',
    description: 'Comunità rurale dove passato e presente si intrecciano naturalmente',
    atmosphere: ['nostalgica', 'timeless', 'spirituale', 'organica'],
    conflicts: ['tradizioni vs modernità', 'segreti familiari', 'cambiamenti inevitabili'],
    opportunities: ['guarigione spirituale', 'connessioni profonde', 'saggezza antica'],
    visualElements: ['case di pietra', 'giardini rigogliosi', 'sentieri antichi', 'alberi secolari'],
    compatibleGenres: ['magical-realism', 'historical-drama']
  }
];

// STRUTTURE NARRATIVE PROFESSIONALI
export const PLOT_STRUCTURES: PlotStructure[] = [
  {
    id: 'revelation-spiral',
    name: 'Spirale di Rivelazioni',
    description: 'Verità che si svelano gradualmente cambiando la percezione della realtà',
    acts: [
      {
        name: 'Mistero Iniziale',
        purpose: 'Stabilire l\'enigma centrale e il protagonista',
        keyEvents: ['evento scatenante', 'prima scoperta', 'dubbio iniziale']
      },
      {
        name: 'Ricerca e Scoperte',
        purpose: 'Approfondire il mistero attraverso indizi',
        keyEvents: ['false piste', 'alleati e nemici', 'rivelazione parziale']
      },
      {
        name: 'Verità Finale',
        purpose: 'Svelare la verità completa e le sue conseguenze',
        keyEvents: ['rivelazione shock', 'confronto finale', 'nuova comprensione']
      }
    ],
    conflictTypes: ['verità vs illusione', 'passato vs presente', 'conoscenza vs ignoranza'],
    resolution: 'Comprensione profonda che cambia il protagonista',
    compatibleGenres: ['noir-thriller', 'literary-fantasy']
  },
  {
    id: 'cyclical-legacy',
    name: 'Eredità Ciclica',
    description: 'Storie che si ripetono attraverso generazioni con variazioni',
    acts: [
      {
        name: 'Eredità del Passato',
        purpose: 'Mostrare l\'influenza delle generazioni precedenti',
        keyEvents: ['scoperta dell\'eredità', 'peso della tradizione', 'resistenza iniziale']
      },
      {
        name: 'Rottura del Ciclo',
        purpose: 'Tentativo di cambiare il destino prestabilito',
        keyEvents: ['ribellione', 'conseguenze impreviste', 'sacrifici necessari']
      },
      {
        name: 'Nuova Tradizione',
        purpose: 'Creare un nuovo equilibrio tra passato e futuro',
        keyEvents: ['accettazione', 'trasformazione', 'trasmissione rinnovata']
      }
    ],
    conflictTypes: ['destino vs libero arbitrio', 'tradizione vs innovazione', 'individuo vs comunità'],
    resolution: 'Equilibrio tra preservazione e cambiamento',
    compatibleGenres: ['magical-realism', 'historical-drama']
  }
];
