'use strict';

const chai = require('chai');
const expect = chai.expect;

/** @namespace describe */
/** @namespace it */

const iban = require('../src/iban');

describe('iban-formatIBAN', function() {
    it('Check inelligible input (null, undefined, not a string)', function() {
        expect(function() { 
            iban.formatIBAN(null); 
        }).to.throw('Expecting rawValue of type \'string\', found: \'null\'');
        expect(function() { 
            iban.formatIBAN(undefined); 
        }).to.throw('Expecting rawValue of type \'string\', found: \'undefined\'');
        expect(function() { 
            iban.formatIBAN([]); 
        }).to.throw('Expecting rawValue of type \'string\', found: \'object\'');
    });

    it('Check return with elligible value', function() {
        expect(iban.formatIBAN('BE62510007547061')).eq('BE62 5100 0754 7061');
        expect(iban.formatIBAN('BA391290079401028494')).eq('BA39 1290 0794 0102 8494');
        expect(iban.formatIBAN('BG80BNBG96611020345678')).eq('BG80 BNBG 9661 1020 3456 78');
    });
});
