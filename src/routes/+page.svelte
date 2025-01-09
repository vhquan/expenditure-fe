<script lang="ts">
    import { enhance } from "$app/forms";
    import { fade } from "svelte/transition"; // Import Svelte's fade transition
    import type { PageData } from "./$types";

    export let data: PageData;
    export let form;

    let expense = {
        type: form?.expense?.type || "expense",
        amount: form?.expense?.amount || 0,
        description: form?.expense?.description || "",
        date: form?.expense?.date || new Date().toISOString().split("T")[0],
        category: form?.expense?.category || "",
    };

    let selectedCategory = form?.expense?.category || "";
    let showCategoryModal = false; // Controls the visibility of the category creation modal
    let newCategoryName = ""; // Stores the new category name

    function pad(number: number): string {
        return number < 10 ? "0" + number : number.toString();
    }

    function formatDate(dateString: string): string {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            return "Invalid date";
        }
        const day = pad(date.getDate());
        const month = pad(date.getMonth() + 1);
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    }

    function formatAmount(amount: number, type: string): string {
        if (typeof amount !== "number" || isNaN(amount)) {
            return "Invalid amount";
        }
        let sign = type === "expense" ? "-" : "";
        let formattedAmount = Number(amount).toLocaleString("en-US", {
            minimumFractionDigits: type === "expense" ? 2 : 0,
            maximumFractionDigits: type === "expense" ? 2 : 2,
        });
        return `${sign}${formattedAmount} VND`;
    }
</script>

<div class="form-container">
    <h2>Add Expense</h2>
    <form method="POST" use:enhance action="?/createExpense">
        <div class="form-group">
            <label for="type">Type</label>
            <select id="type" name="type" bind:value={expense.type}>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
            </select>
        </div>

        <div class="form-group">
            <label for="amount">Amount</label>
            <input
                id="amount"
                type="number"
                name="amount"
                bind:value={expense.amount}
                min="0"
                step="0.01"
                required
            />
        </div>

        <div class="form-group">
            <label for="description">Description</label>
            <input
                id="description"
                type="text"
                name="description"
                bind:value={expense.description}
                placeholder="Enter a description"
            />
        </div>

        <div class="form-group">
            <label for="date">Date</label>
            <input
                id="date"
                type="date"
                name="date"
                bind:value={expense.date}
                required
            />
        </div>

        <div class="form-group">
            <label for="category">Category</label>
            <div style="display: flex; gap: 10px;">
                <select
                    id="category"
                    name="category"
                    bind:value={selectedCategory}
                    required
                >
                    <option value="">Select a category</option>
                    {#each data.categories as category}
                        <option value={category._id}>{category.name}</option>
                    {/each}
                </select>
                <button
                    type="button"
                    on:click={() => (showCategoryModal = true)}
                    >+ New Category</button
                >
            </div>
        </div>

        <button type="submit">Add Expense</button>
    </form>

    {#if form?.error}
        <p class="error shake" transition:fade>{form.error}</p>
    {/if}

    {#if form?.success}
        <p class="success" transition:fade>{form.success}</p>
    {/if}

    {#if data.categories.length === 0}
        <p>No categories found. Please create a new category.</p>
    {/if}
</div>

<!-- Recent Transactions Widget -->
<div
    class="recent-transactions-widget"
    style="max-width: 400px; margin-left: 20px;"
>
    <h3>Recent Transactions</h3>
    <ul class="transaction-list">
        {#each data.recentTransactions as transaction}
            <li class="transaction">
                <div class="transaction-details">
                    <p class="transaction-date">
                        {formatDate(transaction.date)}
                    </p>
                    <p>
                        {transaction.description}
                    </p>
                    <p>
                        {#if transaction.type === "income"}
                            <span class="income-amount">
                                {formatAmount(
                                    transaction.amount,
                                    transaction.type,
                                )}
                            </span>
                        {:else if transaction.type === "expense"}
                            <span class="expense-amount">
                                {formatAmount(
                                    transaction.amount,
                                    transaction.type,
                                )}
                            </span>
                        {/if}
                    </p>
                </div>
            </li>
        {/each}
        {#if data.recentTransactions.length === 0}
            <li class="no-transactions">No recent transactions available.</li>
        {/if}
    </ul>
</div>

{#if showCategoryModal}
    <div class="category-modal">
        <h3>Create New Category</h3>
        <form method="POST" use:enhance action="?/createCategory">
            <input
                type="text"
                name="name"
                bind:value={newCategoryName}
                placeholder="Enter category name"
            />
            <button type="submit">Create</button>
            <button type="button" on:click={() => (showCategoryModal = false)}
                >Cancel</button
            >
        </form>
        {#if form?.categoryError}
            <p class="error shake" transition:fade>{form.categoryError}</p>
        {/if}
        {#if form?.categorySuccess}
            <p class="success" transition:fade>{form.categorySuccess}</p>
        {/if}
    </div>
{/if}

<style>
    .form-container {
        max-width: 400px;
        margin: 0 auto;
        padding: 20px;
        border: 1px solid #ccc;
        border-radius: 8px;
        background-color: #f9f9f9;
    }
    .form-group {
        margin-bottom: 15px;
    }
    label {
        display: block;
        margin-bottom: 5px;
        font-weight: bold;
    }
    input,
    select,
    button {
        width: 100%;
        padding: 8px;
        border: 1px solid #ccc;
        border-radius: 4px;
    }
    button {
        background-color: #007bff;
        color: white;
        cursor: pointer;
    }
    button:hover {
        background-color: #0056b3;
    }
    .error {
        color: red;
        margin-top: 10px;
    }
    .success {
        color: green;
        margin-top: 10px;
    }
    .category-modal {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }
    .category-modal input {
        margin-bottom: 10px;
    }

    /* Shake animation for errors */
    @keyframes shake {
        0% {
            transform: translateX(0);
        }
        25% {
            transform: translateX(-5px);
        }
        50% {
            transform: translateX(5px);
        }
        75% {
            transform: translateX(-5px);
        }
        100% {
            transform: translateX(0);
        }
    }
    .shake {
        animation: shake 0.5s ease-in-out;
    }

    /* Styles for Recent Transactions Widget */
    .recent-transactions-widget {
        background-color: #fff;
        border: 1px solid #ccc;
        border-radius: 8px;
        padding: 20px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    }

    .transaction-list {
        list-style-type: none;
        padding: 0;
    }

    .transaction {
        display: flex;
        align-items: flex-start;
        padding: 10px 0;
        border-bottom: 1px solid #eee;
    }

    .transaction-details {
        flex: 1;
        margin-left: 20px;
    }

    .transaction-details p {
        margin: 0;
        /* font-size: 14px; */
    }

    .transaction-details strong {
        font-weight: bold;
    }

    .transaction-date {
        font-size: 12px;
        margin-bottom: 5px;
        font-style: italic;
        opacity: 0.8;
    }

    .no-transactions {
        text-align: center;
        color: #888;
        padding: 10px 0;
    }

    .income-amount {
        color: green;
        font-weight: bold;
        font-size: 12px;
    }

    .expense-amount {
        color: red;
        font-weight: bold;
        font-size: 12px;
    }
</style>
