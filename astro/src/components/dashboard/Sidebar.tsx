import { BookOpen, ExternalLink, X } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useI18n } from '../../i18n/LocaleProvider';
import type { ViewKey } from '../../types';

export interface NavItem {
	key: ViewKey;
	label: string;
	icon: LucideIcon;
}

interface SidebarProps {
	items: NavItem[];
	active: ViewKey;
	onNavigate: (view: ViewKey) => void;
	open: boolean;
	onClose: () => void;
	collapsed: boolean;
	canManageCms?: boolean;
}

export function Sidebar({ items, active, onNavigate, open, onClose, collapsed, canManageCms }: SidebarProps) {
	const { S } = useI18n();
	return (
		<>
			{open && (
				<div
					className="fixed inset-0 z-40 bg-gray-900/60 md:hidden"
					onClick={onClose}
					aria-hidden="true"
				/>
			)}
			<aside
				className={`fixed inset-y-0 left-0 z-50 flex h-full flex-col bg-[#0F172A] transition-all md:static md:translate-x-0 ${
					collapsed ? 'md:w-[72px]' : 'md:w-72'
				} w-72 ${open ? 'translate-x-0' : '-translate-x-full'}`}
			>
				<div className={`flex items-center justify-between p-6 ${collapsed ? 'md:justify-center md:px-0' : ''}`}>
					<div className={collapsed ? 'md:hidden' : 'flex items-center gap-3'}>
						<img
							src="/logotipESINSA_R-1-white.png"
							alt="ESINSA"
							className="h-7 w-auto object-contain drop-shadow-[0_0_8px_rgba(59,130,246,0.35)]"
						/>
						<div>
							<h1 className="text-sm font-black text-white tracking-tight leading-none">{S.appName}</h1>
							<p className="text-[9px] font-semibold tracking-wider text-blue-400 uppercase mt-0.5">
								Riu Clar · Tarragona
							</p>
						</div>
					</div>
					{collapsed && (
						<img
							src="/logotipESINSA_R-1-white.png"
							alt="ESINSA"
							className="hidden h-5 w-auto object-contain md:block"
							title={S.appName}
						/>
					)}
					<button
						type="button"
						onClick={onClose}
						aria-label={S.closeMenu}
						className="rounded-lg p-1 text-gray-400 hover:text-white md:hidden"
					>
						<X size={24} />
					</button>
				</div>

				<nav className="flex-1 overflow-y-auto px-4 pb-6 md:px-2">
					{items.map(({ key, label, icon: Icon }) => {
						const isActive = active === key;
						return (
							<button
								key={key}
								type="button"
								onClick={() => onNavigate(key)}
								aria-current={isActive ? 'page' : undefined}
								title={collapsed ? label : undefined}
								className={`mb-1 flex w-full items-center rounded-lg text-left transition-all ${
									collapsed ? 'justify-center px-0 py-2.5' : 'px-4 py-2.5'
								} ${
									isActive
										? 'bg-blue-600 text-white shadow-md'
										: 'text-slate-400 hover:bg-slate-800/80 hover:text-white'
								}`}
							>
								<Icon
									size={18}
									className={isActive ? 'shrink-0 text-white' : 'shrink-0 text-gray-400'}
								/>
								{!collapsed && (
									<span className={`ml-3 text-sm font-medium ${collapsed ? 'hidden' : ''}`}>
										{label}
									</span>
								)}
							</button>
						);
					})}

					{canManageCms && (
						<div className="pt-4 mt-4 border-t border-slate-800">
							<a
								href="/keystatic"
								target="_blank"
								rel="noopener noreferrer"
								className={`flex items-center rounded-xl text-left transition-all ${
									collapsed ? 'justify-center px-0 py-2.5' : 'px-4 py-2.5'
								} text-blue-300 bg-blue-950/40 hover:bg-blue-900/60 hover:text-white border border-blue-800/40 shadow-xs`}
								title={collapsed ? 'Editor CMS (Keystatic)' : undefined}
							>
								<BookOpen size={18} className="shrink-0 text-blue-400" />
								{!collapsed && (
									<div className="ml-3 flex flex-1 items-center justify-between text-xs font-bold uppercase tracking-wider">
										<span>Editor CMS</span>
										<ExternalLink size={13} className="text-blue-400 opacity-80" />
									</div>
								)}
							</a>
						</div>
					)}
				</nav>
			</aside>
		</>
	);
}
