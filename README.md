# Make Failover   
Making failover images with a blink of an eye


A silent module based on [ImageMagick](https://imagemagick.org) for making failover images with specified properties.



## API

### MakeFailover(width, height, output_path[, options])

### width   
**Type**: _Number_  
Image width, `> 0` and `<= 99999` pixels

### height   
**Type**: _Number_   
Image height, `> 0` and `<= 99999` pixels


### output_path  
**Type**: _String_  
Output file path with extension (`.jpg`, `.png`, `.gif`, `.svg`, ...)


### options.bin
**Type**: _String_    
**Default**: `./bin/convert.exe`  
Path to `converter.exe` file. This binary is not included, you can [download it from here](https://imagemagick.org/script/download.php). 



### options.quality
**Type**: _Number_  
**Default**: `75`  


### options.border_stroke
**Type**: _Number_   
**Default**: : `1`  
Border stroke size


### options.border_color
**Type**: _String_   
**Default**: : `#000000`  


### options.bg_color
**Type**: _String_   
**Default**: : `#ffffff`  





## Usage
```javascript
const path = require('path');
const MakeFailover = require('make-failover');

(async () => {

   let width = 300;
   let height = 250;
   let output = path.join(__dirname, Date.now() + '.jpg')
   
   let failover = await MakeFailover(width, height, output, {
      border_stroke: 20,
      border_color: '#ff9900',
      bg_color: '#00ffbb',
      quality: 90
   }); // => C:/make-failover/1537383269062.jpg

})();
```


