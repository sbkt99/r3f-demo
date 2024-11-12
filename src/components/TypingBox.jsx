import { useAIModel } from '../app/hooks/useAIModel.jsx';

import { useEffect, useRef, useCallback, useState } from 'react';

import { RealtimeClient } from '@openai/realtime-api-beta';
import { ItemType } from '@openai/realtime-api-beta';
import { WavRecorder, WavStreamPlayer } from '../lib/wavtools/index.js';
import { instructions } from '../utils/conversation_config.js';
import { WavRenderer } from '../utils/wav_renderer';
import { X, Edit, Zap, ArrowUp, ArrowDown } from 'react-feather';

export function TypingBox () {
    const askAI = useAIModel((state) => state.askAI);
    const loading = useAIModel((state) => state.loading);
    //const disconnectConversation = useAIModel((state) => state.disconnectConversation);
    const [question, setQuestion] = useState("");

    const ask = () => {
        askAI(question);
        setQuestion("");
    };
  
    return(
        <div className="z-10 max-w-[600px] flex space-y-6 flex-col bg-gradient-to-tr  from-slate-300/30 via-gray-400/30 to-slate-600-400/30 p-4  backdrop-blur-md rounded-xl border-slate-100/30 border">
      <div>
        <h2 className="text-red-600 font-bold text-xl">
         Bienvenido a Claro, ¿en que te podemos ayudar hoy?
        </h2>
      </div>

      {loading ? (
        <div className="flex justify-center items-center">
          <span className="relative flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-white"></span>
          </span>
        </div>
      ) : (
        <div className="gap-3 flex">
          <input
            className="focus:outline focus:outline-white/80 flex-grow bg-slate-800/60 p-2 px-4 rounded-full text-white placeholder:text-white/50 shadow-inner shadow-slate-900/60"
            placeholder="Me gustaría hacer una reposición de chip"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                ask();
              }
            }}
          />
          <button
            onClick={ask}
          >
            Enviar
          </button>
        </div>
      )}
    </div>
  );

};