const tar = require('tar')
const fs = require('fs')
const zlib = require('zlib')
const axios = require('axios')
const { Readable } = require('stream')
const { TFJS_PATH, TAR_PATH } = require('./constants')
const pkg = require('package.json')

// this hack is required to avoid webpack/rollup/... bundling the required path
const requireFunc =
  typeof __webpack_require__ === 'function' ? __non_webpack_require__ : require

function isLambda() {
  // check for `now dev` environment first
  // because `now dev` sets AWS_LAMBDA_FUNCTION_NAME
  if (process.env.NOW_REGION === 'dev1') return false

  return Boolean(process.env.AWS_LAMBDA_FUNCTION_NAME)
}

async function requireTf() {
  const tf = requireFunc(TFJS_PATH)
  tf.disableDeprecationWarnings()
  return tf
}

async function createTfPromise() {
  // if not in lambda environment, just require the actual package
  // this is useful as a way to bypass tensorflow-lambda in development
  if (!isLambda()) {
    return requireFunc('@tensorflow/tfjs-node')
  }

  // if tfjs-node already exists, just require it
  if (fs.existsSync(TFJS_PATH)) {
    return requireTf()
  }

  // else, create the folder and deflate tfjs-node
  fs.mkdirSync(TFJS_PATH)

  // https://cdn.jsdelivr.net/npm/jlarmstrongiv-tensorflow-lambda@0.0.4/tfjs-node.br
  const response = await axios.get(
    `https://cdn.jsdelivr.net/npm/${pkg.name}@${pkg.version}/tfjs-node.br`,
    { responseType: 'blob' }
  )

  // https://stackoverflow.com/a/62143160
  // const tfjsBrBuffer = Buffer.from(response.data)
  const tfjsBrStream = Readable.from(response.data)

  // unzip tfjs-node
  await new Promise((resolve, reject) => {
    const x = tar.x({ cwd: TFJS_PATH })

    x.on('finish', resolve)
    x.on('error', reject)

    tfjsBrStream.pipe(zlib.createBrotliDecompress()).pipe(x)
  })

  return requireTf()
}

let tfPromise

module.exports = function loadTf() {
  if (!tfPromise) {
    tfPromise = createTfPromise()
  }

  return tfPromise
}
