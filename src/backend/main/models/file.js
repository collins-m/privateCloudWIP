const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');
const config = require('../config/database');

// file schema
const FileSchema = mongoose.Schema({
    
});

// export schema
const File = module.exports = mongoose.model('File', FileSchema);