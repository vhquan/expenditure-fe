// See https://svelte.dev/docs/kit/types#app.d.ts

import type { Category } from "$lib/types/category";
import type { Expense } from "$lib/types/expense";

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		interface PageData {
			categories: Category[];
			recentTransactions: Expense[];
		}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
