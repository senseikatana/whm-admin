import { resolveRoleId } from '../auth/roles';
import type { Operator } from '../types';

const OPERATOR_KEY = 'whm.operator';

export const DEFAULT_OPERATOR: Operator = {
	uid: 'OP-001',
	name: 'Administrador General',
	roleId: 'admin',
};

export const operatorStore = {
	load(): Operator | null {
		if (typeof window === 'undefined') return null;
		try {
			const raw = localStorage.getItem(OPERATOR_KEY);
			if (!raw) return null;
			const parsed = JSON.parse(raw) as Partial<Operator> & { role?: string };
			const operator: Operator = {
				uid: String(parsed.uid ?? DEFAULT_OPERATOR.uid),
				name: String(parsed.name ?? DEFAULT_OPERATOR.name),
				roleId: resolveRoleId(parsed.roleId ?? parsed.role),
			};
			// Sincroniza la cookie para que el middleware de Astro reconozca la sesión
			// y evite el bucle de redirección /dashboard <-> /login.
			document.cookie = `sga_session=${encodeURIComponent(operator.uid)}; path=/; max-age=86400; SameSite=Lax`;
			return operator;
		} catch {
			return null;
		}
	},
	save(operator: Operator): void {
		if (typeof window === 'undefined') return;
		localStorage.setItem(OPERATOR_KEY, JSON.stringify(operator));
		document.cookie = `sga_session=${encodeURIComponent(operator.uid)}; path=/; max-age=86400; SameSite=Lax`;
	},
	clear(): void {
		if (typeof window === 'undefined') return;
		localStorage.removeItem(OPERATOR_KEY);
		document.cookie = 'sga_session=; path=/; max-age=0; SameSite=Lax';
	},
};
