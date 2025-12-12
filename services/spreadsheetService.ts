
import { supabase } from './supabaseClient';
import { Spreadsheet } from '../types';

// Mock fallback in case DB is empty or not set up
const MOCK_SHEETS: Spreadsheet[] = [
    { id: 1, title: "Ultimate Budget Finds", items: "1.2k", author: "RepKing", link: "#", created_at: "2h ago" },
    { id: 2, title: "Summer 2025 Haul", items: "500", author: "FashionKilla", link: "#", created_at: "1d ago" },
];

export const fetchSpreadsheets = async (): Promise<Spreadsheet[]> => {
    try {
        const { data, error } = await supabase
            .from('spreadsheets')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        
        if (!data || data.length === 0) {
            return MOCK_SHEETS; // Fallback so UI doesn't break before DB setup
        }

        return data as Spreadsheet[];
    } catch (err) {
        console.warn("Spreadsheet Fetch Error (Using Mock):", err);
        return MOCK_SHEETS;
    }
};

export const addSpreadsheet = async (sheet: Omit<Spreadsheet, 'id' | 'created_at'>) => {
    const { error } = await supabase
        .from('spreadsheets')
        .insert(sheet);
    
    if (error) throw error;
};

export const deleteSpreadsheet = async (id: number) => {
    const { error } = await supabase
        .from('spreadsheets')
        .delete()
        .eq('id', id);

    if (error) throw error;
};
