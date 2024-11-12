import { create } from 'zustand';

export const useAIModel = create((set, get) => ({
  items: [],
  messages: [],
  currentMessage: null,
  background: "default",
  query: true,
  reply: true,
  loading: false,
  isRecording: false,  // Add recording state
  isConnected: false,  // Track connection status
  realtimeEvents: [],  // Store realtime events
  items: [],  // Store conversation items
  memoryKv: {},  // Store memory key-value
  marker: null,  // Marker state
  
  setBackground: (background) => {
    set(() => ({ background }));
  },

  setQuery: (query) => {
    set(() => ({ query }));
  },

  setReply: (reply) => {
    set(() => ({ reply }));
  },
  setItems: (newItems) => set({ items: newItems }), // Método para actualizar items

  // Action to handle AI requests
  askAI: async (question) => {
    if (!question) return;
    
    const message = {
      question,
      id: get().messages.length,
    };

    set(() => ({ loading: true }));

    // Ask AI
    const res = await fetch(`/api/ai?question=${question}`);
    const data = await res.json();

    // Save result in the message
    message.answer = data;

    set(() => ({
      currentMessage: message,
      messages: [...get().messages, message],
      loading: false,
    }));

    get().playMessage(message);
  },

  // Action to play AI response message
  playMessage: async (message) => {
    set(() => ({ currentMessage: message }));

    if (!message.audioPlayer) {
      set(() => ({ loading: true }));

      // Get TTS
      const audioRes = await fetch(`/api/tts?avatar=${get().avatar}&text=${message.answer.respuesta}`);
      const audio = await audioRes.blob();
      const audioUrl = URL.createObjectURL(audio);
      const audioPlayer = new Audio(audioUrl);

      message.audioPlayer = audioPlayer;
      message.audioPlayer.onended = () => {
        set(() => ({ currentMessage: null }));
      };

      set(() => ({
        loading: false,
        messages: get().messages.map((m) => m.id === message.id ? message : m),
      }));
    }

    message.audioPlayer.currentTime = 0;
    message.audioPlayer.play();
  },

}));
