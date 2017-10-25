'use strict';

const chai = require('chai');
const expect = chai.expect;

/** @namespace describe */
/** @namespace it */

const iban = require('../src/iban');

describe('iban-formatBBAN', function() {
    it('Check inelligible input (null, undefined, not a string)', function() {
        expect(function() { 
            iban.formatBBAN(null, ''); 
        }).to.throw('Expecting rawValue of type \'string\', found: \'null\'');
        expect(function() { 
            iban.formatBBAN(undefined, ''); 
        }).to.throw('Expecting rawValue of type \'string\', found: \'undefined\'');
        expect(function() { 
            iban.formatBBAN([], ''); 
        }).to.throw('Expecting rawValue of type \'string\', found: \'object\'');
        expect(function() { 
            iban.formatBBAN('', null); 
        }).to.throw('Expecting rawCountryCode of type \'string\', found: \'null\'');
        expect(function() { 
            iban.formatBBAN('', undefined); 
        }).to.throw('Expecting rawCountryCode of type \'string\', found: \'undefined\'');
        expect(function() { 
            iban.formatBBAN('', []); 
        }).to.throw('Expecting rawCountryCode of type \'string\', found: \'object\'');
    });
    
    it('Check input countryCode format, excepted /^[A-Z]{2}$/', function() {
        expect(function() {
            iban.formatBBAN('', '');
        }).to.throw('Invalid country code format; expecting: \'/^[A-Z]{2}$/\', found: \'\'');
        expect(function() {
            iban.formatBBAN('', '123a');
        }).to.throw('Invalid country code format; expecting: \'/^[A-Z]{2}$/\', found: \'123A\'');
        expect(function() {
            iban.formatBBAN('', '-');
        }).to.throw('Invalid country code format; expecting: \'/^[A-Z]{2}$/\', found: \'\'');
    });

    it('Check with invalid BBAN', function() {
        expect(function() {
            iban.formatBBAN('0WBK000000007099453', 'GI');
        }).to.throw('Cannot format BBAN: invalid BBAN format for country code \'GI\'; expecting: \'/^[A-Z]{4}[0-9A-Z]{15}$/\', found: \'0WBK000000007099453\'');
        expect(function() {
            iban.formatBBAN('0110125000000001230069', 'GR');
        }).to.throw('Cannot format BBAN: invalid BBAN format for country code \'GR\'; expecting: \'/^[0-9]{7}[0-9A-Z]{16}$/\', found: \'0110125000000001230069\'');
        expect(function() {
            iban.formatBBAN('0444987B543210', 'GL');
        }).to.throw('Cannot format BBAN: invalid BBAN format for country code \'GL\'; expecting: \'/^[0-9]{14}$/\', found: \'0444987B543210\'');
    });

    it('Check return with elligible value', function() {
        // Exotic formats
        expect(iban.formatBBAN('0-0400440-116243', 'DK')).eq('0040-044011624-3');
        expect(iban.formatBBAN('2200 2210 2014 5685', 'EE')).eq('22-00-22102014568-5');
        expect(iban.formatBBAN('54320388899944', 'FO')).eq('5432-038889994-4');

        // All options possibilities
        expect(iban.formatBBAN('12345600000785', 'FI', ' ')).eq('123 45600000785');
        expect(iban.formatBBAN('20041010050500013M02606', 'FR', '/')).eq('20041/01005/0500013M026/06');

        // Unknow country code
        expect(iban.formatBBAN('117730161111101800000000', 'HH')).eq('117730161111101800000000');
    });
});
