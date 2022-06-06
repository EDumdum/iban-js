'use strict';

const iban = require('../src/iban');

test('iban.generateIBAN - Check inelligible input (null, undefined, not a string)', () => {
    expect(() => iban.generateIBAN(null, '')).toThrow('Expecting rawValue of type \'string\', found: \'null\'');
    expect(() => iban.generateIBAN(undefined, '')).toThrow('Expecting rawValue of type \'string\', found: \'undefined\'');
    expect(() => iban.generateIBAN([], '')).toThrow('Expecting rawValue of type \'string\', found: \'object\'');
    expect(() => iban.generateIBAN('', null)).toThrow('Expecting rawCountryCode of type \'string\', found: \'null\'');
    expect(() => iban.generateIBAN('', undefined)).toThrow('Expecting rawCountryCode of type \'string\', found: \'undefined\'');
    expect(() => iban.generateIBAN('', [])).toThrow('Expecting rawCountryCode of type \'string\', found: \'object\'');
});

test('iban.generateIBAN - Check input countryCode format, excepted /^[A-Z]{2}$/', () => {
    expect(() => iban.generateIBAN('', '')).toThrow('Invalid country code format; expecting: \'/^[A-Z]{2}$/\', found: \'\'');
    expect(() => iban.generateIBAN('', '123a')).toThrow('Invalid country code format; expecting: \'/^[A-Z]{2}$/\', found: \'123A\'');
    expect(() => iban.generateIBAN('', '-')).toThrow('Invalid country code format; expecting: \'/^[A-Z]{2}$/\', found: \'\'');
});

test('iban.generateIBAN - Check with invalid BBAN', () => {
    expect(() => iban.generateIBAN('0WBK000000007099453', 'GI', true)).toThrow('Cannot generate IBAN: invalid BBAN format for country code \'GI\'; expecting: \'/^[A-Z]{4}[0-9A-Z]{15}$/\', found: \'0WBK000000007099453\'');
    expect(() => iban.generateIBAN('0110125000000001230069', 'GR', true)).toThrow('Cannot generate IBAN: invalid BBAN format for country code \'GR\'; expecting: \'/^[0-9]{7}[0-9A-Z]{16}$/\', found: \'0110125000000001230069\'');
    expect(() => iban.generateIBAN('0444987B543210', 'GL', true)).toThrow('Cannot generate IBAN: invalid BBAN format for country code \'GL\'; expecting: \'/^[0-9]{14}$/\', found: \'0444987B543210\'');
});

test('iban.generateIBAN - Check return with eligible value', () => {
    expect(iban.generateIBAN('0040-044011624-3', 'DK')).toBe('DK5000400440116243');
    expect(iban.generateIBAN('22 00 22102014568 5', 'EE')).toBe('EE382200221020145685');
    expect(iban.generateIBAN('54320388899944', 'FO')).toBe('FO9754320388899944');
    expect(iban.generateIBAN('12345600000785', 'FI', true, true)).toBe('FI21 1234 5600 0007 85');
    expect(iban.generateIBAN('20041010050500013M02606', 'FR', false, true)).toBe('FR14 2004 1010 0505 0001 3M02 606');
    expect(iban.generateIBAN('370400440532013000', 'DE', true, false)).toBe('DE89370400440532013000');
    expect(iban.generateIBAN('510007547061', 'BE')).toBe('BE62510007547061');
});

test('iban.generateIBAN - Check return with unknown country code', () => {
    jest.spyOn(console, 'warn').mockImplementation();

    expect(iban.generateIBAN('117730161111101800000000', 'HH', true)).toBe('HH81117730161111101800000000');
    expect(console.warn).toHaveBeenCalledWith(expect.stringContaining('Cannot validate BBAN for country code \'HH\', please ensure that this country code exist or open an issue at https://github.com/EDumdum/iban-js/issues'));
});