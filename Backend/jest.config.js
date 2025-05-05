export default {
    transform: {},
    extensionsToTreatAsEsm: ['.jsx', '.ts', '.tsx'], // Remove '.js' from this array
    moduleNameMapper: {
      '^(\\.{1,2}/.*)\\.js$': '$1'
    }
  }
  