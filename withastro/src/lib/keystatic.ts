import { createReader } from '@keystatic/core/reader';
import keystaticConfig from '../../keystatic.config';

/**
 * Keystatic Content Reader Instance
 * Enables server-side reading of all singletons and collections managed by Keystatic CMS.
 */
export const keystaticReader = createReader(process.cwd(), keystaticConfig);
