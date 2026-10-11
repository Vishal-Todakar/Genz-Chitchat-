import { create } from 'zustand';

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'me' | 'stranger';
  timestamp: number;
  flagged?: boolean;
}

type ChatStatus = 'idle' | 'searching' | 'connected' | 'disconnected' | 'banned';

interface ChatState {
  status: ChatStatus;
  messages: ChatMessage[];
  isPartnerTyping: boolean;
  roomId: string | null;
  sharedInterests: string[];
  interests: string[];
  onlineCount: number;
  rateLimited: boolean;
  chatMode: 'text' | 'video';
  isInitiator: boolean;
  partnerGender: 'girl' | 'guy' | null;

  setStatus: (status: ChatStatus) => void;
  addMessage: (msg: ChatMessage) => void;
  clearMessages: () => void;
  setPartnerTyping: (typing: boolean) => void;
  setRoomId: (id: string | null) => void;
  setSharedInterests: (interests: string[]) => void;
  setInterests: (interests: string[]) => void;
  setOnlineCount: (count: number) => void;
  setRateLimited: (limited: boolean) => void;
  setChatMode: (mode: 'text' | 'video') => void;
  setIsInitiator: (initiator: boolean) => void;
  setPartnerGender: (gender: 'girl' | 'guy' | null) => void;
  resetChat: () => void;
}

let msgCounter = 0;

export const useChatStore = create<ChatState>((set) => ({
  status: 'idle',
  messages: [],
  isPartnerTyping: false,
  roomId: null,
  sharedInterests: [],
  interests: [],
  onlineCount: 0,
  rateLimited: false,
  chatMode: 'text',
  isInitiator: false,
  partnerGender: null,

  setStatus: (status) => set({ status }),
  addMessage: (msg) =>
    set((state) => ({
      messages: [...state.messages, { ...msg, id: msg.id || `msg_${++msgCounter}` }],
    })),
  clearMessages: () => set({ messages: [] }),
  setPartnerTyping: (typing) => set({ isPartnerTyping: typing }),
  setRoomId: (id) => set({ roomId: id }),
  setSharedInterests: (interests) => set({ sharedInterests: interests }),
  setInterests: (interests) => set({ interests }),
  setOnlineCount: (count) => set({ onlineCount: count }),
  setRateLimited: (limited) => set({ rateLimited: limited }),
  setChatMode: (mode) => set({ chatMode: mode }),
  setIsInitiator: (isInitiator) => set({ isInitiator }),
  setPartnerGender: (partnerGender) => set({ partnerGender }),
  resetChat: () =>
    set({
      status: 'idle',
      messages: [],
      isPartnerTyping: false,
      roomId: null,
      sharedInterests: [],
      rateLimited: false,
      isInitiator: false,
      partnerGender: null,
    }),
}));
