/*!
 * Make Failover, http://tpkn.me/
 */
const fs = require('fs');
const path = require('path');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

async function makeFailover(output_path, width, height, options = {}){
   if(typeof width !== 'number' || width < 1 || width > 99999){
      throw new Error('No valid width')
   }
   if(typeof height !== 'number' || height < 1 || height > 99999){
      throw new Error('No valid height')
   }
   if(typeof output_path !== 'string'){
      throw new Error(`Output file path is not set`)
   }

   let {
      
      bin = 'convert',
      quality = 75,
      border_stroke = 1,
      border_color = '#000000',
      bg_color = '#ffffff',
      enable_macros = false,

   } = options;

   // Replace macros in filename
   if(enable_macros){
      output_path = replaceMacros(output_path, { 
         width, height, quality, 
         border_stroke, border_color, bg_color 
      });
   }

   // Subtract border's stroke size from overall size 
   let size = `${width - border_stroke * 2}x${height - border_stroke * 2}`;

   await exec(`"${bin}" -size ${size} -quality ${quality} -border ${border_stroke} -bordercolor ${border_color} xc:${bg_color} "${path.normalize(output_path)}"`);

   return output_path;
}

/**
 * Replace macros
 * 
 * @param  {String} str   './test/failover_%size%.jpg'
 * @param  {Object} data  { width, height }
 * @return {String}       './test/failover_300x250.jpg'
 */
function replaceMacros(str, data){
   let parts = path.parse(str);
   let { width, height } = data;

   let dir = parts.dir;
   let filename = parts.base;

   if(filename.indexOf('%width%') != -1){
      filename = filename.replace(/%width%/g, width);
   }

   if(filename.indexOf('%height%') != -1){
      filename = filename.replace(/%height%/g, height);
   }

   if(filename.indexOf('%size%') != -1){
      filename = filename.replace(/%size%/g, width + 'x' + height);
   }

   if(filename.indexOf('%uniq%') != -1){
      filename = filename.replace(/%uniq%/g,  (Math.random() + Math.random() + Math.random() + Math.random() + Math.random() + Date.now()).toString(36).replace('.', ''));
   }

   if(filename.indexOf('%time%') != -1){
      filename = filename.replace(/%time%/g, Date.now());
   }

   return path.join(dir, filename);
}

module.exports = makeFailover;
