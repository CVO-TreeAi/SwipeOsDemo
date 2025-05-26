import { create } from 'zustand';
import { CardData } from '../components/wallet/CardStack';
import { supabase } from '../lib/supabase';

interface WalletState {
  cards: CardData[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchCards: (userId: string) => Promise<void>;
  addCard: (card: CardData) => void;
  removeCard: (cardId: string) => void;
  reorderCards: (cards: CardData[]) => void;
  updateCard: (cardId: string, data: Partial<CardData>) => void;
}

export const useWalletStore = create<WalletState>((set, get) => ({
  cards: [],
  isLoading: false,
  error: null,

  fetchCards: async (userId: string) => {
    set({ isLoading: true, error: null });
    
    try {
      const { data, error } = await supabase
        .from('user_cards')
        .select('*')
        .eq('user_id', userId)
        .eq('is_archived', false)
        .order('position', { ascending: true });

      if (error) throw error;

      // Transform database cards to CardData format
      const cards: CardData[] = data?.map(card => ({
        id: card.id,
        type: card.card_type_id,
        position: card.position,
        component: null, // Will be populated by the container
      })) || [];

      set({ cards, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  addCard: (card: CardData) => {
    set(state => ({
      cards: [...state.cards, card],
    }));
  },

  removeCard: (cardId: string) => {
    set(state => ({
      cards: state.cards.filter(card => card.id !== cardId),
    }));
  },

  reorderCards: (cards: CardData[]) => {
    set({ cards });
    
    // Update positions in database
    cards.forEach(async (card, index) => {
      await supabase
        .from('user_cards')
        .update({ position: index })
        .eq('id', card.id);
    });
  },

  updateCard: (cardId: string, data: Partial<CardData>) => {
    set(state => ({
      cards: state.cards.map(card =>
        card.id === cardId ? { ...card, ...data } : card
      ),
    }));
  },
})); 