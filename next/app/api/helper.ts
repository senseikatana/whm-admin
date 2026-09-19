import { NextResponse } from "next/server";
import insforge from "../lib/insforge";

function generateSlug(text: string): string {
	return text
		.toString()
		.toLowerCase()
		.trim()
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "")
		.replace(/[^a-z0-9\s-]/g, "")
		.replace(/[\s_]+/g, "-")
		.replace(/-+/g, "-")
		.replace(/^-+|-+$/g, "")
		.concat("-", Math.random().toString(36).substring(2, 6));
}

export async function handleGet(table: string) {
	try {
		const { data, error } = await insforge.database
			.from(table)
			.select()
			.order("id", { ascending: true });

		if (error) {
			return NextResponse.json({ success: false, error: error.message }, { status: 500 });
		}

		return NextResponse.json({ success: true, data: { items: data ?? [] } });
	} catch (err: unknown) {
		const message = err instanceof Error ? err.message : "Unknown error";
		return NextResponse.json({ success: false, error: message }, { status: 500 });
	}
}

export async function handlePost(table: string, request: Request) {
	try {
		const body = await request.json();

		// Auto-generate slug if not provided
		if (!body.slug) {
			const slugSource =
				body.sku || body.code || body.order_number || body.task_number || body.name || "item";
			body.slug = generateSlug(slugSource);
		}

		// Map camelCase to snake_case for DB
		const mapped = mapToSnakeCase(table, body);

		const { data, error } = await insforge.database.from(table).insert([mapped]);

		if (error) {
			return NextResponse.json({ success: false, error: error.message }, { status: 500 });
		}

		return NextResponse.json({ success: true, data: data?.[0] ?? null });
	} catch (err: unknown) {
		const message = err instanceof Error ? err.message : "Unknown error";
		return NextResponse.json({ success: false, error: message }, { status: 500 });
	}
}

function mapToSnakeCase(table: string, body: Record<string, any>): Record<string, any> {
	const mapped: Record<string, any> = { ...body };

	// Common camelCase → snake_case mappings
	if (mapped.minStock !== undefined) {
		mapped.min_stock = mapped.minStock;
		delete mapped.minStock;
	}
	if (mapped.orderNumber !== undefined) {
		mapped.order_number = mapped.orderNumber;
		delete mapped.orderNumber;
	}
	if (mapped.customerName !== undefined) {
		mapped.customer_name = mapped.customerName;
		delete mapped.customerName;
	}
	if (mapped.totalItems !== undefined) {
		mapped.total_items = mapped.totalItems;
		delete mapped.totalItems;
	}
	if (mapped.totalValue !== undefined) {
		mapped.total_value = mapped.totalValue;
		delete mapped.totalValue;
	}
	if (mapped.taskNumber !== undefined) {
		mapped.task_number = mapped.taskNumber;
		delete mapped.taskNumber;
	}
	if (mapped.assignedTo !== undefined) {
		mapped.assigned_to = mapped.assignedTo;
		delete mapped.assignedTo;
	}
	if (mapped.pickedItems !== undefined) {
		mapped.picked_items = mapped.pickedItems;
		delete mapped.pickedItems;
	}

	return mapped;
}

export async function handlePut(table: string, id: string, request: Request) {
	try {
		const body = await request.json();
		const { data, error } = await insforge.database.from(table).update(body).eq("id", Number(id));

		if (error) {
			return NextResponse.json({ success: false, error: error.message }, { status: 500 });
		}

		return NextResponse.json({ success: true, data: data?.[0] ?? null });
	} catch (err: unknown) {
		const message = err instanceof Error ? err.message : "Unknown error";
		return NextResponse.json({ success: false, error: message }, { status: 500 });
	}
}

export async function handleDelete(table: string, id: string) {
	try {
		const { error } = await insforge.database.from(table).delete().eq("id", Number(id));

		if (error) {
			return NextResponse.json({ success: false, error: error.message }, { status: 500 });
		}

		return NextResponse.json({ success: true });
	} catch (err: unknown) {
		const message = err instanceof Error ? err.message : "Unknown error";
		return NextResponse.json({ success: false, error: message }, { status: 500 });
	}
}
