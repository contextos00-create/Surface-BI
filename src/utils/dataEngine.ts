import { Dataset, Field, AggregationType, CustomVariable, SlotField } from '../types';

export const INITIAL_DATASETS: Dataset[] = [
  {
    id: 'superstore',
    name: 'Global Enterprise Superstore',
    category: 'Commerce & Logistics',
    description: 'Quarterly retail performance, margins, regional logistics, and discount ratios.',
    fields: [
      { id: 'region', name: 'Region', dataType: 'string', role: 'dimension' },
      { id: 'category', name: 'Product Category', dataType: 'string', role: 'dimension' },
      { id: 'subCategory', name: 'Sub-Category', dataType: 'string', role: 'dimension' },
      { id: 'segment', name: 'Customer Segment', dataType: 'string', role: 'dimension' },
      { id: 'shipMode', name: 'Shipping Mode', dataType: 'string', role: 'dimension' },
      { id: 'sales', name: 'Gross Sales ($)', dataType: 'number', role: 'measure' },
      { id: 'profit', name: 'Net Profit ($)', dataType: 'number', role: 'measure' },
      { id: 'quantity', name: 'Units Sold', dataType: 'number', role: 'measure' },
      { id: 'discount', name: 'Discount (%)', dataType: 'number', role: 'measure' },
      { id: 'shippingCost', name: 'Shipping Cost ($)', dataType: 'number', role: 'measure' },
    ],
    data: [
      { region: 'North America', category: 'Technology', subCategory: 'Phones', segment: 'Corporate', shipMode: 'Same Day', sales: 4850, profit: 1240, quantity: 24, discount: 5, shippingCost: 180 },
      { region: 'North America', category: 'Technology', subCategory: 'Machines', segment: 'Consumer', shipMode: 'First Class', sales: 8400, profit: 2150, quantity: 18, discount: 8, shippingCost: 320 },
      { region: 'North America', category: 'Furniture', subCategory: 'Chairs', segment: 'Home Office', shipMode: 'Standard', sales: 3200, profit: 420, quantity: 35, discount: 15, shippingCost: 110 },
      { region: 'North America', category: 'Office Supplies', subCategory: 'Storage', segment: 'Consumer', shipMode: 'Standard', sales: 1950, profit: 580, quantity: 60, discount: 2, shippingCost: 65 },
      
      { region: 'Europe West', category: 'Technology', subCategory: 'Phones', segment: 'Corporate', shipMode: 'First Class', sales: 6200, profit: 1820, quantity: 31, discount: 4, shippingCost: 210 },
      { region: 'Europe West', category: 'Technology', subCategory: 'Accessories', segment: 'Consumer', shipMode: 'Standard', sales: 2900, profit: 890, quantity: 44, discount: 6, shippingCost: 95 },
      { region: 'Europe West', category: 'Furniture', subCategory: 'Bookcases', segment: 'Corporate', shipMode: 'Second Class', sales: 5100, profit: -180, quantity: 22, discount: 20, shippingCost: 260 },
      { region: 'Europe West', category: 'Office Supplies', subCategory: 'Paper', segment: 'Home Office', shipMode: 'Standard', sales: 1420, profit: 430, quantity: 85, discount: 0, shippingCost: 40 },

      { region: 'Asia Pacific', category: 'Technology', subCategory: 'Machines', segment: 'Corporate', shipMode: 'Same Day', sales: 11200, profit: 3450, quantity: 28, discount: 6, shippingCost: 450 },
      { region: 'Asia Pacific', category: 'Technology', subCategory: 'Phones', segment: 'Consumer', shipMode: 'First Class', sales: 7900, profit: 2480, quantity: 39, discount: 5, shippingCost: 280 },
      { region: 'Asia Pacific', category: 'Furniture', subCategory: 'Tables', segment: 'Consumer', shipMode: 'Standard', sales: 4300, profit: -310, quantity: 19, discount: 22, shippingCost: 310 },
      { region: 'Asia Pacific', category: 'Office Supplies', subCategory: 'Appliances', segment: 'Corporate', shipMode: 'Second Class', sales: 3600, profit: 980, quantity: 41, discount: 8, shippingCost: 140 },

      { region: 'Latin America', category: 'Technology', subCategory: 'Accessories', segment: 'Consumer', shipMode: 'Standard', sales: 2400, profit: 620, quantity: 29, discount: 10, shippingCost: 85 },
      { region: 'Latin America', category: 'Furniture', subCategory: 'Chairs', segment: 'Home Office', shipMode: 'Second Class', sales: 2950, profit: 310, quantity: 26, discount: 12, shippingCost: 130 },
      { region: 'Latin America', category: 'Office Supplies', subCategory: 'Binders', segment: 'Consumer', shipMode: 'Standard', sales: 1100, profit: 340, quantity: 72, discount: 5, shippingCost: 45 },

      { region: 'Middle East', category: 'Technology', subCategory: 'Phones', segment: 'Corporate', shipMode: 'First Class', sales: 5400, profit: 1620, quantity: 22, discount: 3, shippingCost: 195 },
      { region: 'Middle East', category: 'Furniture', subCategory: 'Bookcases', segment: 'Consumer', shipMode: 'Standard', sales: 3800, profit: 540, quantity: 18, discount: 7, shippingCost: 175 },
      { region: 'Middle East', category: 'Office Supplies', subCategory: 'Storage', segment: 'Corporate', shipMode: 'Second Class', sales: 2250, profit: 610, quantity: 48, discount: 4, shippingCost: 80 },
    ],
  },
  {
    id: 'deepspace',
    name: 'Deep Space Telemetry & Propulsion',
    category: 'Astrophysics & Aerospace',
    description: 'Sub-light warp drives, dark matter flux, quantum core temperatures, and hull strain.',
    fields: [
      { id: 'vessel', name: 'Starship Class', dataType: 'string', role: 'dimension' },
      { id: 'quadrant', name: 'Galactic Sector', dataType: 'string', role: 'dimension' },
      { id: 'propulsionType', name: 'Core Engine', dataType: 'string', role: 'dimension' },
      { id: 'warpVelocity', name: 'Warp Factor (c)', dataType: 'number', role: 'measure' },
      { id: 'coreTemperature', name: 'Plasma Temp (kK)', dataType: 'number', role: 'measure' },
      { id: 'energySurge', name: 'Antimatter Flux (GW)', dataType: 'number', role: 'measure' },
      { id: 'shieldIntegrity', name: 'Shield Charge (%)', dataType: 'number', role: 'measure' },
      { id: 'gravitonResonance', name: 'Graviton Oscillation', dataType: 'number', role: 'measure' },
    ],
    data: [
      { vessel: 'NX-Titan Dreadnought', quadrant: 'Orion Nebula', propulsionType: 'Tachyon Drive', warpVelocity: 9.4, coreTemperature: 840, energySurge: 1420, shieldIntegrity: 98, gravitonResonance: 44.2 },
      { vessel: 'NX-Titan Dreadnought', quadrant: 'Alpha Centauri', propulsionType: 'Tachyon Drive', warpVelocity: 9.6, coreTemperature: 910, energySurge: 1560, shieldIntegrity: 92, gravitonResonance: 48.7 },
      { vessel: 'Valkyrie Recon', quadrant: 'Cygnus Void', propulsionType: 'Ion Pulse', warpVelocity: 8.2, coreTemperature: 480, energySurge: 640, shieldIntegrity: 88, gravitonResonance: 21.5 },
      { vessel: 'Valkyrie Recon', quadrant: 'Perseus Arm', propulsionType: 'Ion Pulse', warpVelocity: 8.5, coreTemperature: 510, energySurge: 690, shieldIntegrity: 84, gravitonResonance: 23.8 },
      { vessel: 'Hyperion Heavy Hauler', quadrant: 'Omega Centauri', propulsionType: 'Fusion Core', warpVelocity: 6.8, coreTemperature: 620, energySurge: 980, shieldIntegrity: 99, gravitonResonance: 18.2 },
      { vessel: 'Hyperion Heavy Hauler', quadrant: 'Orion Nebula', propulsionType: 'Fusion Core', warpVelocity: 6.5, coreTemperature: 590, energySurge: 910, shieldIntegrity: 96, gravitonResonance: 17.4 },
      { vessel: 'Quantum Phantom X', quadrant: 'Cygnus Void', propulsionType: 'Dark Matter Flux', warpVelocity: 9.9, coreTemperature: 1150, energySurge: 2200, shieldIntegrity: 79, gravitonResonance: 78.4 },
      { vessel: 'Quantum Phantom X', quadrant: 'Alpha Centauri', propulsionType: 'Dark Matter Flux', warpVelocity: 9.8, coreTemperature: 1090, energySurge: 2050, shieldIntegrity: 82, gravitonResonance: 73.1 },
      { vessel: 'Solaris Scout', quadrant: 'Perseus Arm', propulsionType: 'Solar Sail Warp', warpVelocity: 7.4, coreTemperature: 340, energySurge: 430, shieldIntegrity: 91, gravitonResonance: 12.6 },
      { vessel: 'Solaris Scout', quadrant: 'Omega Centauri', propulsionType: 'Solar Sail Warp', warpVelocity: 7.7, coreTemperature: 370, energySurge: 480, shieldIntegrity: 94, gravitonResonance: 14.1 },
    ],
  },
  {
    id: 'saas_cloud',
    name: 'Cloud Microservices & ARR Analytics',
    category: 'High-Tech SaaS',
    description: 'Cluster latencies, MRR churn, server CPU loads, and active tenant saturation.',
    fields: [
      { id: 'cluster', name: 'Kubernetes Cluster', dataType: 'string', role: 'dimension' },
      { id: 'service', name: 'Microservice Name', dataType: 'string', role: 'dimension' },
      { id: 'tier', name: 'Subscription Tier', dataType: 'string', role: 'dimension' },
      { id: 'mrr', name: 'Monthly ARR ($k)', dataType: 'number', role: 'measure' },
      { id: 'latencyMs', name: 'P99 Latency (ms)', dataType: 'number', role: 'measure' },
      { id: 'cpuLoad', name: 'Node CPU Load (%)', dataType: 'number', role: 'measure' },
      { id: 'requestsPerSec', name: 'Throughput (RPS)', dataType: 'number', role: 'measure' },
      { id: 'errorRate', name: 'Error Rate (ppm)', dataType: 'number', role: 'measure' },
    ],
    data: [
      { cluster: 'us-east-prod-1', service: 'Auth Gateway', tier: 'Enterprise Plus', mrr: 184, latencyMs: 14, cpuLoad: 42, requestsPerSec: 12400, errorRate: 3 },
      { cluster: 'us-east-prod-1', service: 'Payment Engine', tier: 'Enterprise', mrr: 310, latencyMs: 38, cpuLoad: 68, requestsPerSec: 4200, errorRate: 1 },
      { cluster: 'us-east-prod-1', service: 'Search Vector DB', tier: 'Growth Tier', mrr: 95, latencyMs: 72, cpuLoad: 84, requestsPerSec: 8900, errorRate: 12 },
      { cluster: 'eu-central-prod', service: 'Auth Gateway', tier: 'Enterprise Plus', mrr: 142, latencyMs: 18, cpuLoad: 49, requestsPerSec: 9600, errorRate: 4 },
      { cluster: 'eu-central-prod', service: 'Payment Engine', tier: 'Enterprise', mrr: 240, latencyMs: 44, cpuLoad: 62, requestsPerSec: 3600, errorRate: 2 },
      { cluster: 'eu-central-prod', service: 'Real-time WebSocket', tier: 'Enterprise Plus', mrr: 198, latencyMs: 22, cpuLoad: 76, requestsPerSec: 18200, errorRate: 7 },
      { cluster: 'ap-southeast-1', service: 'Search Vector DB', tier: 'Growth Tier', mrr: 88, latencyMs: 88, cpuLoad: 79, requestsPerSec: 6400, errorRate: 18 },
      { cluster: 'ap-southeast-1', service: 'Real-time WebSocket', tier: 'Enterprise', mrr: 165, latencyMs: 29, cpuLoad: 81, requestsPerSec: 14300, errorRate: 9 },
    ],
  },
  {
    id: 'crypto_liquidity',
    name: 'Quantum Market & Liquidity Vortex',
    category: 'Quantitative Finance',
    description: 'High-frequency order-book depth, implied volatility, sentiment delta, and trade velocity.',
    fields: [
      { id: 'token', name: 'Asset Pair', dataType: 'string', role: 'dimension' },
      { id: 'marketVenue', name: 'Exchange / DEX', dataType: 'string', role: 'dimension' },
      { id: 'regime', name: 'Macro Regime', dataType: 'string', role: 'dimension' },
      { id: 'tradeVolume', name: '24h Volume ($M)', dataType: 'number', role: 'measure' },
      { id: 'volatility', name: 'Implied Volatility (%)', dataType: 'number', role: 'measure' },
      { id: 'whaleIndex', name: 'Whale Net Flow ($M)', dataType: 'number', role: 'measure' },
      { id: 'spreadBps', name: 'Bid-Ask Spread (bps)', dataType: 'number', role: 'measure' },
      { id: 'sentimentScore', name: 'Social Sentiment (0-100)', dataType: 'number', role: 'measure' },
    ],
    data: [
      { token: 'BTC/USD', marketVenue: 'Deribit Prime', regime: 'Bullish Momentum', tradeVolume: 1420, volatility: 48, whaleIndex: 82, spreadBps: 1.2, sentimentScore: 78 },
      { token: 'BTC/USD', marketVenue: 'Uniswap v4', regime: 'Bullish Momentum', tradeVolume: 640, volatility: 52, whaleIndex: 35, spreadBps: 2.8, sentimentScore: 76 },
      { token: 'ETH/USD', marketVenue: 'Deribit Prime', regime: 'Sideways Vol', tradeVolume: 920, volatility: 62, whaleIndex: -18, spreadBps: 1.8, sentimentScore: 64 },
      { token: 'ETH/USD', marketVenue: 'Uniswap v4', regime: 'Sideways Vol', tradeVolume: 810, volatility: 66, whaleIndex: 42, spreadBps: 3.1, sentimentScore: 69 },
      { token: 'SOL/USD', marketVenue: 'Binance Hyper', regime: 'Breakout Expansion', tradeVolume: 780, volatility: 78, whaleIndex: 94, spreadBps: 2.2, sentimentScore: 89 },
      { token: 'AVAX/USD', marketVenue: 'Binance Hyper', regime: 'Mean Reversion', tradeVolume: 240, volatility: 71, whaleIndex: 12, spreadBps: 4.5, sentimentScore: 58 },
      { token: 'NEAR/USD', marketVenue: 'Coinbase Pro', regime: 'Accumulation', tradeVolume: 195, volatility: 58, whaleIndex: 28, spreadBps: 3.8, sentimentScore: 71 },
    ],
  },
];

