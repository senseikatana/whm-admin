import caJson from './locales/ca.json';
import enJson from './locales/en.json';
import esJson from './locales/es.json';
import frJson from './locales/fr.json';

export type Locale = 'es' | 'en' | 'ca' | 'fr';

export type RawDictionary = typeof esJson;

/**
 * Replaces `{param}` tokens inside a template string with actual values.
 */
export function interpolate(template: string, params?: Record<string, string | number>): string {
	if (!params) return template;
	return template.replace(/\{(\w+)\}/g, (match, key) =>
		key in params ? String(params[key]) : match,
	);
}

/**
 * Builds a strongly typed dictionary compatible with existing React components.
 */
function createDictionary(raw: RawDictionary) {
	return {
		...raw,
		fieldLabels: raw.fieldLabels as Record<string, string>,
		oauthContinue: (provider: string) => interpolate(raw.oauthContinue, { provider }),
		mockGenerated: (count: number) => interpolate(raw.mockGenerated, { count }),
		validationRequired: (label: string) => interpolate(raw.validationRequired, { label }),
		validationMin: (label: string, min: number) => interpolate(raw.validationMin, { label, min }),
		pickingInstruction: (orderRef: string, client: string, qty: number) =>
			interpolate(raw.pickingInstruction, { orderRef, client, qty }),
		fulfillmentSubtitle: (completed: number, outgoing: number) =>
			interpolate(raw.fulfillmentSubtitle, { completed, outgoing }),
		kittModelOnline: (provider: string, model: string) =>
			interpolate(raw.kittModelOnline, { provider, model }),
		kittFileLoaded: (name: string, count: number) =>
			interpolate(raw.kittFileLoaded, { name, count }),
		removeFile: (name: string) => interpolate(raw.removeFile, { name }),
	};
}

export const es = createDictionary(esJson);
export const en = createDictionary(enJson);
export const ca = createDictionary(caJson);
export const fr = createDictionary(frJson);

export type StringsDict = typeof es;

export const rawDictionaries: Record<Locale, RawDictionary> = {
	es: esJson,
	en: enJson,
	ca: caJson,
	fr: frJson,
};

export const dictionaries: Record<Locale, StringsDict> = { es, en, ca, fr };

export const LOCALE_LABELS: Record<Locale, string> = {
	es: 'Español',
	en: 'English',
	ca: 'Català',
	fr: 'Français',
};

export const LOCALE_ORDER: Locale[] = ['es', 'en', 'ca', 'fr'];
