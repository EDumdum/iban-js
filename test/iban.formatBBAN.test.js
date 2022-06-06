'use strict';

const iban = require('../src/iban');

test('iban.formatBBAN - Check ineligible input (null, undefined, not a string)', () => {
    expect(() => iban.formatBBAN(null, '')).toThrow('Expecting rawValue of type \'string\', found: \'null\'');
    expect(() => iban.formatBBAN(undefined, '')).toThrow('Expecting rawValue of type \'string\', found: \'undefined\'');
    expect(() => iban.formatBBAN([], '')).toThrow('Expecting rawValue of type \'string\', found: \'object\'');
    expect(() => iban.formatBBAN('', null)).toThrow('Expecting rawCountryCode of type \'string\', found: \'null\'');
    expect(() => iban.formatBBAN('', undefined)).toThrow('Expecting rawCountryCode of type \'string\', found: \'undefined\'');
    expect(() => iban.formatBBAN('', [])).toThrow('Expecting rawCountryCode of type \'string\', found: \'object\'');
});

test('iban.formatBBAN - Check input countryCode format, excepted /^[A-Z]{2}$/', () => {
    expect(() => iban.formatBBAN('', '')).toThrow('Invalid country code format; expecting: \'/^[A-Z]{2}$/\', found: \'\'');
    expect(() => iban.formatBBAN('', '123a')).toThrow('Invalid country code format; expecting: \'/^[A-Z]{2}$/\', found: \'123A\'');
    expect(() => iban.formatBBAN('', '-')).toThrow('Invalid country code format; expecting: \'/^[A-Z]{2}$/\', found: \'\'');
});

test('iban.formatBBAN - Check with invalid BBAN', () => {
    expect(() => iban.formatBBAN('0WBK000000007099453', 'GI')).toThrow('Cannot format BBAN: invalid BBAN format for country code \'GI\'; expecting: \'/^[A-Z]{4}[0-9A-Z]{15}$/\', found: \'0WBK000000007099453\'');
    expect(() => iban.formatBBAN('0110125000000001230069', 'GR')).toThrow('Cannot format BBAN: invalid BBAN format for country code \'GR\'; expecting: \'/^[0-9]{7}[0-9A-Z]{16}$/\', found: \'0110125000000001230069\'');
    expect(() => iban.formatBBAN('0444987B543210', 'GL')).toThrow('Cannot format BBAN: invalid BBAN format for country code \'GL\'; expecting: \'/^[0-9]{14}$/\', found: \'0444987B543210\'');
});

test('iban.formatBBAN - Check return with eligible value', () => {
    expect(iban.formatBBAN('0-0400440-116243', 'DK')).toBe('0040-044011624-3');
    expect(iban.formatBBAN('2200 2210 2014 5685', 'EE')).toBe('22-00-22102014568-5');
    expect(iban.formatBBAN('54320388899944', 'FO')).toBe('5432-038889994-4');
    expect(iban.formatBBAN('12345600000785', 'FI', ' ')).toBe('123 45600000785');
    expect(iban.formatBBAN('20041010050500013M02606', 'FR', '/')).toBe('20041/01005/0500013M026/06');
});

test('iban.formatBBAN - Check return with unknown country code', () => {
    jest.spyOn(console, 'warn').mockImplementation();

    expect(iban.formatBBAN('117730161111101800000000', 'HH')).toBe('117730161111101800000000');
    expect(console.warn).toHaveBeenCalledWith(expect.stringContaining('Cannot format BBAN for country code \'HH\', please ensure that this country code exist or open an issue at https://github.com/EDumdum/iban-js/issues'));
});