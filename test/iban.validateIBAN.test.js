'use strict';

const iban = require('../src/iban');

test('iban.validateIBAN - Check inelligible input (null, undefined, not a string)', () => {
    expect(() => iban.validateIBAN(null)).toThrow('Expecting rawValue of type \'string\', found: \'null\'');
    expect(() => iban.validateIBAN(undefined)).toThrow('Expecting rawValue of type \'string\', found: \'undefined\'');
    expect(() => iban.validateIBAN([])).toThrow('Expecting rawValue of type \'string\', found: \'object\'');
});

test('iban.validateIBAN - Check input value format, excepted /^[A-Z]{2}[0-9]{2}[0-9A-Z]{11,30}$/', () => {
    expect(() => iban.validateIBAN('')).toThrow('Invalid IBAN format; expecting: \'/^[A-Z]{2}[0-9]{2}[0-9A-Z]{11,30}$/\', found: \'\'');
    expect(() => iban.validateIBAN('123a')).toThrow('Invalid IBAN format; expecting: \'/^[A-Z]{2}[0-9]{2}[0-9A-Z]{11,30}$/\', found: \'123a\'');
    expect(() => iban.validateIBAN('AA1234567897898461286321456256253212')).toThrow('Invalid IBAN format; expecting: \'/^[A-Z]{2}[0-9]{2}[0-9A-Z]{11,30}$/\', found: \'AA1234567897898461286321456256253212\'');
});

test('iban.validateIBAN - Check return with eligible value', () => {
    expect(iban.validateIBAN('AL47 2121 1009 0000 0002 3569 8741')).toBe(true);
    expect(iban.validateIBAN('AD12-0001-2030-2003-5910-0100')).toBe(true);
    expect(iban.validateIBAN('AT611904300234573201')).toBe(true);
    expect(iban.validateIBAN('AZ21NABZ00000000137010001944', true)).toBe(true);
    expect(iban.validateIBAN('BH67BMAG00001299123456', false)).toBe(true);
    expect(iban.validateIBAN('BE62510007547061')).toBe(true);
    expect(iban.validateIBAN('BA391290079401028494')).toBe(true);
    expect(iban.validateIBAN('BG80BNBG96611020345678')).toBe(true);
    expect(iban.validateIBAN('HR6510010051863000160')).toBe(false);
    expect(iban.validateIBAN('CY32002001280000001200527600')).toBe(false);
    expect(iban.validateIBAN('CZ8708000000192000145399')).toBe(false);
});

test('iban.validateIBAN - Check return with unknown country code', () => {
    jest.spyOn(console, 'info').mockImplementation();

    expect(iban.validateIBAN('DK50A0400440116243', true)).toBe(false);
    expect(console.info).toHaveBeenCalledWith(expect.stringContaining('Invalid IBAN format: invalid BBAN format for country code \'DK\'; expecting: \'/^[0-9]{14}$/\', found: \'A0400440116243\''));
});

test('iban.validateIBAN - Check return with unknown country code', () => {
    jest.spyOn(console, 'warn').mockImplementation();

    expect(iban.validateIBAN('HH5000400440116243', true)).toBe(false);
    expect(console.warn).toHaveBeenCalledWith(expect.stringContaining('Cannot validate BBAN for country code \'HH\', please ensure that this country code exist or open an issue at https://github.com/EDumdum/iban-js/issues'));
});