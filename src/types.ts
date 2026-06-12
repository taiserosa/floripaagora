/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Category = 'feiras' | 'shows' | 'esportes' | 'cursos' | 'outros';

export interface CulturalEvent {
  id: string;
  title: string;
  description: string;
  category: Category;
  subCategory?: string; // e.g. 'Bares e Pubs', 'Palestras', etc.
  date: string; // ISO date YYYY-MM-DD
  time: string; // HH:MM
  locationName: string;
  neighborhood: string;
  address: string;
  latitude: number; // For the interactive simulated map
  longitude: number; // For the interactive simulated map
  price: string; // "Gratuito", "R$ 20", etc.
  imageUrl: string;
  featured?: boolean;
  comunidade?: boolean;
}
