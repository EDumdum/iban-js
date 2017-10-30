'use strict';

var iso7064 = require('iso-7064');

var iban = {
    /**
     * Check requirements.
     * Returns rawValue formatted as BBAN for rawCountryCode
     * 
     * Validate BBAN before formatting.
     * See method `validateBBAN(rawValue, rawCountryCode)` for more informations.
     * 
     * Separator can be customised.
     * Default value is `-`.
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
     * @param {*} separator 
     */
    formatBBAN(rawValue, rawCountryCode, separator = '-') {
        const value = stringifyInput(rawValue);
        const countryCode = stringifyInput(rawCountryCode, 'rawCountryCode');

        // Validate country code
        if (!countryCode.match(FORMAT_COUNTRY)) {
            throw new Error('Invalid country code format; expecting: \'' + FORMAT_COUNTRY + '\', found: \'' + countryCode + '\'');
        }

        if (!FORMAT_BBAN.hasOwnProperty(countryCode)) {
            console.warn('Cannot format BBAN for country code \'' + countryCode + '\', please ensure that this country code exist or open an issue at https://github.com/EDumdum/iban-js/issues');
            return value;
        } else if (!value.match(FORMAT_BBAN[countryCode].match)) {
            throw new Error('Cannot format BBAN: invalid BBAN format for country code \'' + countryCode + '\'; expecting: \'' + FORMAT_BBAN[countryCode].match + '\', found: \'' + value + '\'');              
        }

        var lengths = FORMAT_BBAN[countryCode].format.reverse();
        var offset = lengths.pop();
        var result = value.substring(0, offset);

        while (lengths.length > 0) {
            result += separator + value.substring(offset, offset + lengths[lengths.length - 1]);
            offset += lengths.pop();
        }

        return result;
    },

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
    formatIBAN(rawValue) {
        const value = stringifyInput(rawValue);

        return value.split('').reduce((a, b) => a + ((a.length + 1) % 5 === 0 ? ' ' : '') + b);
    },

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
    generateIBAN(rawValue, rawCountryCode, validateBBAN = false, formatIBAN = false) {
        const value = stringifyInput(rawValue);
        const countryCode = stringifyInput(rawCountryCode, 'rawCountryCode');

        // Validate country code
        if (!countryCode.match(FORMAT_COUNTRY)) {
            throw new Error('Invalid country code format; expecting: \'' + FORMAT_COUNTRY + '\', found: \'' + countryCode + '\'');
        }

        // Validate BBAN is needed
        if (validateBBAN) {
            if (!FORMAT_BBAN.hasOwnProperty(countryCode)) {
                console.warn('Cannot validate BBAN for country code \'' + countryCode + '\', please ensure that this country code exist or open an issue at https://github.com/EDumdum/iban-js/issues');
            } else if (!value.match(FORMAT_BBAN[countryCode].match)) {
                throw new Error('Cannot generate IBAN: invalid BBAN format for country code \'' + countryCode + '\'; expecting: \'' + FORMAT_BBAN[countryCode].match + '\', found: \'' + value + '\'');              
            }
        }

        const result = countryCode + ('0' + (98 - iso7064.computeWithoutCheck(value + countryCode + '00'))).slice(-2) + value;

        return formatIBAN ? this.formatIBAN(result) : result;
    },

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
    validateIBAN(rawValue, validateBBAN = false) {
        const value = stringifyInput(rawValue);

        // Validate global IBAN format
        if (!value.match(FORMAT_IBAN)) {
            throw new Error('Invalid IBAN format; expecting: \'' + FORMAT_IBAN + '\', found: \'' + rawValue + '\'');
        }

        // Validate BBAN is needed
        if (validateBBAN) {
            const countryCode = value.substring(0, 2);
            const bban = value.substring(4, value.length);

            if (!FORMAT_BBAN.hasOwnProperty(countryCode)) {
                console.warn('Cannot validate BBAN for country code \'' + countryCode + '\', please ensure that this country code exist or open an issue at https://github.com/EDumdum/iban-js/issues');
            } else if (!bban.match(FORMAT_BBAN[countryCode].match)) {
                console.info('Invalid IBAN format: invalid BBAN format for country code \'' + countryCode + '\'; expecting: \'' + FORMAT_BBAN[countryCode].match + '\', found: \'' + bban + '\'');
                return false;               
            }
        }

        return iso7064.computeWithoutCheck(value.substring(4, value.length) + value.substring(0, 4)) === 1;
    },

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
    validateBBAN(rawValue, rawCountryCode) {
        const value = stringifyInput(rawValue);
        const countryCode = stringifyInput(rawCountryCode, 'rawCountryCode');

        // Validate country code
        if (!countryCode.match(FORMAT_COUNTRY)) {
            throw new Error('Invalid country code format; expecting: \'' + FORMAT_COUNTRY + '\', found: \'' + countryCode + '\'');
        }

        // Check if format is defined for this country code
        if (!FORMAT_BBAN.hasOwnProperty(countryCode)) {
            console.warn('Cannot validate BBAN for country code \'' + countryCode + '\', please ensure that this country code exist or open an issue at https://github.com/EDumdum/iban-js/issues');
            return true;
        }

        return !!value.match(FORMAT_BBAN[countryCode].match);
    }
};

