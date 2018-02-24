/**
 * Simple tools used for logging
 */

const buildPrefix = (prefix, options) => {
  if(prefix){
    return `[${prefix}]`
  }
  return ''
}

const createLogger = (prefix, options = {}) => {

  const prefixStr = buildPrefix(prefix, options)

  function log() {
    if (process.env.NODE_ENV === 'production') return;
    const args = Array.prototype.slice.call(arguments)
    args.unshift(prefixStr)
    console.log.apply(console, args)
  }

  function error() {
    if (process.env.NODE_ENV === 'production') return;
    const args = Array.prototype.slice.call(arguments)
    args.unshift(prefixStr)
    console.error.apply(console, args)
  }

  return { log, error }
}

const logger = createLogger()

export {
  logger,
  createLogger
}