/**
 * Aggregates array of numbers according to type
 */
export function aggregateValues(values: number[], type: AggregationType = 'sum'): number {
  if (!values.length) return 0;
  switch (type) {
    case 'sum':
      return values.reduce((acc, curr) => acc + curr, 0);
    case 'avg':
      return values.reduce((acc, curr) => acc + curr, 0) / values.length;
    case 'count':
      return values.length;
    case 'min':
      return Math.min(...values);
    case 'max':
      return Math.max(...values);
    default:
      return values.reduce((acc, curr) => acc + curr, 0);
  }
}

/**
 * Transforms raw tabular data according to X-Axis, Y-Axis, Legend, and Aggregation
 */
export function processChartData(
  rawData: Record<string, any>[],
  xSlot: SlotField | null,
  ySlot: SlotField | null,
  legendSlot: SlotField | null,
  sizeSlot: SlotField | null,
  customVariables: CustomVariable[] = []
): {
  chartData: Record<string, any>[];
  legendKeys: string[];
  yFieldLabel: string;
} {
  // If custom variables exist, inject their computed values into rawData copies
  const enrichedData = rawData.map((row) => {
    const rowCopy = { ...row };
    customVariables.forEach((cv) => {
      rowCopy[cv.id] = evaluateCustomVariable(cv, row);
    });
    return rowCopy;
  });

  if (!enrichedData.length) {
    return { chartData: [], legendKeys: [], yFieldLabel: '' };
  }

  // Fallback defaults if user hasn't assigned X or Y yet
  const firstDim = Object.keys(enrichedData[0]).find((k) => typeof enrichedData[0][k] === 'string') || Object.keys(enrichedData[0])[0];
  const firstMeas = Object.keys(enrichedData[0]).find((k) => typeof enrichedData[0][k] === 'number') || Object.keys(enrichedData[0])[1];

  const xKey = xSlot ? xSlot.field.id : firstDim;
  const yKey = ySlot ? ySlot.field.id : firstMeas;
  const aggType = ySlot?.aggregation || 'sum';
  const legendKey = legendSlot ? legendSlot.field.id : null;
  const sizeKey = sizeSlot ? sizeSlot.field.id : null;

  const yFieldLabel = `${aggType.toUpperCase()} of ${ySlot ? ySlot.field.name : yKey}`;

  // If no legend, group by X-Axis
  if (!legendKey) {
    const grouped = new Map<string, { values: number[]; sizes: number[]; rawItem: any }>();

    enrichedData.forEach((row) => {
      const xVal = String(row[xKey] ?? 'Unknown');
      const yVal = Number(row[yKey]) || 0;
      const sizeVal = sizeKey ? Number(row[sizeKey]) || 1 : 1;

      if (!grouped.has(xVal)) {
        grouped.set(xVal, { values: [], sizes: [], rawItem: row });
      }
      const entry = grouped.get(xVal)!;
      entry.values.push(yVal);
      entry.sizes.push(sizeVal);
    });

    const chartData = Array.from(grouped.entries()).map(([xVal, entry]) => {
      const agg = aggregateValues(entry.values, aggType);
      const aggSize = sizeKey ? aggregateValues(entry.sizes, 'avg') : 1;
      return {
        x: xVal,
        [yKey]: Number(agg.toFixed(2)),
        value: Number(agg.toFixed(2)),
        size: Number(aggSize.toFixed(2)),
        count: entry.values.length,
        ...entry.rawItem,
      };
    });

    return {
      chartData,
      legendKeys: [yKey],
      yFieldLabel,
    };
  }

  // If Legend is provided: group by X-Axis and split into legend series columns
  const legendSet = new Set<string>();
  const matrix = new Map<string, Map<string, number[]>>();

  enrichedData.forEach((row) => {
    const xVal = String(row[xKey] ?? 'Unknown');
    const legVal = String(row[legendKey] ?? 'General');
    const yVal = Number(row[yKey]) || 0;

    legendSet.add(legVal);

    if (!matrix.has(xVal)) {
      matrix.set(xVal, new Map());
    }
    const xSubMap = matrix.get(xVal)!;
    if (!xSubMap.has(legVal)) {
      xSubMap.set(legVal, []);
    }
    xSubMap.get(legVal)!.push(yVal);
  });

  const legendKeys = Array.from(legendSet);
  const chartData: Record<string, any>[] = [];

  matrix.forEach((subMap, xVal) => {
    const rowObj: Record<string, any> = { x: xVal };
    legendKeys.forEach((lKey) => {
      const vals = subMap.get(lKey) || [];
      rowObj[lKey] = vals.length ? Number(aggregateValues(vals, aggType).toFixed(2)) : 0;
    });
    chartData.push(rowObj);
  });

  return {
    chartData,
    legendKeys,
    yFieldLabel,
  };
}

