export interface TravelPlace {
  id: string;
  name: string;
  city: string;
  type: 'Biển' | 'Núi' | 'Thành phố' | string;
  price: number;
  rating: number;
  image: string;
  description: string;
  visitTime: number;
  budget: {
    food: number;
    stay: number;
    transport: number;
  };
}

export interface ItineraryItem {
  id: string;
  placeId: string;
  day: number;
  createdAt: string;
}

export interface BudgetItem {
  type: string;
  value: number;
}

const STORAGE_KEYS = {
  places: 'places',
  itinerary: 'itinerary',
  budget: 'budget',
  budgetLimit: 'budgetLimit',
};

const defaultPlaces: TravelPlace[] = [
  {
    id: 'p1',
    name: 'Nha Trang Beach',
    city: 'Nha Trang',
    type: 'Biển',
    price: 1200,
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    description: 'Biển cát trắng, nước xanh và hoạt động giải trí biển.',
    visitTime: 5,
    budget: {
      food: 350,
      stay: 450,
      transport: 180,
    },
  },
  {
    id: 'p2',
    name: 'Sapa Mountain',
    city: 'Sapa',
    type: 'Núi',
    price: 950,
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80',
    description: 'Khám phá ruộng bậc thang và thời tiết mát mẻ.',
    visitTime: 4,
    budget: {
      food: 260,
      stay: 320,
      transport: 180,
    },
  },
  {
    id: 'p3',
    name: 'Hanoi Old Quarter',
    city: 'Hà Nội',
    type: 'Thành phố',
    price: 700,
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1549576490-b0b4831ef60a?auto=format&fit=crop&w=800&q=80',
    description: 'Văn hóa phố cổ, ẩm thực và di tích lịch sử.',
    visitTime: 3,
    budget: {
      food: 280,
      stay: 260,
      transport: 120,
    },
  },
  {
    id: 'p4',
    name: 'Da Nang City',
    city: 'Đà Nẵng',
    type: 'Thành phố',
    price: 900,
    rating: 4.4,
    image: 'https://images.unsplash.com/photo-1493558103817-58b2924bce98?auto=format&fit=crop&w=800&q=80',
    description: 'Thành phố biển sôi động và cầu Rồng nổi tiếng.',
    visitTime: 4,
    budget: {
      food: 300,
      stay: 340,
      transport: 160,
    },
  },
  {
    id: 'p5',
    name: 'Ha Long Bay',
    city: 'Hạ Long',
    type: 'Biển',
    price: 1350,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    description: 'Di sản thiên nhiên thế giới với cảnh quan hùng vĩ.',
    visitTime: 6,
    budget: {
      food: 410,
      stay: 500,
      transport: 220,
    },
  },
];

const defaultBudget: BudgetItem[] = [
  { type: 'Ăn uống', value: 700 },
  { type: 'Lưu trú', value: 900 },
  { type: 'Di chuyển', value: 450 },
];

const safeParse = <T>(value: string | null, fallback: T): T => {
  if (!value) {
    return fallback;
  }
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
};

export const getPlaces = (): TravelPlace[] =>
  safeParse<TravelPlace[]>(localStorage.getItem(STORAGE_KEYS.places), defaultPlaces);

export const savePlaces = (data: TravelPlace[]) => {
  localStorage.setItem(STORAGE_KEYS.places, JSON.stringify(data));
};

export const getItinerary = (): ItineraryItem[] =>
  safeParse<ItineraryItem[]>(localStorage.getItem(STORAGE_KEYS.itinerary), []);

export const saveItinerary = (data: ItineraryItem[]) => {
  localStorage.setItem(STORAGE_KEYS.itinerary, JSON.stringify(data));
};

export const getBudget = (): BudgetItem[] =>
  safeParse<BudgetItem[]>(localStorage.getItem(STORAGE_KEYS.budget), defaultBudget);

export const saveBudget = (data: BudgetItem[]) => {
  localStorage.setItem(STORAGE_KEYS.budget, JSON.stringify(data));
};

export const getBudgetLimit = (): number =>
  safeParse<number>(localStorage.getItem(STORAGE_KEYS.budgetLimit), 2500);

export const saveBudgetLimit = (value: number) => {
  localStorage.setItem(STORAGE_KEYS.budgetLimit, String(value));
};