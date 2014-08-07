// JavaScript Document
var $fs = require("fs");
var defaultPath = "./webRoot";
var mime = require("./common/mine").mime;
function handle(pathname,request,response){
	var realPath = defaultPath + pathname;
	$fs.stat(realPath,function(err,stats){
		if(stats === undefined){//如果地址没有找到
			response.writeHead(404, {'Content-Type': 'text/plain'}); 
			response.end();
			return;
		}
		if(realPath.indexOf("favicon") === -1) {//不是favicton.ico的情况
			if(!stats.isDirectory()){//如果不是目录的情况
				var array = realPath.split(".");
				var type = array[array.length-1];
				$fs.exists(realPath, function(exists){  
					if ( !exists ) {  
						response.writeHead(404, {'Content-Type': 'text/plain'});  
						// res.write();  
						response.end();  
					} else {  
						$fs.readFile(realPath, 'binary', function(err, file){  
							if ( err ) {  
								response.writeHead(500, {'Content-Type': 'text/plain'});  
								// res.write();  
								response.end();  
							} else {  
								response.writeHead(200, {'Content-Type': mime[type]});  
								response.write(file, 'binary');  
								response.end();  
							}  
						});  
					}  
				});  
			}else{//目录的情况
				$fs.readdir(realPath,function(err,files){
					var dirArr = [],filesArr = [],resultArr;
					for(var i=0;i<files.length;i++){
						var target = files[i];
						if(pathname ==="/"){
							var stats = $fs.statSync(realPath + target);
						}else{ 
							var stats = $fs.statSync(realPath + "/" + target);
						}
						if(stats.isDirectory()){
							dirArr.push(target);
						}else{
							filesArr.push(target);
						}
					}
					resultArr = dirArr.concat(filesArr);
					if(pathname !== "/"){
						resultArr.unshift(pathname.replace(/\/\w*\/?$/g,"") ? pathname.replace(/\/\w*\/?$/g,"") : "/");
					}
					var body = "<html>"+
						"<head>"+
						"<meta http-equiv='Content-Type' content='text/html; "+
						"charset=utf-8' />"+
						"</head>"+
						"<body>";
					for(var i = 0 ; i < resultArr.length ; i++){
						var target = resultArr[i];
						if(pathname ==="/" || i===0){
							var href = target;
						}else{
							var href = pathname + "/" + target;
						}
						body += "<a href='" + href +"'>"+ target +"</a><br />"		
							
					}
					body += "</body></html>";
					response.writeHead(200, {"Content-Type": "text/html;charset=utf-8"}); 
					response.write(body); 
					response.end();
				});
			}
		}else{//是favicton.ico的情况
			return;
		}
		      
	});
	
}

exports.handle = handle;