import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge conditional class names and resolve Tailwind conflicts.
 * @param {...any} inputs
 * @returns {string}
 */
export const cn = (...inputs) => twMerge(clsx(inputs));

export default cn;
