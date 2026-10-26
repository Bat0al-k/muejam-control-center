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



// const { formatBankAmount, isValidPaymentAmount, parseBankAmountInput } = require('d:/Work/dash/company-control-center/src/lib/formatters.ts');

// console.log("formatBankAmount tests:");
// console.log("0:", formatBankAmount(0));
// console.log("'0':", formatBankAmount("0"));
// console.log("null:", formatBankAmount(null));
// console.log("undefined:", formatBankAmount(undefined));
// console.log("50:", formatBankAmount(50));
// console.log("12.5:", formatBankAmount(12.5));
// console.log("1250.7:", formatBankAmount(1250.7));
// console.log("50 with USD:", formatBankAmount(50, { currency: "USD" }));

// console.log("\nisValidPaymentAmount tests:");
// console.log("empty '':", isValidPaymentAmount(""));
// console.log("0:", isValidPaymentAmount(0));
// console.log("'0.00':", isValidPaymentAmount("0.00"));
// console.log("null:", isValidPaymentAmount(null));
// console.log("-5:", isValidPaymentAmount(-5));
// console.log("0.01:", isValidPaymentAmount(0.01));
// console.log("50:", isValidPaymentAmount(50));

