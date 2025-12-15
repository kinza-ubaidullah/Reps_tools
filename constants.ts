
import { Agent, Rank, Product } from './types';

export const MOCK_AGENTS: Agent[] = [
  {
    id: 'agent_cnfans',
    name: 'CNFans',
    website: 'https://cnfans.com',
    logo: 'https://placehold.co/100x100/10b981/white?text=CN',
    shippingLines: [
      {
        name: 'DHL Tariffless',
        minWeight: 0,
        maxWeight: 10000,
        basePrice: 25,
        pricePer500g: 8,
        deliveryDaysMin: 10,
        deliveryDaysMax: 18,
        features: ['Tax Free', 'Triangle']
      },
      {
        name: 'EMS',
        minWeight: 0,
        maxWeight: 30000,
        basePrice: 20,
        pricePer500g: 6,
        deliveryDaysMin: 7,
        deliveryDaysMax: 15,
        features: ['Insurance']
      }
    ]
  },
  {
    id: 'agent_mulebuy',
    name: 'Mulebuy',
    website: 'https://mulebuy.com',
    logo: 'https://placehold.co/100x100/ea580c/white?text=MB',
    shippingLines: [
      {
        name: 'Mule Express',
        minWeight: 0,
        maxWeight: 5000,
        basePrice: 18,
        pricePer500g: 7,
        deliveryDaysMin: 8,
        deliveryDaysMax: 14,
        features: ['Fast Customs']
      },
      {
        name: 'Sea Packet',
        minWeight: 0,
        maxWeight: 20000,
        basePrice: 12,
        pricePer500g: 3,
        deliveryDaysMin: 25,
        deliveryDaysMax: 45,
        features: ['Budget']
      }
    ]
  },
  {
    id: 'agent_kakobuy',
    name: 'KakoBuy',
    website: 'https://kakobuy.com',
    logo: 'https://placehold.co/100x100/dc2626/white?text=KB',
    shippingLines: [
      {
        name: 'Kako Special Line',
        minWeight: 0,
        maxWeight: 8000,
        basePrice: 24,
        pricePer500g: 7.5,
        deliveryDaysMin: 9,
        deliveryDaysMax: 16,
        features: ['Reliable', 'Cheap']
      }
    ]
  },
  {
    id: 'agent_litbuy',
    name: 'LitBuy',
    website: 'https://www.litbuy.com',
    logo: 'https://placehold.co/100x100/8b5cf6/white?text=LB',
    shippingLines: [
      {
        name: 'Lit Express',
        minWeight: 0,
        maxWeight: 5000,
        basePrice: 19,
        pricePer500g: 7,
        deliveryDaysMin: 8,
        deliveryDaysMax: 15,
        features: ['Priority']
      },
      {
        name: 'Lit Tax Free',
        minWeight: 0,
        maxWeight: 10000,
        basePrice: 24,
        pricePer500g: 7.8,
        deliveryDaysMin: 12,
        deliveryDaysMax: 20,
        features: ['Tax Free']
      }
    ]
  },
  {
    id: 'agent_sugargoo',
    name: 'SUGARGOO',
    website: 'https://sugargoo.com',
    logo: 'https://placehold.co/100x100/52525b/white?text=SG',
    shippingLines: [
      {
        name: 'US Tax Free',
        minWeight: 0,
        maxWeight: 8000,
        basePrice: 22,
        pricePer500g: 7,
        deliveryDaysMin: 10,
        deliveryDaysMax: 15,
        features: ['Tax Free']
      },
      {
        name: 'FEDEX-Z',
        minWeight: 0,
        maxWeight: 20000,
        basePrice: 35,
        pricePer500g: 12,
        deliveryDaysMin: 3,
        deliveryDaysMax: 7,
        features: ['Fastest']
      }
    ]
  },
  {
    id: 'agent_joyagoo',
    name: 'JoyaGoo',
    website: 'https://joyagoo.com',
    logo: 'https://placehold.co/100x100/eab308/white?text=JG',
    shippingLines: [
      {
        name: 'Joya Air',
        minWeight: 0,
        maxWeight: 5000,
        basePrice: 20,
        pricePer500g: 6.5,
        deliveryDaysMin: 8,
        deliveryDaysMax: 14,
        features: ['Good Service']
      }
    ]
  }
];

// REAL DATA ENFORCEMENT: Empty mock database.
// The app must now successfully fetch from APIs to show content.
export const MOCK_PRODUCTS: Product[] = [];

export const RANK_COLORS = {
  [Rank.BRONZE]: 'text-amber-600',
  [Rank.SILVER]: 'text-slate-400',
  [Rank.GOLD]: 'text-yellow-400',
  [Rank.PLATINUM]: 'text-cyan-400',
  [Rank.ADMIN]: 'text-red-500 font-bold'
};

export const COUNTRIES = [
  "USA", "United Kingdom", "Canada", "Germany", "France", "Australia", "Poland", "Spain", "Italy"
];