/**
 * Computes custom formula evaluation
 */
export function evaluateCustomVariable(cv: CustomVariable, row: Record<string, any>): number {
  const valA = cv.assignedFields.slotA ? Number(row[cv.assignedFields.slotA.id]) || 0 : 1;
  const valB = cv.assignedFields.slotB ? Number(row[cv.assignedFields.slotB.id]) || 1 : 1;
  const valC = cv.assignedFields.slotC ? Number(row[cv.assignedFields.slotC.id]) || 0 : 0;
  const multiplier = cv.customMultiplier || 1;

  switch (cv.expressionType) {
    case 'ratio':
      return Number(((valA / (valB === 0 ? 1 : valB)) * multiplier).toFixed(3));
    case 'exponential':
      return Number((Math.pow(Math.abs(valA), 1.15) * (valB / 100) * multiplier).toFixed(3));
    case 'chaos_index':
      return Number((Math.sin(valA) * Math.sqrt(Math.abs(valB)) * 10 + valC * multiplier).toFixed(3));
    case 'custom_math':
    default:
      return Number(((valA * 1.5 + valB * 0.8 + valC * 0.2) * multiplier).toFixed(3));
  }
}

/**
 * CSV / JSON raw string parser
 */
export function parseImportedDataset(fileName: string, content: string): Dataset | null {
  try {
    // Try JSON
    if (content.trim().startsWith('[') || content.trim().startsWith('{')) {
      const parsed = JSON.parse(content);
      const rows: Record<string, any>[] = Array.isArray(parsed) ? parsed : [parsed];
      if (!rows.length) return null;

      const keys = Object.keys(rows[0]);
      const fields: Field[] = keys.map((key) => {
        const sampleVal = rows.find((r) => r[key] !== null && r[key] !== undefined)?.[key];
        const isNum = typeof sampleVal === 'number' || (!isNaN(Number(sampleVal)) && sampleVal !== '');
        return {
          id: key,
          name: key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
          dataType: isNum ? 'number' : 'string',
          role: isNum ? 'measure' : 'dimension',
        };
      });

      return {
        id: `import_${Date.now()}`,
        name: fileName.replace(/\.[^/.]+$/, ''),
        category: 'User Imported Data',
        description: `Imported from ${fileName} with ${rows.length} records.`,
        fields,
        data: rows.map((r) => {
          const clean: Record<string, any> = {};
          fields.forEach((f) => {
            clean[f.id] = f.role === 'measure' ? Number(r[f.id]) || 0 : String(r[f.id] ?? '');
          });
          return clean;
        }),
      };
    }

    // Try CSV
    const lines = content.split(/\r?\n/).filter((l) => l.trim().length > 0);
    if (lines.length < 2) return null;

    const headers = lines[0].split(',').map((h) => h.trim().replace(/^["']|["']$/g, ''));
    const rows: Record<string, any>[] = [];

    for (let i = 1; i < lines.length; i++) {
      const parts = lines[i].split(',').map((p) => p.trim().replace(/^["']|["']$/g, ''));
      if (parts.length === headers.length) {
        const row: Record<string, any> = {};
        headers.forEach((h, idx) => {
          row[h] = parts[idx];
        });
        rows.push(row);
      }
    }

    const fields: Field[] = headers.map((header) => {
      let numericCount = 0;
      rows.slice(0, 20).forEach((r) => {
        if (!isNaN(Number(r[header])) && r[header] !== '') numericCount++;
      });
      const isNum = numericCount > rows.slice(0, 20).length * 0.7;

      return {
        id: header.toLowerCase().replace(/[^a-z0-9]/g, '_'),
        name: header,
        dataType: isNum ? 'number' : 'string',
        role: isNum ? 'measure' : 'dimension',
      };
    });

    const cleanRows = rows.map((r) => {
      const clean: Record<string, any> = {};
      fields.forEach((f, idx) => {
        const rawKey = headers[idx];
        clean[f.id] = f.role === 'measure' ? Number(r[rawKey]) || 0 : String(r[rawKey] ?? '');
      });
      return clean;
    });

    return {
      id: `import_${Date.now()}`,
      name: fileName.replace(/\.[^/.]+$/, ''),
      category: 'User Imported Data',
      description: `Imported CSV ${fileName} (${cleanRows.length} rows)`,
      fields,
      data: cleanRows,
    };
  } catch (err) {
    console.error('Import parse error:', err);
    return null;
  }
}

/**
 * Real-time dynamic mutation for live data synchronization
 */
export function simulateRealtimeTick(dataset: Dataset): Dataset {
  const mutatedData = dataset.data.map((row) => {
    const updated = { ...row };
    dataset.fields.forEach((f) => {
      if (f.role === 'measure') {
        const current = Number(updated[f.id]) || 0;
        // Jitter by ±1.5% to ±4%
        const delta = (Math.random() - 0.48) * (current * 0.04 || 2);
        const val = current + delta;
        updated[f.id] = Number(val > 0 ? val.toFixed(1) : current.toFixed(1));
      }
    });
    return updated;
  });

  return {
    ...dataset,
    data: mutatedData,
  };
}
