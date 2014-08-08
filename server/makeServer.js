var $http = require("http"); 
var $url = require("url");
var $handler = require("../requestHandle");
function start(){
	function onRequest(request, response) {
		
		var postData ="";
		
		var pathname = $url.parse(request.url).pathname;
		
		$handler.handle(pathname,request,response);
		
	}
	$http.createServer(onRequest).listen(8899); 
	console.log("server has start");
}

exports.start = start;
