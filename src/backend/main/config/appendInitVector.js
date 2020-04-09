
const { Transform } = require('stream');

/** 
 * helper class for file encryption
 * allows the initialization vector to be appended to the start of the file stream
 */
class AppendInitVect extends Transform {
  constructor(initVect, opts) {
    super(opts);
    this.initVect = initVect;
    this.appended = false;
  }

  _transform(chunk, encoding, callback) {
    if (!this.appended) {
      this.push(this.initVect);
      this.appended = true;
    }
    this.push(chunk);
    callback();
  }
}

module.exports = AppendInitVect;