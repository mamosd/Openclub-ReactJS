/**
 * Convenience functions for code splitting teardrop routes
 */

// run a callback after loading a split route
const loadcb = cb => module => cb(null, module.default)

// run a loading error for a split module
const splitError = err => {
  console.error('Dynamic module loading error:', err)
}

export {
  loadcb,
  splitError
}
