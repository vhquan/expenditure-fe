// See https://svelte.dev/docs/kit/types#app.d.ts

import type { Category } from "$lib/types/category";
import type { Expense } from "$lib/types/expense";
import type { Totals } from "$lib/types/expense";

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		interface PageData {
			categories: Category[];
			recentTransactions: Expense[];
			totals: {
				daily: Totals;
				weekly: Totals;
				monthly: Totals;
			};
		}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
