'use strict';

const chai = require('chai');
const expect = chai.expect;

/** @namespace describe */
/** @namespace it */

const iban = require('../src/iban');

describe('iban-generateIBAN', function() {
    it('Check inelligible input (null, undefined, not a string)', function() {
        expect(function() { 
            iban.generateIBAN(null, ''); 
        }).to.throw('Expecting rawValue of type \'string\', found: \'null\'');
        expect(function() { 
            iban.generateIBAN(undefined, ''); 
        }).to.throw('Expecting rawValue of type \'string\', found: \'undefined\'');
        expect(function() { 
            iban.generateIBAN([], ''); 
        }).to.throw('Expecting rawValue of type \'string\', found: \'object\'');
        expect(function() { 
            iban.generateIBAN('', null); 
        }).to.throw('Expecting rawCountryCode of type \'string\', found: \'null\'');
        expect(function() { 
            iban.generateIBAN('', undefined); 
        }).to.throw('Expecting rawCountryCode of type \'string\', found: \'undefined\'');
        expect(function() { 
            iban.generateIBAN('', []); 
        }).to.throw('Expecting rawCountryCode of type \'string\', found: \'object\'');
    });
    
    it('Check input countryCode format, excepted /^[A-Z]{2}$/', function() {
        expect(function() {
            iban.generateIBAN('', '');
        }).to.throw('Invalid country code format; expecting: \'/^[A-Z]{2}$/\', found: \'\'');
        expect(function() {
            iban.generateIBAN('', '123a');
        }).to.throw('Invalid country code format; expecting: \'/^[A-Z]{2}$/\', found: \'123A\'');
        expect(function() {
            iban.generateIBAN('', '-');
        }).to.throw('Invalid country code format; expecting: \'/^[A-Z]{2}$/\', found: \'\'');
    });

    it('Check with invalid BBAN', function() {
        expect(function() {
            iban.generateIBAN('0WBK000000007099453', 'GI', true);
        }).to.throw('Cannot generate IBAN: invalid BBAN format for country code \'GI\'; expecting: \'/^[A-Z]{4}[0-9A-Z]{15}$/\', found: \'0WBK000000007099453\'');
        expect(function() {
            iban.generateIBAN('0110125000000001230069', 'GR', true);
        }).to.throw('Cannot generate IBAN: invalid BBAN format for country code \'GR\'; expecting: \'/^[0-9]{7}[0-9A-Z]{16}$/\', found: \'0110125000000001230069\'');
        expect(function() {
            iban.generateIBAN('0444987B543210', 'GL', true);
        }).to.throw('Cannot generate IBAN: invalid BBAN format for country code \'GL\'; expecting: \'/^[0-9]{14}$/\', found: \'0444987B543210\'');
    });

    it('Check return with elligible value', function() {
        // Exotic formats
        expect(iban.generateIBAN('0040-044011624-3', 'DK')).eq('DK5000400440116243');
        expect(iban.generateIBAN('22 00 22102014568 5', 'EE')).eq('EE382200221020145685');
        expect(iban.generateIBAN('54320388899944', 'FO')).eq('FO9754320388899944');

        // All options possibilities
        expect(iban.generateIBAN('12345600000785', 'FI', true, true)).eq('FI21 1234 5600 0007 85');
        expect(iban.generateIBAN('20041010050500013M02606', 'FR', false, true)).eq('FR14 2004 1010 0505 0001 3M02 606');
        expect(iban.generateIBAN('370400440532013000', 'DE', true, false)).eq('DE89370400440532013000');
        expect(iban.generateIBAN('510007547061', 'BE')).eq('BE62510007547061');

        // Unknow country code
        expect(iban.generateIBAN('117730161111101800000000', 'HH', true)).eq('HH81117730161111101800000000');
    });
});
