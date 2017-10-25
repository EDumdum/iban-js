'use strict';

const chai = require('chai');
const expect = chai.expect;

/** @namespace describe */
/** @namespace it */

const iban = require('../src/iban');

describe('iban-validateIBAN', function() {
    it('Check inelligible input (null, undefined, not a string)', function() {
        expect(function() { 
            iban.validateIBAN(null); 
        }).to.throw('Expecting rawValue of type \'string\', found: \'null\'');
        expect(function() { 
            iban.validateIBAN(undefined); 
        }).to.throw('Expecting rawValue of type \'string\', found: \'undefined\'');
        expect(function() { 
            iban.validateIBAN([]); 
        }).to.throw('Expecting rawValue of type \'string\', found: \'object\'');
    });
    
    it('Check input value format, excepted /^[A-Z]{2}[0-9]{2}[0-9A-Z]{11,30}$/', function() {
        expect(function() {
            iban.validateIBAN('');
        }).to.throw('Invalid IBAN format; expecting: \'/^[A-Z]{2}[0-9]{2}[0-9A-Z]{11,30}$/\', found: \'\'');
        expect(function() {
            iban.validateIBAN('123a');
        }).to.throw('Invalid IBAN format; expecting: \'/^[A-Z]{2}[0-9]{2}[0-9A-Z]{11,30}$/\', found: \'123a\'');
        expect(function() {
            iban.validateIBAN('AA1234567897898461286321456256253212');
        }).to.throw('Invalid IBAN format; expecting: \'/^[A-Z]{2}[0-9]{2}[0-9A-Z]{11,30}$/\', found: \'AA1234567897898461286321456256253212\'');
    });

    it('Check return with elligible value', function() {
        // Exotic format
        expect(iban.validateIBAN('AL47 2121 1009 0000 0002 3569 8741')).eq(true);
        expect(iban.validateIBAN('AD12-0001-2030-2003-5910-0100')).eq(true);
        expect(iban.validateIBAN('AT611904300234573201')).eq(true);

        // With option
        expect(iban.validateIBAN('AZ21NABZ00000000137010001944', true)).eq(true);
        expect(iban.validateIBAN('BH67BMAG00001299123456', false)).eq(true);
        expect(iban.validateIBAN('DK50A0400440116243', true)).eq(false);
        expect(iban.validateIBAN('HH5000400440116243', true)).eq(false);

        // True
        expect(iban.validateIBAN('BE62510007547061')).eq(true);
        expect(iban.validateIBAN('BA391290079401028494')).eq(true);
        expect(iban.validateIBAN('BG80BNBG96611020345678')).eq(true);

        // False
        expect(iban.validateIBAN('HR6510010051863000160')).eq(false);
        expect(iban.validateIBAN('CY32002001280000001200527600')).eq(false);
        expect(iban.validateIBAN('CZ8708000000192000145399')).eq(false);
    });
});
