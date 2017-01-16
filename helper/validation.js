module.exports = {
    isEmail :function(email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    },
    isEmpty : function(data){
     if(typeof(data) == 'undefined' || data === null) {
        return true; 
     }
    if(typeof(data.length) != 'undefined'){
         return data.length == 0;
     }
        var count = 0;
        for(var i in data){
            if(data.hasOwnProperty(i)){
                count ++;
            }
        }
            return count == 0;
    },
    isValidMobileNo :  function(number){
         var phoneno = /^\d{10}$/;  //13 digits with no comma, no spaces, no punctuation and there will be no + sign in front the number
         return phoneno.test(number);
    }
}