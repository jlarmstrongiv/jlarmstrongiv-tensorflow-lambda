const tar = require('tar')
const iltorb = require('iltorb')
const fs = require('fs')
const { TFJS_PATH, TAR_PATH } = require('../constants')

tar
  .c({ cwd: TFJS_PATH }, ['index.js', 'node_modules'])
  // defaults to quality 11
  // /** Minimal value for ::BROTLI_PARAM_QUALITY parameter. */
  // #define BROTLI_MIN_QUALITY 0
  // /** Maximal value for ::BROTLI_PARAM_QUALITY parameter. */
  // #define BROTLI_MAX_QUALITY 11
  .pipe(iltorb.compressStream())
  .pipe(iltorb.compressStream())
  .pipe(fs.createWriteStream(TAR_PATH))
