# Make Failover [![npm Package](https://img.shields.io/npm/v/make-failover.svg)](https://www.npmjs.org/package/make-failover)
Making failover images with a blink of an eye


A silent module based on [ImageMagick](https://imagemagick.org) for making failover images with specified properties.



## API

```javascript
await MakeFailover(output_path, width, height[, options])
```

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
Path to `convert.exe` file. This binary is not included, but you can [download it from here](https://imagemagick.org/script/download.php). 



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


### options.enable_macros
**Type**: _Boolean_   
**Default**: : `false`  
Enable/disable replacing macros in output file name

| Macros | Result |
| ------ | ------ |
| `%width%` | `300` |
| `%height%` | `250` |
| `%size%` | `300x250` |
| `%time%` | `1537450293541` |
| `%uniq%` | `jmam7jgr0r` |





## Usage
```javascript
const path = require('path');
const MakeFailover = require('make-failover');

let width = 300;
let height = 250;
let output = path.join(__dirname, 'failover_%uniq%.jpg')

MakeFailover(width, height, output, {
   enable_macros: true, 
   border_stroke: 20,
   border_color: '#ff9900',
   bg_color: '#00ffbb',
   quality: 90
})
.then(result => {
   // => C:/make-failover/failover_jmam7jgr0r.jpg
})
.catch(err => {})
```


