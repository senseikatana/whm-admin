import {
	dictionaries,
	rawDictionaries,
	interpolate,
	LOCALE_LABELS,
	LOCALE_ORDER,
	type Locale,
	type StringsDict,
	type RawDictionary,
} from './dictionaries';

export {
	dictionaries,
	rawDictionaries,
	interpolate,
	LOCALE_LABELS,
	LOCALE_ORDER,
	type Locale,
	type StringsDict,
	type RawDictionary,
};

export type TranslationKey =
	| keyof Omit<RawDictionary, 'fieldLabels'>
	| `fieldLabels.${keyof RawDictionary['fieldLabels']}`;

/**
 * Creates a translation helper function `t(key, params)` for Astro components and templates.
 *
 * @example
 * ```astro
 * ---
 * import { useTranslations } from '../i18n';
 * const t = useTranslations(Astro.currentLocale || 'es');
 * ---
 * <h1>{t('appName')}</h1>
 * <p>{t('pickingInstruction', { orderRef: 'IN-101', client: 'Repsol', qty: 25 })}</p>
 * <span>{t('fieldLabels.sku')}</span>
 * ```
 */
export function useTranslations(localeInput: string | undefined | null = 'es') {
	const validLocale = (localeInput && localeInput in dictionaries ? localeInput : 'es') as Locale;
	const dict = dictionaries[validLocale];
	const raw = rawDictionaries[validLocale];

	return function t(
		key: TranslationKey,
		params?: Record<string, string | number>,
	): string {
		// Handle nested keys like "fieldLabels.sku"
		if (key.startsWith('fieldLabels.')) {
			const subKey = key.replace('fieldLabels.', '') as keyof RawDictionary['fieldLabels'];
			return raw.fieldLabels[subKey] ?? key;
		}

		const val = (dict as any)[key];

		if (typeof val === 'function') {
			if (params) {
				const template = (raw as any)[key];
				return typeof template === 'string' ? interpolate(template, params) : String(val(params));
			}
			return String(val);
		}

		if (typeof val === 'string') {
			return params ? interpolate(val, params) : val;
		}

		return String(val ?? key);
	};
}

/**
 * Alias for useTranslations for convenience.
 */
export const getTranslator = useTranslations;
