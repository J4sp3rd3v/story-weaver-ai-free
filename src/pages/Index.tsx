
import React, { useState } from 'react';
import StoryGenerator from '@/components/StoryGenerator';
import StoryReader from '@/components/StoryReader';

interface Story {
  id: string;
  title: string;
  genre: any;
  chapters: any[];
  totalWordCount: number;
  createdAt: string;
  prompt: string;
}

const Index = () => {
  const [currentStory, setCurrentStory] = useState<Story | null>(null);
  const [apiKey, setApiKey] = useState('');

  const handleStoryGenerated = (story: Story) => {
    setCurrentStory(story);
  };

  const handleBackToGenerator = () => {
    setCurrentStory(null);
  };

  const handleApiKeyChange = (key: string) => {
    setApiKey(key);
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
        {!currentStory ? (
          <StoryGenerator 
            onStoryGenerated={handleStoryGenerated}
          />
        ) : (
          <StoryReader 
            story={currentStory} 
            onBack={handleBackToGenerator}
            apiKey={apiKey}
          />
        )}
      </div>
    </div>
  );
};

export default Index;
