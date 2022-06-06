'use strict';

const iban = require('../src/iban');

it('iban.formatIBAN - Check inelligible input (null, undefined, not a string)', () => {
    expect(() => iban.formatIBAN(null)).toThrow('Expecting rawValue of type \'string\', found: \'null\'');
    expect(() => iban.formatIBAN(undefined)).toThrow('Expecting rawValue of type \'string\', found: \'undefined\'');
    expect(() => iban.formatIBAN([])).toThrow('Expecting rawValue of type \'string\', found: \'object\'');
});

it('iban.formatIBAN - Check return with elligible value', () => {
    expect(iban.formatIBAN('BE62510007547061')).toBe('BE62 5100 0754 7061');
    expect(iban.formatIBAN('BA391290079401028494')).toBe('BA39 1290 0794 0102 8494');
    expect(iban.formatIBAN('BG80BNBG96611020345678')).toBe('BG80 BNBG 9661 1020 3456 78');
});