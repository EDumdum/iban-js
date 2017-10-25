'use strict';

const chai = require('chai');
const expect = chai.expect;

/** @namespace describe */
/** @namespace it */

const iban = require('../src/iban');

describe('iban-validateBBAN', function() {
    it('Check inelligible input (null, undefined, not a string)', function() {
        expect(function() { 
            iban.validateBBAN(null, ''); 
        }).to.throw('Expecting rawValue of type \'string\', found: \'null\'');
        expect(function() { 
            iban.validateBBAN(undefined, ''); 
        }).to.throw('Expecting rawValue of type \'string\', found: \'undefined\'');
        expect(function() { 
            iban.validateBBAN([], ''); 
        }).to.throw('Expecting rawValue of type \'string\', found: \'object\'');
        expect(function() { 
            iban.validateBBAN('', null); 
        }).to.throw('Expecting rawCountryCode of type \'string\', found: \'null\'');
        expect(function() { 
            iban.validateBBAN('', undefined); 
        }).to.throw('Expecting rawCountryCode of type \'string\', found: \'undefined\'');
        expect(function() { 
            iban.validateBBAN('', []); 
        }).to.throw('Expecting rawCountryCode of type \'string\', found: \'object\'');
    });
    
    it('Check input countryCode format, excepted /^[A-Z]{2}$/', function() {
        expect(function() {
            iban.validateBBAN('', '');
        }).to.throw('Invalid country code format; expecting: \'/^[A-Z]{2}$/\', found: \'\'');
        expect(function() {
            iban.validateBBAN('', '123a');
        }).to.throw('Invalid country code format; expecting: \'/^[A-Z]{2}$/\', found: \'123A\'');
        expect(function() {
            iban.validateBBAN('', '-');
        }).to.throw('Invalid country code format; expecting: \'/^[A-Z]{2}$/\', found: \'\'');
    });

    it('Check return with elligible value', function() {
        // Format
        expect(iban.validateBBAN('0040-044011624-3', 'DK')).eq(true);
        expect(iban.validateBBAN('22 00 22102014568 5', 'EE')).eq(true);
        expect(iban.validateBBAN('54320388899944', 'FO')).eq(true);
        
        // True
        expect(iban.validateBBAN('12345600000785', 'FI')).eq(true);
        expect(iban.validateBBAN('20041010050500013M02606', 'FR')).eq(true);
        expect(iban.validateBBAN('370400440532013000', 'DE')).eq(true);

        // False
        expect(iban.validateBBAN('0WBK000000007099453', 'GI')).eq(false);
        expect(iban.validateBBAN('0110125000000001230069', 'GR')).eq(false);
        expect(iban.validateBBAN('0444987B543210', 'GL')).eq(false);

        // Unknow country code :(
        expect(iban.validateBBAN('117730161111101800000000', 'HH')).eq(true);
        expect(iban.validateBBAN('0159260076545510730339', 'WO')).eq(true);
        expect(iban.validateBBAN('AIBK93115212345678', 'KK')).eq(true);
    });
});
