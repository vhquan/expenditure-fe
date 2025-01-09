<script lang="ts">
    import { Chart } from "chart.js/auto";
    import { enhance } from "$app/forms";
    import { onMount } from "svelte";
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

    const monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
    ];

    function formatDate(dateString: string): string {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            return "Invalid date";
        }
        const day = date.getDate();
        const month = monthNames[date.getMonth()];
        const year = date.getFullYear();
        return `${day} ${month}, ${year}`;
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

    let activePeriod = "daily"; // default active tab
    let currentChart: Chart | undefined;

    // Function to generate pie chart
    function createPieChart(period) {
        // Fetch category-wise expenses for the selected period
        // For demonstration, assume data is available in data.totals[period].categoryExpenses
        const expenses = data.totals[period].categoryExpenses;

        const ctx = document.getElementById("pieChart")?.getContext("2d");
        if (ctx) {
            const pieChart = new Chart(ctx, {
                type: "pie",
                data: {
                    labels: Object.keys(expenses),
                    datasets: [
                        {
                            data: Object.values(expenses),
                            backgroundColor: [
                                "rgba(255, 99, 132, 0.2)",
                                "rgba(54, 162, 235, 0.2)",
                                "rgba(255, 206, 86, 0.2)",
                                "rgba(75, 192, 192, 0.2)",
                                "rgba(153, 102, 255, 0.2)",
                            ],
                            borderColor: [
                                "rgba(255, 99, 132, 1)",
                                "rgba(54, 162, 235, 1)",
                                "rgba(255, 206, 86, 1)",
                                "rgba(75, 192, 192, 1)",
                                "rgba(153, 102, 255, 1)",
                            ],
                            borderWidth: 1,
                        },
                    ],
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: "right",
                        },
                    },
                },
            });
            return pieChart;
        }
    }

    // Update the pie chart when the active period changes
    function updatePieChart() {
        // Destroy the previous chart if it exists
        if (currentChart) {
            currentChart.destroy();
        }
        currentChart = createPieChart(activePeriod);
    }

    // Initialize the pie chart on mount
    onMount(() => {
        updatePieChart();
    });
</script>

<div class="container">
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
                            <option value={category._id}>{category.name}</option
                            >
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
    <div class="recent-transactions-widget">
        <!-- style="max-width: 300px; margin-left: 20px;" -->
        <h3>Recent Transactions</h3>
        <ul class="transaction-list">
            {#each data.recentTransactions as transaction}
                <li class="transaction">
                    <div class="transaction-details">
                        <table>
                            <tbody>
                                <tr>
                                    <td
                                        ><p>
                                            {transaction.description}
                                        </p>
                                    </td>
                                    <td>
                                        <p class="transaction-date">
                                            {formatDate(transaction.date)}
                                        </p>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <p class="transaction-category">
                                            {transaction.category.name}
                                        </p>
                                    </td>
                                    <td>
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
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </li>
            {/each}
            {#if data.recentTransactions.length === 0}
                <li class="no-transactions">
                    No recent transactions available.
                </li>
            {/if}
        </ul>
    </div>
    {#if data.totals}
        <!-- Display totals -->
        <!-- Total Income and Expenses Widget -->
        <div class="total-widget">
            <nav>
                <ul class="tabs">
                    <li class={{ tab: true, active: activePeriod === "daily" }}>
                        <a
                            href="#"
                            on:click={(e) => {
                                e.preventDefault();
                                activePeriod = "daily";
                                updatePieChart();
                            }}>Daily</a
                        >
                    </li>
                    <li
                        class={{ tab: true, active: activePeriod === "weekly" }}
                    >
                        <a
                            href="#"
                            on:click={(e) => {
                                e.preventDefault();
                                activePeriod = "weekly";
                                updatePieChart();
                            }}>Weekly</a
                        >
                    </li>
                    <li
                        class={{
                            tab: true,
                            active: activePeriod === "monthly",
                        }}
                    >
                        <a
                            href="#"
                            on:click={(e) => {
                                e.preventDefault();
                                activePeriod = "monthly";
                                updatePieChart();
                            }}>Monthly</a
                        >
                    </li>
                </ul>
            </nav>
            <div class="total-section">
                <h3>Analytics</h3>
                <div class="total-details">
                    <table>
                        <tbody>
                            <tr>
                                <td style="font-style: italic;">Total Income</td
                                >
                                <td style="font-style: italic;"
                                    >Total Expense</td
                                >
                            </tr>
                            <tr>
                                <td class="income-amount"
                                    >{formatAmount(
                                        data.totals[activePeriod].income,
                                        "income",
                                    )}</td
                                >
                                <td class="expense-amount"
                                    >{formatAmount(
                                        data.totals[activePeriod].expense,
                                        "expense",
                                    )}</td
                                >
                            </tr>
                        </tbody>
                    </table>
                </div>
                <canvas id="pieChart" width="400" height="400"></canvas>
            </div>
        </div>
    {/if}
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
        /* max-width: 400px; */
        /* margin: 0 auto; */
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

    .transaction-category {
        font-size: 12px;
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

    /* .income-amount::before {
        content: "⬆ ";
    }

    .expense-amount::before {
        content: "⬇ ";
    } */

    /* Apply to the table element */
    table {
        width: 100%; /* Make the table take full width of the container */
        table-layout: fixed; /* Fix the layout of the table */
    }

    /* Apply to table cells */
    td,
    th {
        overflow: hidden; /* Hide any content that overflows */
        text-overflow: ellipsis; /* Show an ellipsis for overflowed content */
        white-space: nowrap; /* Prevent text from wrapping to a new line */
    }

    /* Target the first td in each row and set text-align to left */
    td:nth-child(1) {
        text-align: left;
    }

    /* Target the second td in each row and set text-align to right */
    td:nth-child(2) {
        text-align: right;
    }

    /* Total in daily, weekly, monthly */
    .total-widget {
        background-color: #fff;
        border: 1px solid #ccc;
        border-radius: 8px;
        padding: 20px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    }

    .total-section {
        margin-bottom: 20px;
    }

    .total-section h4 {
        margin-top: 0;
    }

    .total-section p {
        margin: 5px 0 0 0;
        font-size: 14px;
    }

    .container {
        display: flex;
        justify-content: space-between;
        flex-wrap: nowrap;
    }

    .form-container,
    .recent-transactions-widget,
    .total-widget {
        width: 30%;
        box-sizing: border-box;
    }

    .tabs {
        display: flex;
        list-style: none;
        margin: 0;
        padding: 0;
    }

    .tab {
        flex: 1;
        text-align: center;
    }

    .tab a {
        display: block;
        padding: 10px;
        color: #333;
        text-decoration: none;
        border-bottom: 3px solid transparent;
    }

    .tab.active a {
        border-bottom: 3px solid #007bff;
    }

    .total-widget .total-details {
        margin-bottom: 20px;
    }

    .total-widget canvas {
        max-width: 100%;
    }
</style>
