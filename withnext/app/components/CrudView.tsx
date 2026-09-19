"use client";

import {
	Bot,
	CheckSquare,
	Edit,
	Filter,
	Loader2,
	Plus,
	Search,
	Sparkles,
	Square,
	Trash2,
	X,
} from "lucide-react";
import type React from "react";
import { useMemo, useState } from "react";
import type { CrudViewProps } from "../interfaces";
import { callAI } from "../utils/ai-api";

const getStatusColor = (status: string) => {
	const greenStatuses = [
		"OK",
		"Activo",
		"Completado",
		"Disponible",
		"Activa",
		"Completada",
		"Recibido",
		"Despachado",
	];
	const orangeStatuses = [
		"Bajo",
		"Pendiente",
		"En Proceso",
		"En Ruta",
		"Empacando",
		"Picking",
		"Packing",
		"Control de Calidad",
	];
	const redStatuses = ["Crítico", "Inactivo", "Mantenimiento", "Cancelado", "Pausada", "warning"];

	if (greenStatuses.includes(status))
		return "bg-emerald-500/20 text-emerald-400 border border-emerald-550/30";
	if (orangeStatuses.includes(status))
		return "bg-amber-500/20 text-amber-400 border border-amber-550/30";
	if (redStatuses.includes(status)) return "bg-rose-500/20 text-rose-400 border border-rose-550/30";
	return "bg-slate-800 text-slate-400 border border-slate-700/50";
};

