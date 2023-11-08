export function setProperty (state, params) {
  const key = params.key;
  const data = params.data;
  state[key] =  data;
}


export function clearOneWaiter (state) {
  console.log('Clear OneWaiter!')
  state = false;
  
}
