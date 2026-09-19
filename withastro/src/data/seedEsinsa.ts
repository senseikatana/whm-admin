import type { CollectionKey } from '../types';
import { seedData, type SeedRow } from './seed';

export type EsinsaSeedRow = SeedRow;

/**
 * ESINSA-specific seed alias. The dataset lives in seed.ts so the local and
 * InsForge stores seed from a single source of truth.
 */
export const esinsaSeed: Partial<Record<CollectionKey, readonly EsinsaSeedRow[]>> = seedData;
