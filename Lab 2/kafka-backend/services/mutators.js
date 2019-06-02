const idMutator=function(result){
    let copy=JSON.parse(JSON.stringify(result));
    copy.uid=result._id;
    return copy;
  }   
  const cidMutator=function(result){
    let copy=JSON.parse(JSON.stringify(result));
    copy.cid=result._id;
    return copy;
  }
  const allidMutator=function(result,oldprop,newprop){
    let copy=JSON.parse(JSON.stringify(result));
    copy[newprop]=result[oldprop];
    return copy;
  }

  module.exports={idMutator,cidMutator,allidMutator}