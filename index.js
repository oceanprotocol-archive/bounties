const Twitter = require('twitter');
const config = require('./config.js');
const T = new Twitter(config.twitter);
const axios = require('axios');


function getMoney(event){
  var message = event.text.split(' ');
  var addressIndex = 0;
  for (let i = 0;i < message.length; i++){
    if (message[i].startsWith('0x')){
      addressIndex = i;
      break;
    }
  }
  console.log(message[addressIndex]);
  axios.post(config.faucet_address,{'address':message[addressIndex],'agent':'twitter'})
  .then(function(response){
      T.post('statuses/update',{'status':'@'+event.user.screen_name + ' coins deposited'})
      console.log(response.data.status);
  })
  .catch(function(error){
      if (error.response.status == '500'){
        T.post('statuses/update',{'status':'@'+event.user.screen_name+' '+error.response.data.error}); 
        console.log(error.response.data)
      }
      else {
        T.post('statuses/update',{'status':'@'+event.user.screen_name+', something went wrong.  Please check your wallet address and try again later'}); 
        console.log(error.response.data);
      }
  });  

}


var stream = T.stream('statuses/filter',{track:'@TestOcean'});
stream.on('data',function(event){
  console.log(event.text);
  getMoney(event);
});

stream.on('error',function(error){
  console.log(error);
});
