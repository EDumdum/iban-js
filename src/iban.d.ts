/**
 * Check requirements.
 * Returns rawValue formatted as an IBAN.
 * 
 * Requirements:
 * - rawValue must be not `Null`
 * - rawValue must be of type `String`
 * 
 * @param {*} rawValue 
 */
export function formatIBAN(rawValue: string): string;

/**
 * Check requirements.
 * Returns value as a valid IBAN using rawValue and rawCountryCode.
 * 
 * If `validateBBAN === true`, validate BBAN before the check digits.
 * See method `validateBBAN(rawValue, rawCountryCode)` for more informations.
 * Default value is `false`.
 * 
 * If `formatIBAN === true`, format IBAN after generation of the check digits.
 * See method `formatIBAN(rawValue)` for more informations.
 * Default value is `false`.
 * 
 * Requirements:
 * - rawValue must be not `Null`
 * - rawValue must be of type `String`
 * - rawCountryCode must be not `Null`
 * - rawCountryCode must be of type `String`
 * - rawCountryCode must respect format `^[A-Z]{2}$`
 * 
 * @param {*} rawValue 
 * @param {*} rawCountryCode 
 * @param {*} validateBBAN 
 * @param {*} formatIBAN 
 */
export function generateIBAN(rawValue: string, rawCountryCode: string, validateBBAN?: boolean, formatIBAN?: boolean): string;

/**
 * Check requirements.
 * Returns if the BBAN format against ISO 13616 specifications is valid.
 * Last update: Augustus 2017
 * Source: https://www.swift.com/standards/data-standards/iban
 * 
 * If `rawCountryCode` is unknow, prints warning in console and always returns `true`.
 * 
 * Requirements:
 * - rawValue must be not `Null`
 * - rawValue must be of type `String`
 * - rawCountryCode must be not `Null`
 * - rawCountryCode must be of type `String`
 * - rawCountryCode must respect format `^[A-Z]{2}$`
 * 
 * @param {*} rawValue 
 * @param {*} rawCountryCode 
 */
export function validateBBAN(rawValue: string, rawCountryCode: string): boolean;

/**
 * Check requirements.
 * Returns if the IBAN check digits are valid.
 * 
 * If `validateBBAN === true`, validate BBAN before the check digits.
 * See method `validateBBAN(rawValue, rawCountryCode)` for more informations.
 * Default value is `false`.
 * 
 * Requirements:
 * - rawValue must be not `Null`
 * - rawValue must be of type `String`
 * - rawValue must respect format `^[A-Z]{2}[0-9]{2}[0-9A-Z]{11,30}$`
 * 
 * @param {*} rawValue 
 * @param {*} validateBBAN
 */
export function validateIBAN(rawValue: string, validateBBAN?: boolean): boolean;