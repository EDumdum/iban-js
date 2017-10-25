const data = { 'AD':'4n4n12c', 'AE':'3n16n', 'AL':'8n16c', 'AT':'5n11n', 'AZ':'4a20c', 'BA':'3n3n8n2n', 'BE':'3n7n2n', 'BG':'4a4n2n8c', 'BH':'4a14c', 'BR':'8n5n10n1a1c', 'BY':'4c4n16c', 'CH':'5n12c', 'CR':'4n14n', 'CY':'3n5n16c', 'CZ':'4n6n10n', 'DE':'8n10n', 'DK':'4n9n1n', 'DO':'4c20n', 'EE':'2n2n11n1n', 'ES':'4n4n1n1n10n', 'FI':'3n11n', 'FO':'4n9n1n', 'FR':'5n5n11c2n', 'GB':'4a6n8n', 'GE':'2a16n', 'GI':'4a15c', 'GL':'4n9n1n', 'GR':'3n4n16c', 'GT':'4c20c', 'HR':'7n10n', 'HU':'3n4n1n15n1n', 'IE':'4a6n8n', 'IL':'3n3n13n', 'IQ':'4a3n12n', 'IS':'4n2n6n10n', 'IT':'1a5n5n12c', 'JO':'4a4n18c', 'KW':'4a22c', 'KZ':'3n13c', 'LB':'4n20c', 'LC':'4a24c', 'LI':'5n12c', 'LT':'5n11n', 'LU':'3n13c', 'LV':'4a13c', 'MC':'5n5n11c2n', 'MD':'2c18c', 'ME':'3n13n2n', 'MK':'3n10c2n', 'MR':'5n5n11n2n', 'MT':'4a5n18c', 'MU':'4a2n2n12n3n3a', 'NL':'4a10n', 'NO':'4n6n1n', 'PK':'4a16c', 'PL':'8n16n', 'PS':'4a21c', 'PT':'4n4n11n2n', 'QA':'4a21c', 'RO':'4a16c', 'RS':'3n13n2n', 'SA':'2n18c', 'SC':'4a2n2n16n3a', 'SE':'3n16n1n', 'SI':'5n8n2n', 'SK':'4n6n10n', 'SM':'1a5n5n12c', 'ST':'4n4n11n2n', 'SV':'4a20n', 'TL':'3n14n2n', 'TN':'2n3n13n2n', 'TR':'5n1n16c', 'UA':'6n19c', 'VG':'4a16n', 'XK':'4n10n2n' };

var countries = [];
var format;
var match;

var previous, current;
var final;

for (var key in data) {
    format = data[key].replace(/(.*[0-9])[a-z]/g, '$1').replace(/[a-z]/g, '!').split('!').join(', ');
    match = data[key].match(/[0-9]{1,}[a-z]{1,}/g).map((value) => {
        return { length: parseInt(value.match(/^[0-9]{1,}/)[0]), type: value.match(/[a-z]{1}$/)[0] };
    });

    previous = match[0];
    final = [previous];

    for (var i = 1; i < match.length; ++i) {
        current = match[i];

        if (current.type === previous.type) {
            previous.length += current.length;
        } else {
            final.push(current);
        }
    }

    match = final;

    match = match.map((value) => {
        return `${getType(value.type)}{${value.length}}`;
    }).join('');
    countries.push(`'${key}': { 'format': [${format}], 'match': /^${match}$/ }`);
}

function getType(type) {
    switch (type) {
    case 'a':
        return '[A-Z]';
    case 'c':
        return '[0-9A-Z]';
    case 'n':
        return '[0-9]';
    default:
        throw new Error(`unknow type: ${type}`);
    }
}

console.log('{ ' + countries.join(',\r\n') + ' }');