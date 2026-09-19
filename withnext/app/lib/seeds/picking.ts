import type { PickingTask } from "../../interfaces";

export const SEED_PICKING: Omit<PickingTask, "id" | "slug" | "created_at" | "updated_at">[] = [
	{
		task_number: "PICK-001",
		order_number: "PED-2026-001",
		assigned_to: "Carlos Ruiz",
		zone: "A",
		status: "Pendiente",
		total_items: 3,
		picked_items: 0,
	},
	{
		task_number: "PICK-002",
		order_number: "PED-2026-002",
		assigned_to: "María López",
		zone: "B",
		status: "En Proceso",
		total_items: 5,
		picked_items: 2,
	},
	{
		task_number: "PICK-003",
		order_number: "PED-2026-003",
		assigned_to: "Carlos Ruiz",
		zone: "C",
		status: "Pendiente",
		total_items: 2,
		picked_items: 0,
	},
];
