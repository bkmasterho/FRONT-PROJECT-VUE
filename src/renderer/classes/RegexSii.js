export default class RegexSii {
  static testRut(number){
    var reg = new RegExp(/^[0-9]{0,9}(-[0-9]{0,9})?$/);

    var reg1 = new RegExp(/\b[A-Z\d]{1,2}(?:-\d{1,4}){2}\b/);
    reg = reg.test(number);
    reg1 = reg1.test(number);

    if(reg || reg1) return true;
    return false;
  }

  static testPhone(number){
    var reg = new RegExp(/^\d+$/);
    if(!reg.test(number)) return false;
    if(number.toString().length < 10) return false;
    return true;
  }
}
