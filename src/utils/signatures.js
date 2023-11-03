/** A Signature symbol that can be used to declare a non-minimized function signature */
export const SIG = Symbol.for('Signature')

/**
 * Enables the retrieval of function or class signatures by defining a custom
 * 'signature' getter on the Function prototype. The signature encapsulates
 * the function name and parameter list, excluding any function body or comments.
 * If a function or class explicitly defines a signature via a unique Symbol key,
 * this predefined signature is returned instead of parsing the source.
 *
 * @example
 * import { SIG } from 'ne-schemata'
 *
 * function example(arg1, arg2) {}
 * example[SIG] = 'example(string, number)'
 * console.log(example.signature); // Outputs: 'example(string, number)'
 *
 * @example
 * class MyClass {
 *   constructor(arg1, arg2) {}
 * }
 * console.log(MyClass.signature); // Outputs: 'class MyClass(arg1, arg2)'
 *
 * The 'signature' getter will strip away any inline or block comments from the
 * signature. It normalizes the signature by trimming and replacing excess whitespace
 * and newlines within the parameter list with a single space, providing a clean
 * representation of the function or class signature.
 *
 * This feature is globally available once `enableSignatures` is invoked. It should
 * be noted that modifying built-in prototypes is generally discouraged as it can
 * lead to unforeseen conflicts, especially in larger code bases or when using
 * third-party libraries.
 *
 * @returns {void} This function does not return a value.
 */
export function enableSignatures() {
  Object.defineProperty(Function.prototype, 'signature', {
    get() {
      // If the function or class has a 'Symbol.for("Signature")' or SIG property, return it
      if (this[SIG]) {
        return this[SIG];
      }

      const source = this.toString();
      let signature = '';

      // Remove single-line and multi-line comments
      const cleanedSource = source
        .replace(/\/\/.*$/gm, '')
        .replace(/\/\*[\s\S]*?\*\//gm, '');

      if (cleanedSource.startsWith('class')) {
        // Match the class name and extend up to the constructor definition
        signature = cleanedSource.match(/class\s+[\w$]+/)[0];
        // Match the constructor and its multi-line parameters
        const constructorMatch = cleanedSource.match(/constructor\s*\(([\s\S]*?)\)\s*{/);
        if (constructorMatch) {
          // Replace all newlines and multiple spaces with a single space
          const params = constructorMatch[1].replace(/(\r\n|\n|\r|\s)+/gm, ' ').trim();
          signature += `(${params})`;
        }
      } else {
        // Match the function signature (excluding the "function" keyword)
        const functionMatch = cleanedSource.match(/(?:function\s+)?([\w$]+)\s*\(([\s\S]*?)\)\s*{/);
        if (functionMatch) {
          // Replace all newlines and multiple spaces with a single space
          const params = functionMatch[2].replace(/(\r\n|\n|\r|\s)+/gm, ' ').trim();
          signature = `function ${functionMatch[1]}(${params})`;
        }
      }

      return signature.trim();
    },
    configurable: true // So that it can be reconfigured or deleted if necessary
  });
}

export default enableSignatures
