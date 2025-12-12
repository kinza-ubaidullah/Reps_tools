
import { TrackingData, TrackingStep } from '../types';

// Service: TrackingMore V4
const API_BASE_URL = 'https://api.trackingmore.com/v4/trackings/realtime';

// Integrated Key provided by client
const API_KEY = '45rdibe6-ehnu-i5fl-8jg9-y7erpd8vs62q';

export const fetchTrackingInfo = async (trackingNumber: string): Promise<TrackingData | null> => {
    if (!trackingNumber) return null;

    try {
        const response = await fetch(API_BASE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Tracking-Api-Key': API_KEY 
            },
            body: JSON.stringify({ 
                tracking_number: trackingNumber,
                // Optional: carrier_code if known, otherwise auto-detect
            })
        });

        const data = await response.json();
        
        // Validate Response
        if (data.meta && data.meta.code === 200 && data.data) {
            const trackObj = data.data;
            
            // Extract events from various possible fields
            let rawEvents = trackObj.items || [];
            
            if (rawEvents.length === 0 && trackObj.origin_info && trackObj.origin_info.trackinfo) {
                rawEvents = trackObj.origin_info.trackinfo;
            }
            if (rawEvents.length === 0 && trackObj.destination_info && trackObj.destination_info.trackinfo) {
                rawEvents = trackObj.destination_info.trackinfo;
            }

            return {
                trackingNumber: trackObj.tracking_number,
                carrier: trackObj.carrier_code || 'Auto Detected',
                status: (trackObj.delivery_status || 'In Transit') as any, 
                estimatedDelivery: trackObj.expected_delivery || 'Calculating...',
                steps: rawEvents.map((event: any) => ({
                    date: event.Date || event.created_at, 
                    status: event.checkpoint_status || event.status || 'Update', 
                    location: event.Location || event.location || '', 
                    description: event.StatusDescription || event.detail || event.description || ''
                }))
            };
        } else {
             console.warn("Tracking API Error:", data.meta?.message || "Unknown error");
             return null;
        }

    } catch (error) {
        console.error("Tracking API Network Error:", error);
        return null;
    }
}
