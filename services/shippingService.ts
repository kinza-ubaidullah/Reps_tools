
import { Agent, ShippingLine } from '../types';
import { MOCK_AGENTS } from '../constants';

export interface ShippingRequest {
  weight: number; // in grams
  length?: number; // cm
  width?: number; // cm
  height?: number; // cm
  country: string;
}

export interface ShippingResult {
  agentName: string;
  agentLogo: string;
  agentWebsite: string;
  lineName: string;
  totalPrice: number;
  currency: string;
  deliveryMin: number;
  deliveryMax: number;
  features: string[];
  isVolumetric: boolean; // Did we use volumetric weight?
  chargedWeight: number; // The weight used for calc
}

// Volumetric Divisor (Standard is 6000 or 5000 depending on line, using 5000 as safer estimate)
const VOLUMETRIC_DIVISOR = 5000;

export const calculateShipping = async (req: ShippingRequest): Promise<ShippingResult[]> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 600));

  const results: ShippingResult[] = [];
  
  // Calculate Volumetric Weight
  let volWeight = 0;
  if (req.length && req.width && req.height) {
    volWeight = (req.length * req.width * req.height * 1000) / VOLUMETRIC_DIVISOR; // in grams
  }

  // Iterate through all agents and their lines
  MOCK_AGENTS.forEach(agent => {
    agent.shippingLines.forEach(line => {
      // 1. Check Max Weight Limit
      if (req.weight > line.maxWeight) return;

      // 2. Determine Charged Weight (Volumetric vs Actual)
      // Some lines (like EMS) might only charge actual weight. 
      // For this demo, we assume express lines charge volume if it's higher.
      let chargedWeight = req.weight;
      let isVolumetric = false;

      // Simple logic: If line name includes 'DHL' or 'FedEx' or 'UPS', use Volumetric
      if (line.name.toLowerCase().includes('dhl') || line.name.toLowerCase().includes('express') || line.name.toLowerCase().includes('fedex')) {
          if (volWeight > req.weight) {
              chargedWeight = volWeight;
              isVolumetric = true;
          }
      }

      // 3. Check Weight again against max (in case volume pushes it over)
      if (chargedWeight > line.maxWeight) return;

      // 4. Calculate Price
      // Base price covers first 500g (usually)
      // Remaining weight is calculated in 500g chunks
      let price = line.basePrice;
      const remainingWeight = Math.max(0, chargedWeight - 500);
      const additionalUnits = Math.ceil(remainingWeight / 500);
      
      price += additionalUnits * line.pricePer500g;

      results.push({
        agentName: agent.name,
        agentLogo: agent.logo,
        agentWebsite: agent.website,
        lineName: line.name,
        totalPrice: parseFloat(price.toFixed(2)),
        currency: 'USD',
        deliveryMin: line.deliveryDaysMin,
        deliveryMax: line.deliveryDaysMax,
        features: line.features,
        isVolumetric,
        chargedWeight: Math.round(chargedWeight)
      });
    });
  });

  // Sort by Price (Cheapest first)
  return results.sort((a, b) => a.totalPrice - b.totalPrice);
};
