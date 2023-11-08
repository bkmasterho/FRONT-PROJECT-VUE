import Vue from 'vue';


export default class AllErrors {
  static getError(errors){
    var allErrors = errors;
    if (typeof(allErrors) == 'object') {
      for (var errorkey in allErrors) {
        if (allErrors[errorkey]) {
          if (typeof(allErrors[errorkey]) === 'string'){
            Vue.prototype.$awn.alert(allErrors[errorkey]);
          }else{
            AllErrors.getError(allErrors[errorkey]);
          }
        }
      }
    }else if (typeof(allErrors) == 'array') {
      for (const error in allErrors) {
        if (error){
          if (error) {
            if (typeof(error) === 'string'){
              Vue.prototype.$awn.alert(error);
            }else{
              AllErrors.getError(error);
            }
          }
        }
      }
    }else{
      Vue.prototype.$awn.alert(allErrors);
    }
  }

  static verifyField(errors){
    for (var i = 0; i < errors.length; i++) {
      if(errors[i].input == null || errors[i].input == ''){
         Vue.prototype.$awn.alert('Por favor rellene el campo ' + errors[i].label);
         return true;
      }else if(typeof errors[i].input == 'object'){
        if(errors[i].input.value == null || errors[i].input.value == ''){
          Vue.prototype.$awn.alert('Por favor rellene el campo ' + errors[i].label);
          return true;
        }
      }
    }
    return false;
  }
}
