[![npm version](https://badge.fury.io/js/fast-iban-js.svg)](https://badge.fury.io/js/fast-iban)
[![Build Status](https://travis-ci.org/EDumdum/iban-js.svg?branch=master)](https://travis-ci.org/EDumdum/iban-js)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/Edumdum/iban-js/master/LICENSE)

# iban-js

[IBAN/BBAN](https://en.wikipedia.org/wiki/International_Bank_Account_Number) validation and conversion following [ISO 13616](https://www.swift.com/standards/data-standards/iban).

## Usage

### In node.js

```js
var IBAN = require('fast-iban');

IBAN.formatIBAN('BG80BNBG96611020345678'); // BG80 BNBG 9661 1020 3456 78

IBAN.validateIBAN('AD12-0001-2030-2003-5910-0100'); // true
IBAN.validateIBAN('AZ21NABZ00000000137010001944'// true
IBAN.validateIBAN('HR6510010051863000160'); // false
IBAN.validateIBAN('AT611904300234573201', true); // true
IBAN.validateIBAN('BG80BNBG96611020345678', false); // true

IBAN.validateBBAN('370400440532013000', 'DE'); // true
IBAN.validateBBAN('0WBK000000007099453', 'GI'); // false
```

## API

### `formatBBAN(rawValue: String, rawCountryCode: String, separator?: String = '-')` -> `String`

Check requirements.  
Returns rawValue formatted as BBAN for rawCountryCode

Validate BBAN before formatting.  
See method `validateBBAN(rawValue, rawCountryCode)` for more informations.

Separator can be customised.  
Default value is `-`.

*Required*
- rawValue must be not `Null`
- rawValue must be of type `String`
- rawCountryCode must be not `Null`
- rawCountryCode must be of type `String`
- rawCountryCode must respect format `^[A-Z]{2}$`    

### `formatIBAN(rawValue: String)`-> `String`

Check requirements.  
Returns rawValue formatted as an IBAN.

*Required*
- rawValue must be not `Null`
- rawValue must be of type `String`

### `generateIBAN(rawValue: String, rawCountryCode: String, validateBBAN?: Boolean = false, formatIBAN?: Boolean = false)` -> `String`

Check requirements.  
Returns value as a valid IBAN using rawValue and rawCountryCode.

If `validateBBAN === true`, validate BBAN before the check digits.  
See method `validateBBAN(rawValue, rawCountryCode)` for more informations.  
Default value is `false`.

If `formatIBAN === true`, format IBAN after generation of the check digits.  
See method `formatIBAN(rawValue)` for more informations.  
Default value is `false`.

*Required*
- rawValue must be not `Null`
- rawValue must be of type `String`
- rawCountryCode must be not `Null`
- rawCountryCode must be of type `String`
- rawCountryCode must respect format `^[A-Z]{2}$`

### `validateBBAN(rawValue: String, rawCountryCode: String)` -> `Boolean`

Check requirements.  
Returns if the BBAN format against ISO 13616 specifications is valid.  
Last update: Augustus 2017  
Source: https://www.swift.com/standards/data-standards/iban

If `rawCountryCode` is unknow, prints warning in console and always returns `true`.

*Required*
- rawValue must be not `Null`
- rawValue must be of type `String`
- rawCountryCode must be not `Null`
- rawCountryCode must be of type `String`
- rawCountryCode must respect format `^[A-Z]{2}$`

### `validateIBAN(rawValue: String, validateBBAN?: Boolean = false)` -> `String`

Check requirements.  
Returns if the IBAN check digits are valid.

If `validateBBAN === true`, validate BBAN before the check digits.  
See method `validateBBAN(rawValue, rawCountryCode)` for more informations.  
Default value is `false`.

*Required*
- rawValue must be not `Null`
- rawValue must be of type `String`
- rawValue must respect format `^[A-Z]{2}[0-9]{2}[0-9A-Z]{11,30}$`