export default function CrudView({
	title,
	data,
	fields,
	onSave,
	onDelete,
	onBatchDelete,
	onInject,
	t,
}: CrudViewProps) {
	const [isOpen, setIsOpen] = useState(false);
	const [formData, setFormData] = useState<any>({});
	const [editingId, setEditingId] = useState<number | null>(null);
	const [aiLoading, setAiLoading] = useState(false);

	// Mock popup state
	const [isMockOpen, setIsMockOpen] = useState(false);
	const [mockQuantity, setMockQuantity] = useState(5);

	// Filter state
	const [searchQuery, setSearchQuery] = useState("");
	const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});
	const [showFilters, setShowFilters] = useState(false);

	// Batch selection state
	const [selectedIds, setSelectedIds] = useState<number[]>([]);

	// Get select fields for filter dropdowns
	const selectFields = useMemo(
		() => fields.filter((f) => f.type === "select" && f.options),
		[fields],
	);

	// Get text fields for search
	const textFields = useMemo(() => fields.filter((f) => f.type === "text"), [fields]);

	// Filtered data
	const filteredData = useMemo(() => {
		let result = data;

		// Apply search filter
		if (searchQuery.trim()) {
			const query = searchQuery.toLowerCase();
			result = result.filter((item) =>
				textFields.some((f) =>
					String(item[f.key] || "")
						.toLowerCase()
						.includes(query),
				),
			);
		}

		// Apply dropdown filters
		for (const [key, value] of Object.entries(activeFilters)) {
			if (value) {
				result = result.filter((item) => item[key] === value);
			}
		}

		return result;
	}, [data, searchQuery, activeFilters, textFields]);

	// Selection helpers
	const toggleSelectAll = () => {
		if (selectedIds.length === filteredData.length) {
			setSelectedIds([]);
		} else {
			setSelectedIds(filteredData.map((item) => item.id));
		}
	};

	const toggleSelect = (id: number) => {
		setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
	};

	const clearSelection = () => setSelectedIds([]);

	const handleBatchDelete = () => {
		if (onBatchDelete && confirm(`¿Eliminar ${selectedIds.length} registros seleccionados?`)) {
			onBatchDelete(selectedIds);
			setSelectedIds([]);
		}
	};

	const openForm = (item: any = null) => {
		setEditingId(item ? item.id : null);
		setFormData(
			item ||
				fields.reduce(
					(acc: any, f: any) => ({
						...acc,
						[f.key]: f.type === "number" ? 0 : "",
					}),
					{},
				),
		);
		setIsOpen(true);
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onSave(formData, editingId);
		setIsOpen(false);
	};

	// AI auto-fill handler
	const handleAIFill = async () => {
		setAiLoading(true);
		try {
			const fieldsDesc = fields
				.map((f) => {
					if (f.type === "select") return `${f.key} (opciones: ${f.options?.join(", ")})`;
					if (f.type === "number") return `${f.key} (número)`;
					return `${f.key} (texto)`;
				})
				.join(", ");

			const prompt = `Genera un registro realista para la tabla "${title}" de un almacén/logística.
Campos: ${fieldsDesc}
Responde SOLO con JSON válido, sin markdown, sin explicaciones.
El JSON debe tener exactamente las claves: ${fields.map((f) => f.key).join(", ")}`;

			const response = await callAI(
				prompt,
				"Eres un generador de datos JSON para sistemas de gestión de almacén.",
			);
			const cleaned = response
				.replace(/```json/g, "")
				.replace(/```/g, "")
				.trim();
			const parsed = JSON.parse(cleaned);

			// Merge with form data, keeping existing values
			setFormData((prev: any) => ({ ...prev, ...parsed }));
		} catch (err) {
			console.error("AI fill error:", err);
		} finally {
			setAiLoading(false);
		}
	};

	const hasActiveFilters = searchQuery.trim() || Object.values(activeFilters).some((v) => v);

	return (
		<div className="bg-[#050811] border border-slate-800 rounded-2xl overflow-hidden flex flex-col">
			{/* Batch delete bar */}
			{selectedIds.length > 0 && (
				<div className="bg-indigo-600 text-white px-5 py-3 flex items-center justify-between">
					<div className="flex items-center gap-3">
						<span className="bg-white text-indigo-600 px-2 py-0.5 rounded text-xs font-bold">
							{selectedIds.length}
						</span>
						<span className="text-sm font-semibold">registros seleccionados</span>
					</div>
					<div className="flex items-center gap-2">
						<button
							type="button"
							onClick={clearSelection}
							className="px-3 py-1.5 bg-indigo-700 hover:bg-indigo-800 rounded-lg text-xs font-bold transition"
						>
							Cancelar
						</button>
						<button
							type="button"
							onClick={handleBatchDelete}
							className="px-3 py-1.5 bg-rose-500 hover:bg-rose-600 rounded-lg text-xs font-bold flex items-center gap-1.5 transition"
						>
							<Trash2 size={14} /> Eliminar
						</button>
					</div>
				</div>
			)}

			{/* Header */}
			<div className="p-5 border-b border-slate-800 bg-[#050811]/80">
				<div className="flex flex-wrap justify-between items-center gap-3 mb-4">
					<div>
						<h2 className="text-lg font-black text-white">{title}</h2>
						<p className="text-xs text-slate-400 font-semibold">
							{filteredData.length} registros
							{filteredData.length !== data.length && ` (de ${data.length} totales)`}
						</p>
					</div>
					<div className="flex items-center space-x-3">
						<button
							onClick={() => setIsMockOpen(true)}
							className="px-4 py-2 border border-slate-800 hover:bg-slate-800 rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
							type="button"
						>
							<Sparkles size={14} className="text-indigo-400 animate-pulse" /> Generar Lote Mock
						</button>
						<button
							onClick={() => openForm()}
							className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
							type="button"
						>
							<Plus size={14} /> {t.add}
						</button>
					</div>
				</div>

				{/* Search and filters */}
				<div className="flex flex-wrap items-center gap-3">
					{/* Search input */}
					<div className="relative flex-1 min-w-[200px]">
						<Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
						<input
							type="text"
							placeholder="Buscar..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="w-full bg-[#0b0f19] border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-200 placeholder-slate-500 outline-none focus:border-indigo-500 transition"
						/>
						{searchQuery && (
							<button
								type="button"
								onClick={() => setSearchQuery("")}
								className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
							>
								<X size={14} />
							</button>
						)}
					</div>

					{/* Filter toggle */}
					{selectFields.length > 0 && (
						<button
							type="button"
							onClick={() => setShowFilters(!showFilters)}
							className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition border ${
								showFilters || hasActiveFilters
									? "bg-indigo-600/20 text-indigo-400 border-indigo-500/30"
									: "border-slate-800 hover:bg-slate-800 text-slate-400"
							}`}
						>
							<Filter size={14} /> Filtros
							{hasActiveFilters && (
								<span className="bg-indigo-500 text-white px-1.5 py-0.5 rounded-full text-[10px]">
									{Object.values(activeFilters).filter((v) => v).length + (searchQuery ? 1 : 0)}
								</span>
							)}
						</button>
					)}

					{/* Clear filters */}
					{hasActiveFilters && (
						<button
							type="button"
							onClick={() => {
								setSearchQuery("");
								setActiveFilters({});
							}}
							className="px-3 py-2.5 text-xs font-bold text-slate-400 hover:text-white transition"
						>
							Limpiar
						</button>
					)}
				</div>

				{/* Filter dropdowns */}
				{showFilters && selectFields.length > 0 && (
					<div className="flex flex-wrap gap-3 mt-3 pt-3 border-t border-slate-800/50">
						{selectFields.map((f) => (
							<div key={f.key} className="flex flex-col gap-1">
								<label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
									{f.label}
								</label>
								<select
									value={activeFilters[f.key] || ""}
									onChange={(e) =>
										setActiveFilters((prev) => ({
											...prev,
											[f.key]: e.target.value,
										}))
									}
									className="bg-[#0b0f19] border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 outline-none focus:border-indigo-500"
								>
									<option value="">Todos</option>
									{f.options?.map((opt) => (
										<option key={opt} value={opt}>
											{opt}
										</option>
									))}
								</select>
							</div>
						))}
					</div>
				)}
			</div>

			{/* Table */}
			<div className="overflow-x-auto flex-1">
				<table className="w-full text-left border-collapse">
					<thead>
						<tr className="border-b border-slate-800 bg-[#0b0f19]/50">
							{/* Checkbox header */}
							{onBatchDelete && (
								<th className="py-3 px-4 w-10">
									<button
										type="button"
										onClick={toggleSelectAll}
										className="text-slate-400 hover:text-indigo-400 transition"
									>
										{selectedIds.length === filteredData.length && filteredData.length > 0 ? (
											<CheckSquare size={16} />
										) : (
											<Square size={16} />
										)}
									</button>
								</th>
							)}
							{fields.map((f: any) => (
								<th
									key={f.key}
									className="py-3 px-5 text-xs font-bold text-slate-400 uppercase tracking-wider"
								>
									{f.label}
								</th>
							))}
							<th className="py-3 px-5 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">
								{t.actions}
							</th>
						</tr>
					</thead>
					<tbody>
						{filteredData.length === 0 ? (
							<tr>
								<td
									colSpan={fields.length + 1 + (onBatchDelete ? 1 : 0)}
									className="py-12 text-center text-slate-500 text-xs font-semibold"
								>
									{hasActiveFilters
										? "No se encontraron registros con los filtros aplicados."
										: "No hay registros disponibles. Prueba a generar un lote mock."}
								</td>
							</tr>
						) : (
							filteredData.map((item: any) => (
								<tr
									key={item.id}
									className={`border-b border-slate-900 hover:bg-[#0b0f19]/25 transition duration-150 ${
										selectedIds.includes(item.id) ? "bg-indigo-500/5" : ""
									}`}
								>
									{/* Checkbox */}
									{onBatchDelete && (
										<td className="py-3.5 px-4">
											<button
												type="button"
												onClick={() => toggleSelect(item.id)}
												className="text-slate-400 hover:text-indigo-400 transition"
											>
												{selectedIds.includes(item.id) ? (
													<CheckSquare size={16} className="text-indigo-400" />
												) : (
													<Square size={16} />
												)}
											</button>
										</td>
									)}
									{fields.map((f: any) => (
										<td key={f.key} className="py-3.5 px-5 text-xs font-semibold text-slate-300">
											{f.key === "status" || f.key === "type" ? (
												<span
													className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${getStatusColor(item[f.key])}`}
												>
													{item[f.key]}
												</span>
											) : f.key === "price" || f.key === "totalValue" ? (
												`€${(parseFloat(item[f.key]) || 0).toLocaleString()}`
											) : (
												item[f.key]
											)}
										</td>
									))}
									<td className="py-3.5 px-5 text-right whitespace-nowrap">
										<button
											type="button"
											onClick={() => openForm(item)}
											className="p-1.5 text-slate-400 hover:text-indigo-400 rounded transition mr-1.5"
											title={t.edit}
										>
											<Edit size={14} />
										</button>
										<button
											type="button"
											onClick={() => {
												if (confirm("¿Eliminar este registro?")) onDelete(item.id);
											}}
											className="p-1.5 text-slate-400 hover:text-rose-500 rounded transition"
											title={t.delete}
										>
											<Trash2 size={14} />
										</button>
									</td>
								</tr>
							))
						)}
					</tbody>
				</table>
			</div>

			{/* Mock Quantity Popup */}
			{isMockOpen && (
				<div className="fixed inset-0 bg-[#050811]/85 backdrop-blur-xs flex items-center justify-center z-50 p-4">
					<div className="bg-[#0b0f19] border border-slate-800 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
						<div className="flex justify-between items-center mb-4">
							<h3 className="text-base font-bold text-white flex items-center gap-2">
								<Sparkles size={18} className="text-indigo-400" /> Generar Lote Mock
							</h3>
							<button
								type="button"
								onClick={() => setIsMockOpen(false)}
								className="text-slate-400 hover:text-white transition"
							>
								<X size={18} />
							</button>
						</div>
						<p className="text-xs text-slate-400 mb-4">Selecciona cuántos registros quieres generar.</p>
						<div className="flex items-center gap-3 mb-6">
							<button
								type="button"
								onClick={() => setMockQuantity(Math.max(1, mockQuantity - 5))}
								className="px-3 py-2 bg-[#050811] border border-slate-800 rounded-lg text-slate-300 hover:bg-slate-800 transition text-sm font-bold"
							>
								-5
							</button>
							<button
								type="button"
								onClick={() => setMockQuantity(Math.max(1, mockQuantity - 1))}
								className="px-3 py-2 bg-[#050811] border border-slate-800 rounded-lg text-slate-300 hover:bg-slate-800 transition text-sm font-bold"
							>
								-1
							</button>
							<input
								type="number"
								min={1}
								max={100}
								value={mockQuantity}
								onChange={(e) => setMockQuantity(Math.max(1, Math.min(100, Number(e.target.value))))}
								className="flex-1 bg-[#050811] border border-slate-800 rounded-lg p-2.5 text-center text-white text-lg font-bold outline-none focus:border-indigo-500"
							/>
							<button
								type="button"
								onClick={() => setMockQuantity(Math.min(100, mockQuantity + 1))}
								className="px-3 py-2 bg-[#050811] border border-slate-800 rounded-lg text-slate-300 hover:bg-slate-800 transition text-sm font-bold"
							>
								+1
							</button>
							<button
								type="button"
								onClick={() => setMockQuantity(Math.min(100, mockQuantity + 5))}
								className="px-3 py-2 bg-[#050811] border border-slate-800 rounded-lg text-slate-300 hover:bg-slate-800 transition text-sm font-bold"
							>
								+5
							</button>
						</div>
						<div className="flex flex-wrap gap-2 mb-6">
							{[5, 10, 25, 50, 100].map((qty) => (
								<button
									key={qty}
									type="button"
									onClick={() => setMockQuantity(qty)}
									className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
										mockQuantity === qty
											? "bg-indigo-600 text-white"
											: "bg-[#050811] border border-slate-800 text-slate-400 hover:text-white"
									}`}
								>
									{qty}
								</button>
							))}
						</div>
						<div className="flex justify-end space-x-3">
							<button
								type="button"
								onClick={() => setIsMockOpen(false)}
								className="px-4 py-2 border border-slate-800 hover:bg-slate-800 rounded-xl text-slate-400 text-xs font-bold"
							>
								Cancelar
							</button>
							<button
								type="button"
								onClick={() => {
									onInject(mockQuantity);
									setIsMockOpen(false);
								}}
								className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5"
							>
								<Sparkles size={14} /> Generar {mockQuantity} registros
							</button>
						</div>
					</div>
				</div>
			)}

			{/* CRUD Modal Form */}
			{isOpen && (
				<div className="fixed inset-0 bg-[#050811]/85 backdrop-blur-xs flex items-center justify-center z-50 p-4">
					<form
						onSubmit={handleSubmit}
						className="bg-[#0b0f19] border border-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl"
					>
						<div className="flex justify-between items-center mb-4">
							<h3 className="text-base font-bold text-white">{editingId ? t.edit : t.add} Registro</h3>
							{!editingId && (
								<button
									type="button"
									onClick={handleAIFill}
									disabled={aiLoading}
									className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-400 text-xs font-bold rounded-lg transition disabled:opacity-50"
								>
									{aiLoading ? <Loader2 size={14} className="animate-spin" /> : <Bot size={14} />}
									{aiLoading ? "Generando..." : "Auto-completar IA"}
								</button>
							)}
						</div>
						<div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
							{fields.map((f: any) => (
								<div key={f.key}>
									<label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wide">
										{f.label}
									</label>
									{f.type === "select" ? (
										<select
											value={formData[f.key] || ""}
											onChange={(e) => setFormData({ ...formData, [f.key]: e.target.value })}
											className="w-full bg-[#050811] border border-slate-800 rounded-xl p-3 text-xs text-slate-200 outline-none focus:border-indigo-500"
											required
										>
											<option value="">Selecciona...</option>
											{f.options?.map((opt: string) => (
												<option key={opt} value={opt}>
													{opt}
												</option>
											))}
										</select>
									) : (
										<input
											type={f.type === "number" ? "number" : "text"}
											step={f.key === "price" || f.key === "totalValue" ? "0.01" : "1"}
											value={formData[f.key] !== undefined ? formData[f.key] : ""}
											onChange={(e) =>
												setFormData({
													...formData,
													[f.key]: f.type === "number" ? Number(e.target.value) : e.target.value,
												})
											}
											className="w-full bg-[#050811] border border-slate-800 rounded-xl p-3 text-xs text-slate-200 outline-none focus:border-indigo-500"
											required
										/>
									)}
								</div>
							))}
						</div>
						<div className="flex justify-end space-x-3 mt-6 text-xs font-bold">
							<button
								type="button"
								onClick={() => setIsOpen(false)}
								className="px-4 py-2 border border-slate-800 hover:bg-slate-800 rounded-xl text-slate-400"
							>
								{t.cancel}
							</button>
							<button
								type="submit"
								className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl"
							>
								{t.save}
							</button>
						</div>
					</form>
				</div>
			)}
		</div>
	);
}
