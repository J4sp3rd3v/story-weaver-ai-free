
import React, { useState } from 'react';
import GenreSelection from '@/components/wizard/GenreSelection';
import ProfessionalAuthorSelection from '@/components/wizard/ProfessionalAuthorSelection';
import CharacterSelection from '@/components/wizard/CharacterSelection';
import SettingSelection from '@/components/wizard/SettingSelection';
import PlotSelection from '@/components/wizard/PlotSelection';
import StyleSelection from '@/components/wizard/StyleSelection';
import StoryGeneration from '@/components/wizard/StoryGeneration';
import StoryDisplay from '@/components/wizard/StoryDisplay';

export interface WizardData {
  genre: any;
  author: any;
  protagonist: any;
  antagonist: any;
  setting: any;
  plot: any;
  style: any;
  apiKey: string;
}

export interface Story {
  id: string;
  title: string;
  content: string;
  scenes: Scene[];
  estimatedReadingTime: number;
  wordCount: number;
}

export interface Scene {
  id: string;
  title: string;
  content: string;
  imagePrompt: string;
}

const StoryWizard = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [wizardData, setWizardData] = useState<Partial<WizardData>>({});
  const [generatedStory, setGeneratedStory] = useState<Story | null>(null);

  const totalSteps = 7;

  const updateWizardData = (data: Partial<WizardData>) => {
    setWizardData(prev => ({ ...prev, ...data }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onStoryGenerated = (story: Story) => {
    console.log('Story generated:', story);
    // Validate story structure before setting it
    if (story && typeof story === 'object' && story.title && Array.isArray(story.scenes)) {
      setGeneratedStory(story);
      setCurrentStep(8);
    } else {
      console.error('Invalid story structure received:', story);
      // Handle invalid story structure
      setGeneratedStory(null);
    }
  };

  const resetWizard = () => {
    setCurrentStep(1);
    setWizardData({});
    setGeneratedStory(null);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <GenreSelection
            selectedGenre={wizardData.genre}
            onGenreSelect={(genre) => updateWizardData({ genre })}
            onNext={nextStep}
          />
        );
      case 2:
        return (
          <ProfessionalAuthorSelection
            selectedGenre={wizardData.genre}
            selectedAuthor={wizardData.author}
            onAuthorSelect={(author) => updateWizardData({ author })}
            onNext={nextStep}
            onPrev={prevStep}
          />
        );
      case 3:
        return (
          <CharacterSelection
            selectedGenre={wizardData.genre}
            selectedAuthor={wizardData.author}
            protagonist={wizardData.protagonist}
            antagonist={wizardData.antagonist}
            onCharactersSelect={(protagonist, antagonist) => 
              updateWizardData({ protagonist, antagonist })
            }
            onNext={nextStep}
            onPrev={prevStep}
          />
        );
      case 4:
        return (
          <SettingSelection
            wizardData={wizardData}
            selectedSetting={wizardData.setting}
            onSettingSelect={(setting) => updateWizardData({ setting })}
            onNext={nextStep}
            onPrev={prevStep}
          />
        );
      case 5:
        return (
          <PlotSelection
            wizardData={wizardData}
            selectedPlot={wizardData.plot}
            onPlotSelect={(plot) => updateWizardData({ plot })}
            onNext={nextStep}
            onPrev={prevStep}
          />
        );
      case 6:
        return (
          <StyleSelection
            selectedStyle={wizardData.style}
            onStyleSelect={(style) => updateWizardData({ style })}
            onNext={nextStep}
            onPrev={prevStep}
          />
        );
      case 7:
        return (
          <StoryGeneration
            wizardData={wizardData}
            onApiKeySet={(apiKey) => updateWizardData({ apiKey })}
            onGenerate={() => {}} // Non più necessario
            onStoryGenerated={onStoryGenerated}
            onPrev={prevStep}
          />
        );
      case 8:
        // Enhanced validation for story display
        if (!generatedStory) {
          console.error('No story generated');
          return (
            <div className="max-w-4xl mx-auto p-6 text-center">
              <h2 className="text-2xl font-bold mb-4">Nessuna storia generata</h2>
              <p className="text-muted-foreground mb-4">
                Non è stata generata alcuna storia. Torna indietro e riprova.
              </p>
              <button 
                onClick={resetWizard}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
              >
                Ricomincia
              </button>
            </div>
          );
        }

        if (!generatedStory.title || !Array.isArray(generatedStory.scenes) || generatedStory.scenes.length === 0) {
          console.error('Story data is incomplete:', {
            hasTitle: !!generatedStory.title,
            hasScenesArray: Array.isArray(generatedStory.scenes),
            scenesLength: generatedStory.scenes?.length || 0,
            fullStory: generatedStory
          });
          return (
            <div className="max-w-4xl mx-auto p-6 text-center">
              <h2 className="text-2xl font-bold mb-4">Errore nella generazione della storia</h2>
              <p className="text-muted-foreground mb-4">
                Si è verificato un problema durante la generazione della storia. I dati sono incompleti.
              </p>
              <button 
                onClick={resetWizard}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
              >
                Ricomincia
              </button>
            </div>
          );
        }
        
        return (
          <StoryDisplay
            story={generatedStory}
            onReset={resetWizard}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-yellow-500/5 rounded-full blur-3xl animate-float"></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {renderStep()}
      </div>
    </div>
  );
};

export default StoryWizard;
