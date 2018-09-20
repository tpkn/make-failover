/*!
 * Make Failover, http://tpkn.me/
 */

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const exec = promisify(require('child_process').exec);

/**
 * Replace macros
 * @param  {String} str   './test/failover_%size%.jpg'
 * @param  {Object} data  { width, height }
 * @return {String}       './test/failover_300x250.jpg'
 */
function replaceMacros(str, data){
   let parts = path.parse(str);
   let { width, height } = data;

   let dir = parts.dir;
   let filename = parts.base;

   if(filename.indexOf('%size%') > -1){
      filename = filename.replace('%size%', width + 'x' + height);
   }

   if(filename.indexOf('%uniq%') > -1){
      filename = filename.replace('%uniq%', (Date.now() + Math.random()).toString(36).replace('.', ''));
   }

   if(filename.indexOf('%time%') > -1){
      filename = filename.replace('%time%', Date.now());
   }

   return path.join(dir, filename);
}

/**
 * @param  {Number} width
 * @param  {Number} height
 * @param  {String} output_path
 * @param  {Object} options       { bin, quality, border_stroke, border_color, bg_color }
 * @return {String}               path to the failover file | null
 */
function makeFailover(width, height, output_path, options = {}){
   return new Promise(async (resolve, reject) => {
      let cmd = [];
      let failover_path;

      // Set convert.exe
      let bin = path.join('./bin/', 'convert.exe');
      if(typeof options.bin === 'string' && fs.existsSync(options.bin)){
         bin = options.bin;
      }else if(!fs.existsSync(bin)){
         throw new Error(`no convert.exe file`)
      }

      try {
         // Check if the size is valid (0x0 - 99999x99999)
         if(typeof width !== 'number' || width < 1 || width > 99999){
            throw new Error(`no valid width`)
         }
         if(typeof height !== 'number' || height < 1 || height > 99999){
            throw new Error(`no valid height`)
         }

         // Check if the output file path is set
         if(typeof output_path !== 'string'){
            throw new Error(`${output_path} path is not set`)
         }

         // Check if the output file path is set
         if(typeof output_path !== 'string'){
            throw new Error(`${output_path} path is not set`)
         }

         // Set image quality
         let quality = 75;
         if(typeof options.quality === 'number'){
            quality = options.quality;
         }

         // Set border stroke size
         let border_stroke = 1;
         if(typeof options.border_stroke === 'number' && options.border_stroke >= 0){
            border_stroke = options.border_stroke;
         }
         
         // Add border
         let border_color = '#000000';
         if(typeof options.border_color === 'string' && /^#[a-f0-9]{6}$/i.test(options.border_color)){
            border_color = options.border_color;
         }

         // Set background color
         let bg_color = '#ffffff';
         if(typeof options.bg_color === 'string' && /^#[a-f0-9]{6}$/i.test(options.bg_color)){
            bg_color = options.bg_color;
         }

         // Replce macros in filename
         let enable_macros = false;
         if(typeof options.enable_macros === 'boolean' && options.enable_macros){
            output_path = replaceMacros(output_path, { width, height, quality, border_stroke, border_color, bg_color });
         }

         // Subtract border's stroke size from overall size 
         let size = `${width - border_stroke * 2}x${height - border_stroke * 2}`;

         
         cmd.push(`${bin}`);
         cmd.push(`-size ${size}`);
         cmd.push(`-quality ${quality}`);
         cmd.push(`-border ${border_stroke}`);
         cmd.push(`-bordercolor ${border_color}`);
         cmd.push(`xc:${bg_color}`);
         cmd.push(`${path.normalize(output_path)}`);
         await exec(cmd.join(' '));

         failover_path = output_path;

      } catch(err) {
         console.log(err.message);
      } finally {
         resolve(failover_path);
      }
   })
}

module.exports = makeFailover;
