
    class Promise{
      static PENDING='pending'
      static FULFILED='fufilled'
      static REJECTED='rejected'
      static resolvePromise=(promise2,x,resolve,reject,status)=>{
        if(!x) return;
        if(x===promise2){
          throw new Error('xxxxxx')
        }
        if(x instanceof Promise){
          x.then(resolve,reject)
        }else{
          if(status===Promise.FULFILED)resolve(x)
          if(status===Promise.REJECTED)reject(x)
        }
      }
      static resolve(value){
        return new Promise((resolve,reject)=>resolve(value))
      }
      static reject(error){
        return new Promise((resolve,reject)=>reject(error))
      }
      static all(promises){
        const Iterator=Symbol.iterator
        if(!promises[Iterator]) return;
        return new Promise((resolve,reject)=>{
          const resolveData=[];
          const rejectData=[];
          for(let i of promises){
            if(!(i instanceof Promise)){
              i=Promise.resolve(i)
            }
            i
            .then(data=>{
              resolveData.push(data)
            },error=>{
              rejectData.push(error)
            })
          }
          setTimeout(()=>{
            return rejectData.length===0?resolve(resolveData):reject(rejectData[0])
          })
        })
      }
      constructor(outFunction){
        if(typeof(outFunction)!=='function'){
          throw new Error(`${outFunction} is not a function!`)
        } 
        this.init()
        try{
          outFunction(this.resolve.bind(this),this.reject.bind(this))
        }catch(e){
          throw new Error(e)
        }
      }
      init(){
        this.value=null;
        this.error=null;
        this.status=Promise.PENDING;
        this.resolveCallbacks=[];
        this.rejectCallbacks=[];
      }
      resolve(value){
        if(this.status!==Promise.PENDING) return;
        if(value instanceof Promise){
          value.then(this.resolve.bind(this),this.reject.bind(this))
          return;
        }
        this.status=Promise.FULFILED;
        this.value=value;
        this.resolveCallbacks.forEach(callback=>callback(value))
      }
      reject(error){
        if(this.status!==Promise.PENDING) return;
        this.status=Promise.REJECTED;
        this.error=error;
        this.rejectCallbacks.forEach(callback=>callback(error))
      }
      then(onResolve,onReject){
        onResolve=typeof(onResolve)==='function'?onResolve:(value)=>value;
        onReject=typeof(onReject)==='function'?onReject:(error)=>error;
        let promise2;
        return promise2=new Promise((resolve,reject)=>{
          const status=this.status;
          if(status===Promise.FULFILED){
            setTimeout(()=>{
              try{
                let x=onResolve(this.value);
                Promise.resolvePromise(promise2,x,resolve,reject,status)
              }catch(e){
                reject(e)
              }
            })
          }
          if(status===Promise.REJECTED){
            setTimeout(()=>{
              try{
                let x=onReject(this.error)
                Promise.resolvePromise(promise2,x,resolve,reject,status)
              }catch(e){
                reject(e)
              }

            })
          }
          if(status===Promise.PENDING){
            this.resolveCallbacks.push((value)=>{
              setTimeout(()=>{
                try{
                  let x=onResolve(value);
                 Promise.resolvePromise(promise2,x,resolve,reject,status)
                }catch(e){
                  reject(e)
                }
              })
            })
            this.rejectCallbacks.push((error)=>{
              setTimeout(()=>{
                let x=onReject(error)
                Promise.resolvePromise(promise2,x,resolve,reject,status)
              })
            })
          }
        })
      }
      catch(onReject){
        return this.then(null,onReject)
      }
      finally(onFinally){
        if(this.status===Promise.PENDING) return;
        const isError=onFinally && onFinally()
        if((isError instanceof Promise) && isError.error){
          return isError;
        }
        return this
      }
    }
