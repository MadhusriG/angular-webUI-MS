// Used to reverse the order of objects of each API call to get the latest events on top
app.filter('reverse', function() {
  return function(items) {
	  try{
		  
    return items.slice().reverse();
	  }catch(err){
		  
	  }
  };
});
