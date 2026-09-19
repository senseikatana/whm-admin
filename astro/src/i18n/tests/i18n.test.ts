import { describe, expect, it } from 'bun:test';
import { useTranslations, rawDictionaries, type Locale } from '../index';

describe('i18n System & JSON Dictionaries', () => {
	const locales: Locale[] = ['es', 'en', 'ca', 'fr'];
	const baseKeys = Object.keys(rawDictionaries.es).sort();

	it('should contain all 4 languages with matching keys', () => {
		for (const lang of locales) {
			const keys = Object.keys(rawDictionaries[lang]).sort();
			expect(keys).toEqual(baseKeys);
		}
	});

	it('should contain matching fieldLabels across all 4 languages', () => {
		const baseFieldKeys = Object.keys(rawDictionaries.es.fieldLabels).sort();
		for (const lang of locales) {
			const fieldKeys = Object.keys(rawDictionaries[lang].fieldLabels).sort();
			expect(fieldKeys).toEqual(baseFieldKeys);
		}
	});

	it('should translate static keys in Astro template helper t()', () => {
		const tEs = useTranslations('es');
		const tCa = useTranslations('ca');
		const tEn = useTranslations('en');
		const tFr = useTranslations('fr');

		expect(tEs('inventory')).toBe('Inventario');
		expect(tCa('inventory')).toBe('Inventari');
		expect(tEn('inventory')).toBe('Inventory');
		expect(tFr('inventory')).toBe('Inventaire');
	});

	it('should interpolate dynamic parameters in t()', () => {
		const tEs = useTranslations('es');
		const tCa = useTranslations('ca');

		const esResult = tEs('pickingInstruction' as any, {
			orderRef: 'OUT-2026-100',
			client: 'Repsol',
			qty: 40,
		});
		expect(esResult).toBe('Pedido OUT-2026-100 para Repsol. Recoger 40 unidades.');

		const caResult = tCa('pickingInstruction' as any, {
			orderRef: 'OUT-2026-100',
			client: 'Repsol',
			qty: 40,
		});
		expect(caResult).toBe('Comanda OUT-2026-100 per a Repsol. Recull 40 unitats.');
	});

	it('should resolve nested fieldLabels keys in t()', () => {
		const tEs = useTranslations('es');
		const tCa = useTranslations('ca');
		const tEn = useTranslations('en');

		expect(tEs('fieldLabels.sku')).toBe('SKU');
		expect(tEs('fieldLabels.name')).toBe('Producto');
		expect(tCa('fieldLabels.name')).toBe('Producte');
		expect(tEn('fieldLabels.name')).toBe('Product');
	});

	it('should fallback gracefully to Spanish if locale is invalid', () => {
		const tFallback = useTranslations('de' as any);
		expect(tFallback('inventory')).toBe('Inventario');
	});
});
