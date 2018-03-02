
console.log("in");

//变量ascii_char: 存储用于显示图片的字符种类。我们要注意到，这个list的最后一个元素是空格，
//这表示，我们将使用空格来代替原图片中灰度值最高的像素点（在灰度图像中，灰度值最高为255，代表白色，最低为0，代表黑色）。
//第一个元素是$，这表示我们将使用$来代替原图片中灰度值最低的像素点。其余字符依此类推
const ascii_char = "$@&%B#=-. ";
// const ascii_char = "123456789abcdefghijklmnopqrstuvwxyz ";
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext('2d');
const img = document.getElementById("source");
const uploadDom = document.getElementById("fileInput");
const result = document.getElementById("result");
// 修改后的图片宽度
const newWidth = document.getElementById("newWidth");
uploadDom.addEventListener('change',handleFileSelect);

var reader = new FileReader();

function handleFileSelect(evt) {
    var file = evt.currentTarget.files[0];
    reader.onload = function (evt) {
        var src = evt.target.result;
				img.src = src;
        img.onload = function (argument) {
          // console.log(this.width +'----------'+this.height)  //这里就是上传图片的宽和高了
          var data = imgDataToCode(this, newWidth.value);
  				result.width = newWidth;
  				// console.log(result);
  				result.innerHTML = data;
  				// console.log(data.length);
        }

    };
    reader.readAsDataURL(file);

};



function rgbToGrey(r, g, b) {
	var gray = parseInt((19595 * r + 38469 * g + 7472 * b) >> 16);
	var unit = 256.0/ascii_char.length ;
	return ascii_char[parseInt(gray/unit)];
}


function imgDataToCode(img, newWidth) {
	const newHeight = parseInt(newWidth * img.height / img.width);
	// console.log(newWidth, newHeight);
	canvas.width = newWidth;
	canvas.height = newHeight;
	ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, newWidth, newHeight);
	var imgData = ctx.getImageData(0, 0, newWidth, newHeight).data;//读取整张图片的像素。
	var rgbList = [];
	var txt = "";
	for (var i=0 ; i<imgData.length; i+=4) {
		//R - 红色（0-255）
		var red = imgData[i];
		// G - 绿色（0-255）
		var green = imgData[i+1];
		// B - 蓝色（0-255）
		var blue = imgData[i+2];
		// alpha 通道（0-255; 0 是透明的，255 是完全可见的）
		var alpha = imgData[i+3];
		rgbList.push({
			"r" : red,
			"g" : green,
			"b" : blue,
		});
	}
	// console.log(rgbList);

	var i = 0;
	for (;i< newHeight; i++) {
		var j = 0;
		// console.log(i);
		for(; j < newWidth; j++) {
			// console.log(i*width + j);
			var item = rgbList[i*newWidth + j];
			// console.log("1");
			txt += rgbToGrey(item.r, item.g, item.b);
		}
		txt += '\n';
	}
	return txt;
}
