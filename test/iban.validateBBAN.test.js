'use strict';

const iban = require('../src/iban');

test('iban.validateBBAN - Check inelligible input (null, undefined, not a string)', () => {
    expect(() => iban.validateBBAN(null, '')).toThrow('Expecting rawValue of type \'string\', found: \'null\'');
    expect(() => iban.validateBBAN(undefined, '')).toThrow('Expecting rawValue of type \'string\', found: \'undefined\'');
    expect(() => iban.validateBBAN([], '')).toThrow('Expecting rawValue of type \'string\', found: \'object\'');
    expect(() => iban.validateBBAN('', null)).toThrow('Expecting rawCountryCode of type \'string\', found: \'null\'');
    expect(() => iban.validateBBAN('', undefined)).toThrow('Expecting rawCountryCode of type \'string\', found: \'undefined\'');
    expect(() => iban.validateBBAN('', [])).toThrow('Expecting rawCountryCode of type \'string\', found: \'object\'');
});

test('iban.validateBBAN - Check input countryCode format, excepted /^[A-Z]{2}$/', () => {
    expect(() => iban.validateBBAN('', '')).toThrow('Invalid country code format; expecting: \'/^[A-Z]{2}$/\', found: \'\'');
    expect(() => iban.validateBBAN('', '123a')).toThrow('Invalid country code format; expecting: \'/^[A-Z]{2}$/\', found: \'123A\'');
    expect(() => iban.validateBBAN('', '-')).toThrow('Invalid country code format; expecting: \'/^[A-Z]{2}$/\', found: \'\'');
});

test('iban.validateBBAN - Check return with eligible value', () => {
    expect(iban.validateBBAN('0040-044011624-3', 'DK')).toBe(true);
    expect(iban.validateBBAN('22 00 22102014568 5', 'EE')).toBe(true);
    expect(iban.validateBBAN('54320388899944', 'FO')).toBe(true);
    expect(iban.validateBBAN('12345600000785', 'FI')).toBe(true);
    expect(iban.validateBBAN('20041010050500013M02606', 'FR')).toBe(true);
    expect(iban.validateBBAN('370400440532013000', 'DE')).toBe(true);
    expect(iban.validateBBAN('0WBK000000007099453', 'GI')).toBe(false);
    expect(iban.validateBBAN('0110125000000001230069', 'GR')).toBe(false);
    expect(iban.validateBBAN('0444987B543210', 'GL')).toBe(false);
});

test('iban.validateBBAN - Check return with unknown country code', () => {
    jest.spyOn(console, 'warn').mockImplementation();

    expect(iban.validateBBAN('117730161111101800000000', 'HH')).toBe(true);
    expect(console.warn).toHaveBeenCalledWith(expect.stringContaining('Cannot validate BBAN for country code \'HH\', please ensure that this country code exist or open an issue at https://github.com/EDumdum/iban-js/issues'));

    expect(iban.validateBBAN('0159260076545510730339', 'WO')).toBe(true);
    expect(console.warn).toHaveBeenCalledWith(expect.stringContaining('Cannot validate BBAN for country code \'WO\', please ensure that this country code exist or open an issue at https://github.com/EDumdum/iban-js/issues'));

    expect(iban.validateBBAN('AIBK93115212345678', 'KK')).toBe(true);
    expect(console.warn).toHaveBeenCalledWith(expect.stringContaining('Cannot validate BBAN for country code \'KK\', please ensure that this country code exist or open an issue at https://github.com/EDumdum/iban-js/issues'));
});