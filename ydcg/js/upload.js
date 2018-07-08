// var Upload = (function(){
//     var _upload = {};

//     //上传图片
//     _upload.uploadCar = function(){
//         var fileObj=$("input[name='file_upload']")[0];
//         var allowExtention=".jpg,.bmp,.gif,.png";
//         var extention=fileObj.value.substring(fileObj.value.lastIndexOf(".")+1).toLowerCase();
//         if(allowExtention.indexOf(extention)>-1){
//             var formdata = new FormData();
//             formdata.append("file", fileObj.files[0]);
//             $.ajax({ 
//                     url : '/tools/uploadImg', 
//                     type : 'post', 
//                     data : formdata, 
//                     cache : false, 
//                     contentType : false, 
//                     processData : false, 
//                     dataType : "json", 
//                     success : function(data){ 
                            
//                     } 
//                 });
//         }else{
//             alert("仅支持"+allowExtention+"为后缀名的文件!");  
//         }
//     };

//     return _upload;
// })(jQuery, Upload)

// $(function(){

//     //上传图片
//     $("#file_upload").change(function(){
//         Upload.uploadCar();
//     })
// })

//上传图片地址
var picList = [];

$('#file_upload').change(function(){  
	if (!this.files.length) return;
	var files = Array.prototype.slice.call(this.files);
	if (files.length > 60) {
			Uton.tip("最多同时只可上传9张图片");
	      return;
	    }
	files.forEach(function(file, i) {
		if (!/\/(?:jpeg|png|gif)/i.test(file.type)) return;
		
	
        //$.notify.show('图片上传中...', function(){});  
        var fileReader = new FileReader();  
        fileReader.readAsDataURL(file);  
        fileReader.onload = function(event){  
            var result = event.target.result;   //返回的dataURL  
            var image = new Image();  
            image.src = result;  
            image.onload = function(){  //创建一个image对象，给canvas绘制使用  
                var cvs = document.createElement('canvas');  
                var scale = 1;    
                if(this.width > 1000 || this.height > 1000){  //1000只是示例，可以根据具体的要求去设定    
                    if(this.width > this.height){    
                        scale = 1000 / this.width;  
                    }else{    
                        scale = 1000 / this.height;    
                    }    
                }  
                cvs.width = this.width*scale;    
                cvs.height = this.height*scale;     //计算等比缩小后图片宽高  
                var ctx = cvs.getContext('2d');    
                ctx.drawImage(this, 0, 0, cvs.width, cvs.height);     
                              var newImageData = cvs.toDataURL(file.type, 0.8);   //重新生成图片，<span style="font-family: Arial, Helvetica, sans-serif;">fileType为用户选择的图片类型</span>  
                var sendData = newImageData.replace("data:"+file.type+";base64,",'');  
                var urlList = [];
                urlList.push(sendData);
                $("body").mLoading("show");
                $.ajax({ 
                    url : 'http://192.168.1.166:8080/scss/user/saveImageUrl.do',   //接口地址
                    type : 'post',
                    async:false,
                    enctype:"multipart/form-data",
                    data : {
                        headImage: urlList
                    },
                    traditional: true, 
                    //cache : false, 
                    //contentType : false, 
                    //processData : false, 
                    dataType : "json", 
                    success : function(data){
                        $(".upload-add>img").css("display","none");
                        var newImg = '<img src="' + data.realPath + '" style="height:100px;padding:10px">';
                        picList.push(data.absolutePath);
                        $("#upload-img").append(newImg);
                        console.log(data);
                        console.log(picList);
                    } ,
                    complete:function(){
                        $("body").mLoading("hide");
                    }

                });
                // $.post('/user/personalchange',{type:'photo',value:sendData},function(data){  
                //     if(data.code == '200'){  
                //         $('.modify_img').attr('src',newImageData);  
                //         $.notify.close();  
                //     }else{  
                //         $.notify.show(data.message, {placement: 'center'});  
                //     }  
                // });  
            }  
              
        } 
	})
});