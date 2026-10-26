/**
 * Bank Financial Amount Formatting and Validation Utilities
 *
 * Rules:
 * 1. Financial formatting matches banking standards: always uses decimal point '.' followed by two digits (.XX).
 * 2. If there are no decimal places, padded with zeroes (e.g. 50 -> "50.00", 12.5 -> "12.50").
 * 3. Two cases when no amount was entered:
 *    - Default amount is zero: displays "0.00".
 *    - Amount not yet specified: can display "0.00" in input fields as placeholder/guidance,
 *      but MUST NOT be recorded as an actual payment transaction until a valid amount (> 0) is entered.
 * 4. Display/presentation only: does not alter the underlying numeric value stored in the database.
 */

export interface FormatBankAmountOptions {
    /** Whether to include comma separators for thousands (default: true). e.g. "1,250.00" vs "1250.00" */
    useGrouping?: boolean;
    /** Optional currency code or symbol to append/prepend (e.g. "USD" or "$") */
    currency?: string;
    /** Where to place the currency: "prefix" ($ 50.00) or "suffix" (50.00 USD). Default: "suffix" */
    currencyPosition?: "prefix" | "suffix";
    /** Value to return if input is null/undefined/empty and not defaulted to zero. Default: "0.00" */
    defaultIfEmpty?: string;
}

/**
 * Format any numeric or string monetary value to banking standards: "XX.XX".
 * If value is 0 or "0", returns "0.00".
 */
export function formatBankAmount(
    value: number | string | null | undefined,
    options?: FormatBankAmountOptions
): string {
    const {
        useGrouping = true,
        currency,
        currencyPosition = "suffix",
        defaultIfEmpty = "0.00",
    } = options || {};

    if (value === null || value === undefined || value === "") {
        return attachCurrency(defaultIfEmpty, currency, currencyPosition);
    }

    const num = typeof value === "number" ? value : Number(value);

    if (Number.isNaN(num)) {
        return attachCurrency(defaultIfEmpty, currency, currencyPosition);
    }

    // Standard banking representation with exactly two decimal places
    const formatted = num.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
        useGrouping,
    });

    return attachCurrency(formatted, currency, currencyPosition);
}

function attachCurrency(
    amountStr: string,
    currency?: string,
    position: "prefix" | "suffix" = "suffix"
): string {
    if (!currency) return amountStr;
    if (position === "prefix") {
        return `${currency} ${amountStr}`;
    }
    return `${amountStr} ${currency}`;
}

/**
 * Validates whether an entered amount qualifies as an actual payable amount.
 * Transactions must not be recorded for unspecified (empty) or zero (0.00) amounts.
 * Returns true only when amount is a positive number (> 0).
 */
export function isValidPaymentAmount(
    value: number | string | null | undefined
): boolean {
    if (value === null || value === undefined) {
        return false;
    }

    const str = String(value).trim();
    if (str === "" || str === "0" || str === "0.0" || str === "0.00") {
        return false;
    }

    const num = Number(str);
    return !Number.isNaN(num) && num > 0;
}

/**
 * Normalizes payment amounts stored in gateway minor units (cents / piasters)
 * to standard currency units.
 *
 * In Paymob & Stripe, financial amounts are strictly stored in minor units (piasters / cents):
 * - 15000 piasters -> 150.00 EGP
 * - 25000 piasters -> 250.00 EGP
 * - 10000 piasters -> 100.00 EGP
 * - 500 piasters   -> 5.00 EGP
 * - 100 piasters   -> 1.00 EGP
 * - 0              -> 0.00 EGP
 */
export function normalizePaymentAmount(
    amount: number | string | null | undefined,
    _paymentMethod?: string
): number {
    if (amount === null || amount === undefined || amount === "") {
        return 0;
    }
    const num = typeof amount === "number" ? amount : Number(amount);
    if (Number.isNaN(num)) return 0;

    return num / 100;
}

/**
 * Parses user input for bank amounts, normalizing commas and decimals.
 * Returns null if the value is empty or not a valid number.
 */
export function parseBankAmountInput(
    input: string | null | undefined
): number | null {
    if (!input) return null;
    const cleaned = input.replace(/,/g, "").trim();
    if (cleaned === "") return null;
    const num = Number(cleaned);
    return Number.isNaN(num) ? null : num;
}


