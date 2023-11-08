import numeral from 'numeral';
numeral.register('locale', 'es-es', {
  delimiters: {
      thousands: '.',
      decimal: ','
  },
  abbreviations: {
      thousand: 'k',
      million: 'mm',
      billion: 'b',
      trillion: 't'
  },
  ordinal: function (number) {
      var b = number % 10;
      return (b === 1 || b === 3) ? 'er' :
          (b === 2) ? 'do' :
              (b === 7 || b === 0) ? 'mo' :
                  (b === 8) ? 'vo' :
                      (b === 9) ? 'no' : 'to';
  },
  currency: {
      symbol: '€'
  }
});
//require('numeral/locales/es-es');
numeral.locale('es-es');

export default class FormatNumber {
  static format(number){
    var formatedNumber = numeral(number).format('0,0.00');
    //console.log('formatedNumber: ', formatedNumber);
    //console.log('formatedNumber2: ', formatedNumber.replace(/\,00$/,''));
    var formatedNumber = formatedNumber.replace(/\,00$/,'');
    return formatedNumber;
  }

  static deFormat(number){
    var formatedNumber = numeral(number).format('0.00');
    formatedNumber = formatedNumber.replace(',','.');
    return formatedNumber;
  }
  
  static deFormatBackend(number){
    var formatedNumber = number.replace('.',',');
    return formatedNumber;
  }

  static deFormatBackendN(number) {
    var unformatedNumber = number.replace('.',',');
    return numeral(unformatedNumber).format('0,0');;
  }
}
