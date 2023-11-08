export function setProperty (state, params) {
  const key = params.key;
  const data = params.data;
  state[key] =  data;
}

export function updateItem (state, params) {
  const key = params.key;
  const data = params.data;

  var exists = false;

  state[key].map((item, index)=>{
    if(item.rut === data.rut){
      state[key][index] = data;
      exists = true;
    }
  });

  if(!exists) state[key].push(data);
}
