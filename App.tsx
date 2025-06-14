
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { JournalInput } from './components/JournalInput';
import { AnalysisDisplay } from './components/AnalysisDisplay';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorMessage } from './components/ErrorMessage';
import { ChatInterface } from './components/ChatInterface';
import { GlossaryModal } from './components/GlossaryModal';
import { DefinitionTooltip } from './components/DefinitionTooltip';
import { TimelineDisplay } from './components/TimelineDisplay'; // New Import
import { auditFieldStateWithGemini, rmChatService, getNextChoiceForksFromGemini } from './services/geminiService'; // Added getNextChoiceForksFromGemini
import { FieldAuditAnalysis, GeminiError, ChatMessage, TooltipData, ChoiceFork, TimelineEvent } from './types'; // Added TimelineEvent
import { glossaryData } from './glossaryData';
import { ChatContext, Content } from '@google/genai'; // Added for history type

const App: React.FC = () => {
  const [journalText, setJournalText] = useState<string>('');
  const [analysisResult, setAnalysisResult] = useState<FieldAuditAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<GeminiError | null>(null);

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [currentChatMessage, setCurrentChatMessage] = useState<string>('');
  const [isChatLoading, setIsChatLoading] = useState<boolean>(false);
  const [chatError, setChatError] = useState<GeminiError | null>(null);

  const [isGlossaryOpen, setIsGlossaryOpen] = useState<boolean>(false);
  const [tooltipData, setTooltipData] = useState<TooltipData | null>(null);
  const appRef = useRef<HTMLDivElement>(null);

  // State for Choice Timeline
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [currentAvailableForks, setCurrentAvailableForks] = useState<ChoiceFork[]>([]);

  const handleAnalyze = useCallback(async () => {
    if (!journalText.trim()) {
      setError({ message: 'Please enter some journal text to analyze.' });
      return;
    }
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);
    setChatMessages([]);
    setChatError(null);
    rmChatService.resetChat(); // This now also resets prompt manager history
    setTooltipData(null); 
    setTimeline([]); // Reset timeline on new analysis
    setCurrentAvailableForks([]); // Reset available forks

    try {
      const result = await auditFieldStateWithGemini(journalText);
      setAnalysisResult(result);
      setCurrentAvailableForks(result.choice_forks || []); // Set initial forks for the timeline
    } catch (err: any) {
      console.error("Analysis error:", err);
      if (err.message.includes("API_KEY")) {
         setError({ message: "API Key for Gemini is not configured or invalid. Please ensure process.env.API_KEY is set."});
      } else {
         setError({ message: err.message || 'An unexpected error occurred during analysis.' });
      }
    } finally {
      setIsLoading(false);
    }
  }, [journalText]);

  const handleSendChatMessage = useCallback(async () => {
    if (!currentChatMessage.trim()) return;
    setTooltipData(null); 

    const newUserMessage: ChatMessage = {
      id: Date.now().toString() + '-user',
      text: currentChatMessage,
      sender: 'user',
      timestamp: new Date(),
    };
    setChatMessages(prev => [...prev, newUserMessage]);
    setCurrentChatMessage('');
    setIsChatLoading(true);
    setChatError(null);

    // Prepare history for Gemini service
    const historyForGemini: ChatContext[] = chatMessages.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'model', // Gemini uses 'model' for AI
        parts: [{ text: msg.text }] as Content[],
    }));


    try {
      const initialContext = chatMessages.length === 0 ? analysisResult : null;
      // Pass existing history to the service
      const aiResponseText = await rmChatService.startOrSendMessage(newUserMessage.text, initialContext ?? undefined, historyForGemini);
      
      const newAiMessage: ChatMessage = {
        id: Date.now().toString() + '-ai',
        text: aiResponseText,
        sender: 'ai',
        timestamp: new Date(),
      };
      setChatMessages(prev => [...prev, newAiMessage]);
    } catch (err: any) {
      console.error("Chat error:", err);
       if (err.message.includes("API_KEY")) {
         setChatError({ message: "API Key for Gemini is not configured or invalid for chat."});
      } else {
        setChatError({ message: err.message || 'An error occurred in the chat.' });
      }
    } finally {
      setIsChatLoading(false);
    }
  }, [currentChatMessage, analysisResult, chatMessages]);

  const toggleGlossary = () => {
    setTooltipData(null); 
    setIsGlossaryOpen(!isGlossaryOpen);
  };

  const handleTextSelection = useCallback((selectedText: string, targetRect: DOMRect | null) => {
    if (!selectedText || !targetRect) {
      setTooltipData(prev => prev ? { ...prev, visible: false } : null);
      return;
    }

    const foundTerm = glossaryData.find(
      (item) => item.term.toLowerCase() === selectedText.toLowerCase()
    );

    if (foundTerm && appRef.current) {
      const appRect = appRef.current.getBoundingClientRect();
      let yPosition = targetRect.top - appRect.top + window.scrollY - 10; 
      let xPosition = targetRect.left - appRect.left + window.scrollX + (targetRect.width / 2);

      setTooltipData({
        term: foundTerm.term,
        definition: foundTerm.definition,
        x: xPosition,
        y: yPosition,
        visible: true,
      });
    } else {
      setTooltipData(prev => prev ? { ...prev, visible: false } : null);
    }
  }, []);

  const handleTimelineChoiceSelected = useCallback(async (selectedFork: ChoiceFork) => {
    setTooltipData(null);
    setIsLoading(true); 
    setError(null); 

    const newTimelineEvent: TimelineEvent = {
      id: Date.now().toString(),
      choice: selectedFork.choice,
      outcome: selectedFork.outcome,
    };
    const updatedTimeline = [...timeline, newTimelineEvent];
    setTimeline(updatedTimeline);
    setCurrentAvailableForks([]); 

    const aiReflectiveMessage: ChatMessage = {
      id: Date.now().toString() + '-ai-timeline-choice',
      text: `Timeline extended with choice: "${selectedFork.choice}" (Potential Unfolding: "${selectedFork.outcome}").\n\nReflect on this trajectory. What emerges?`,
      sender: 'ai',
      timestamp: new Date(),
    };
    
    // If chat hasn't started, and we have an analysis, this ensures the chat system prompt will be fresh if it needs to be.
    // However, the context for the AI message in chat will be based on the general RM chat logic.
    if (chatMessages.length === 0 && analysisResult) {
       // rmChatService.resetChat(); // Resetting chat might be too much if user was about to chat
                                 // The service itself handles prompt evolution.
    }
    setChatMessages(prev => [...prev, aiReflectiveMessage]);
    
    try {
      if (!analysisResult) { 
        throw new Error("Initial analysis result is missing for timeline progression.");
      }
      const analysisSummaryForForks = {
          field_signature: analysisResult.field_signature,
          collapse_type: analysisResult.collapse_type,
          archetypes_triggered: analysisResult.archetypes_triggered,
      };
      const nextForks = await getNextChoiceForksFromGemini(analysisSummaryForForks, updatedTimeline);
      setCurrentAvailableForks(nextForks);
    } catch (err: any) {
      console.error("Error fetching next choice forks:", err);
      setError({ message: `Failed to get next choices for the timeline: ${err.message}` });
      setCurrentAvailableForks([]); 
    } finally {
      setIsLoading(false);
    }
  }, [timeline, analysisResult, chatMessages, setChatMessages, setIsLoading, setError, setTooltipData]);


  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (tooltipData?.visible) {
        const selection = window.getSelection();
        const clickedElement = event.target as HTMLElement;
        
        if (!selection || selection.toString().trim().length === 0) {
            if (!clickedElement.closest('[role="tooltip"], button, a[href], .timeline-choice-button')) { 
                 setTooltipData(prev => prev ? { ...prev, visible: false } : null);
            }
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [tooltipData]);


  return (
    <div ref={appRef} className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 text-gray-100 flex flex-col items-center p-4 sm:p-8 selection:bg-purple-500 selection:text-white">
      <header className="w-full max-w-3xl text-center mb-8 mt-4">
        <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-between">
          <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 animate-pulse mb-2 sm:mb-0">
            Field Audit Analyzer
          </h1>
          <button
            onClick={toggleGlossary}
            className="px-4 py-2 text-sm bg-purple-600 hover:bg-purple-700 text-white rounded-md shadow-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-gray-900"
            aria-label="View Relational Math Glossary"
          >
            View RM Glossary
          </button>
        </div>
        <p className="text-gray-400 mt-3 text-lg">
          Gain insights into your energetic field dynamics through RM-inspired analysis.
        </p>
      </header>

      <main className="w-full max-w-3xl bg-gray-800 bg-opacity-70 backdrop-blur-md shadow-2xl rounded-xl p-6 sm:p-8 space-y-6">
        <JournalInput
          journalText={journalText}
          onJournalTextChange={(text) => { setJournalText(text); setTooltipData(null); }}
          onAnalyze={handleAnalyze}
          isLoading={isLoading}
        />

        {isLoading && !analysisResult && <LoadingSpinner />} 
        {error && !isLoading && <ErrorMessage title="Operation Failed" message={error.message} />}
        
        {analysisResult && !isLoading && !error && (
          <>
            <AnalysisDisplay
              analysis={analysisResult}
              onTermSelect={handleTextSelection}
            />
            <TimelineDisplay
                timeline={timeline}
                currentForks={currentAvailableForks}
                onSelectFork={handleTimelineChoiceSelected}
                isLoadingNextForks={isLoading && timeline.length > 0} 
                onTermSelect={handleTextSelection}
            />
            <ChatInterface
              messages={chatMessages}
              currentMessage={currentChatMessage}
              onCurrentMessageChange={(text) => { setCurrentChatMessage(text); setTooltipData(null); }}
              onSendMessage={handleSendChatMessage}
              isLoading={isChatLoading}
              error={chatError}
              analysisContextAvailable={!!analysisResult}
            />
          </>
        )}
        
        {!isLoading && !error && !analysisResult && (
          <div className="text-center py-10 text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 10h.01M15 10h.01M9.5 13a2.5 2.5 0 115 0V13H9.5z" />
            </svg>
            <p className="text-xl">Your field analysis will appear here.</p>
            <p className="text-sm">Enter your journal reflections above and click "Analyze Field State".</p>
          </div>
        )}
      </main>
      
      {isGlossaryOpen && (
        <GlossaryModal terms={glossaryData} onClose={toggleGlossary} />
      )}

      {tooltipData && tooltipData.visible && (
        <DefinitionTooltip
          term={tooltipData.term}
          definition={tooltipData.definition}
          x={tooltipData.x}
          y={tooltipData.y}
          onClose={() => setTooltipData(prev => prev ? { ...prev, visible: false } : null)}
        />
      )}

      <footer className="w-full max-w-3xl text-center mt-12 text-gray-500 text-sm">
        <p>Powered by Gemini API & Relational Math Principles.</p>
        <p>&copy; {new Date().getFullYear()} Field Audit Analyzer. For reflective purposes only.</p>
      </footer>
    </div>
  );
};

export default App;
