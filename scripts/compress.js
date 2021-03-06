// CAREFUL IF YOU MOVE THIS FILE, the pathResolve breaks
const { resolve: pathResolve } = require('path')
const tar = require('tar')
const fs = require('fs')
const { TFJS_PATH } = require('../constants')
const zlib = require('zlib')

// pathResolve(__dirname, '../tfjs-node')
tar
  .c({ cwd: TFJS_PATH }, ['index.js', 'node_modules'])
  .pipe(
    // https://nodejs.org/api/zlib.html#zlib_class_brotlioptions
    zlib.createBrotliCompress({
      params: {
        [zlib.constants.BROTLI_PARAM_QUALITY]:
          // https://nodejs.org/api/zlib.html#zlib_compressor_options
          zlib.constants.BROTLI_MAX_QUALITY,
      },
    })
  )
  .pipe(fs.createWriteStream(pathResolve(__dirname, '../tfjs-node.br')))