const FORMAT_COUNTRY = /^[A-Z]{2}$/;

const FORMAT_BBAN = { 'AD': { 'format': [4, 4, 12], 'match': /^[0-9]{8}[0-9A-Z]{12}$/ },
    'AE': { 'format': [3, 16], 'match': /^[0-9]{19}$/ },
    'AL': { 'format': [8, 16], 'match': /^[0-9]{8}[0-9A-Z]{16}$/ },
    'AT': { 'format': [5, 11], 'match': /^[0-9]{16}$/ },
    'AZ': { 'format': [4, 20], 'match': /^[A-Z]{4}[0-9A-Z]{20}$/ },
    'BA': { 'format': [3, 3, 8, 2], 'match': /^[0-9]{16}$/ },
    'BE': { 'format': [3, 7, 2], 'match': /^[0-9]{12}$/ },
    'BG': { 'format': [4, 4, 2, 8], 'match': /^[A-Z]{4}[0-9]{4}[0-9]{2}[0-9A-Z]{8}$/ },
    'BH': { 'format': [4, 14], 'match': /^[A-Z]{4}[0-9A-Z]{14}$/ },
    'BR': { 'format': [8, 5, 10, 1, 1], 'match': /^[0-9]{23}[A-Z]{1}[0-9A-Z]{1}$/ },
    'BY': { 'format': [4, 4, 16], 'match': /^[0-9A-Z]{20}[0-9]{4}$/ },
    'CH': { 'format': [5, 12], 'match': /^[0-9]{5}[0-9A-Z]{12}$/ },
    'CR': { 'format': [4, 14], 'match': /^[0-9]{18}$/ },
    'CY': { 'format': [3, 5, 16], 'match': /^[0-9]{8}[0-9A-Z]{16}$/ },
    'CZ': { 'format': [4, 6, 10], 'match': /^[0-9]{20}$/ },
    'DE': { 'format': [8, 10], 'match': /^[0-9]{18}$/ },
    'DK': { 'format': [4, 9, 1], 'match': /^[0-9]{14}$/ },
    'DO': { 'format': [4, 20], 'match': /^[0-9A-Z]{4}[0-9]{20}$/ },
    'EE': { 'format': [2, 2, 11, 1], 'match': /^[0-9]{16}$/ },
    'ES': { 'format': [4, 4, 1, 1, 10], 'match': /^[0-9]{20}$/ },
    'FI': { 'format': [3, 11], 'match': /^[0-9]{14}$/ },
    'FO': { 'format': [4, 9, 1], 'match': /^[0-9]{14}$/ },
    'FR': { 'format': [5, 5, 11, 2], 'match': /^[0-9]{12}[0-9A-Z]{11}$/ },
    'GB': { 'format': [4, 6, 8], 'match': /^[A-Z]{4}[0-9]{6}[0-9]{8}$/ },
    'GE': { 'format': [2, 16], 'match': /^[A-Z]{2}[0-9]{16}$/ },
    'GI': { 'format': [4, 15], 'match': /^[A-Z]{4}[0-9A-Z]{15}$/ },
    'GL': { 'format': [4, 9, 1], 'match': /^[0-9]{14}$/ },
    'GR': { 'format': [3, 4, 16], 'match': /^[0-9]{7}[0-9A-Z]{16}$/ },
    'GT': { 'format': [4, 20], 'match': /^[0-9A-Z]{24}$/ },
    'HR': { 'format': [7, 10], 'match': /^[0-9]{17}$/ },
    'HU': { 'format': [3, 4, 1, 15, 1], 'match': /^[0-9]{24}$/ },
    'IE': { 'format': [4, 6, 8], 'match': /^[A-Z]{4}[0-9]{6}[0-9]{8}$/ },
    'IL': { 'format': [3, 3, 13], 'match': /^[0-9]{19}$/ },
    'IQ': { 'format': [4, 3, 12], 'match': /^[A-Z]{4}[0-9]{3}[0-9]{12}$/ },
    'IS': { 'format': [4, 2, 6, 10], 'match': /^[0-9]{22}$/ },
    'IT': { 'format': [1, 5, 5, 12], 'match': /^[A-Z]{1}[0-9]{5}[0-9]{5}[0-9A-Z]{12}$/ },
    'JO': { 'format': [4, 4, 18], 'match': /^[A-Z]{4}[0-9]{4}[0-9A-Z]{18}$/ },
    'KW': { 'format': [4, 22], 'match': /^[A-Z]{4}[0-9A-Z]{22}$/ },
    'KZ': { 'format': [3, 13], 'match': /^[0-9]{3}[0-9A-Z]{13}$/ },
    'LB': { 'format': [4, 20], 'match': /^[0-9]{4}[0-9A-Z]{20}$/ },
    'LC': { 'format': [4, 24], 'match': /^[A-Z]{4}[0-9A-Z]{24}$/ },
    'LI': { 'format': [5, 12], 'match': /^[0-9]{5}[0-9A-Z]{12}$/ },
    'LT': { 'format': [5, 11], 'match': /^[0-9]{16}$/ },
    'LU': { 'format': [3, 13], 'match': /^[0-9]{3}[0-9A-Z]{13}$/ },
    'LV': { 'format': [4, 13], 'match': /^[A-Z]{4}[0-9A-Z]{13}$/ },
    'MC': { 'format': [5, 5, 11, 2], 'match': /^[0-9]{12}[0-9A-Z]{11}$/ },
    'MD': { 'format': [2, 18], 'match': /^[0-9A-Z]{20}$/ },
    'ME': { 'format': [3, 13, 2], 'match': /^[0-9]{18}$/ },
    'MK': { 'format': [3, 10, 2], 'match': /^[0-9]{5}[0-9A-Z]{10}$/ },
    'MR': { 'format': [5, 5, 11, 2], 'match': /^[0-9]{23}$/ },
    'MT': { 'format': [4, 5, 18], 'match': /^[A-Z]{4}[0-9]{5}[0-9A-Z]{18}$/ },
    'MU': { 'format': [4, 2, 2, 12, 3, 3], 'match': /^[A-Z]{7}[0-9]{2}[0-9]{2}[0-9]{12}[0-9]{3}$/ },
    'NL': { 'format': [4, 10], 'match': /^[A-Z]{4}[0-9]{10}$/ },
    'NO': { 'format': [4, 6, 1], 'match': /^[0-9]{11}$/ },
    'PK': { 'format': [4, 16], 'match': /^[A-Z]{4}[0-9A-Z]{16}$/ },
    'PL': { 'format': [8, 16], 'match': /^[0-9]{24}$/ },
    'PS': { 'format': [4, 21], 'match': /^[A-Z]{4}[0-9A-Z]{21}$/ },
    'PT': { 'format': [4, 4, 11, 2], 'match': /^[0-9]{21}$/ },
    'QA': { 'format': [4, 21], 'match': /^[A-Z]{4}[0-9A-Z]{21}$/ },
    'RO': { 'format': [4, 16], 'match': /^[A-Z]{4}[0-9A-Z]{16}$/ },
    'RS': { 'format': [3, 13, 2], 'match': /^[0-9]{18}$/ },
    'SA': { 'format': [2, 18], 'match': /^[0-9]{2}[0-9A-Z]{18}$/ },
    'SC': { 'format': [4, 2, 2, 16, 3], 'match': /^[A-Z]{7}[0-9]{2}[0-9]{2}[0-9]{16}$/ },
    'SE': { 'format': [3, 16, 1], 'match': /^[0-9]{20}$/ },
    'SI': { 'format': [5, 8, 2], 'match': /^[0-9]{15}$/ },
    'SK': { 'format': [4, 6, 10], 'match': /^[0-9]{20}$/ },
    'SM': { 'format': [1, 5, 5, 12], 'match': /^[A-Z]{1}[0-9]{5}[0-9]{5}[0-9A-Z]{12}$/ },
    'ST': { 'format': [4, 4, 11, 2], 'match': /^[0-9]{21}$/ },
    'SV': { 'format': [4, 20], 'match': /^[A-Z]{4}[0-9]{20}$/ },
    'TL': { 'format': [3, 14, 2], 'match': /^[0-9]{19}$/ },
    'TN': { 'format': [2, 3, 13, 2], 'match': /^[0-9]{20}$/ },
    'TR': { 'format': [5, 1, 16], 'match': /^[0-9]{6}[0-9A-Z]{16}$/ },
    'UA': { 'format': [6, 19], 'match': /^[0-9]{6}[0-9A-Z]{19}$/ },
    'VG': { 'format': [4, 16], 'match': /^[A-Z]{4}[0-9]{16}$/ },
    'XK': { 'format': [4, 10, 2], 'match': /^[0-9]{16}$/ }
};

const FORMAT_IBAN = /^[A-Z]{2}[0-9]{2}[0-9A-Z]{11,30}$/;

function stringifyInput(rawValue, valueName = 'rawValue') {
    if (rawValue !== null && rawValue !== undefined) {
        switch(typeof rawValue) {
        case 'string':
            return rawValue.toUpperCase().replace(/[^0-9A-Z]/g, '');
        default:
            throw new Error('Expecting ' + valueName + ' of type \'string\', found: \'' + (typeof rawValue) + '\'');
        }
    }

    throw new Error('Expecting ' + valueName + ' of type \'string\', found: \'' + rawValue + '\'');
}

module.exports = iban;