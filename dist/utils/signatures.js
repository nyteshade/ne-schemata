"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.SIG = void 0;
exports.enableSignatures = enableSignatures;
/** A Signature symbol that can be used to declare a non-minimized function signature */
const SIG = exports.SIG = Symbol.for('Signature');

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
function enableSignatures() {
  Object.defineProperty(Function.prototype, 'signature', {
    get() {
      // If the function or class has a 'Symbol.for("Signature")' or SIG property, return it
      if (this[SIG]) {
        return this[SIG];
      }
      const source = this.toString();
      let signature = '';

      // Remove single-line and multi-line comments
      const cleanedSource = source.replace(/\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//gm, '');
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
var _default = exports.default = enableSignatures;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJTSUciLCJleHBvcnRzIiwiU3ltYm9sIiwiZm9yIiwiZW5hYmxlU2lnbmF0dXJlcyIsIk9iamVjdCIsImRlZmluZVByb3BlcnR5IiwiRnVuY3Rpb24iLCJwcm90b3R5cGUiLCJnZXQiLCJzb3VyY2UiLCJ0b1N0cmluZyIsInNpZ25hdHVyZSIsImNsZWFuZWRTb3VyY2UiLCJyZXBsYWNlIiwic3RhcnRzV2l0aCIsIm1hdGNoIiwiY29uc3RydWN0b3JNYXRjaCIsInBhcmFtcyIsInRyaW0iLCJmdW5jdGlvbk1hdGNoIiwiY29uZmlndXJhYmxlIiwiX2RlZmF1bHQiLCJkZWZhdWx0Il0sInNvdXJjZXMiOlsiLi4vLi4vc3JjL3V0aWxzL3NpZ25hdHVyZXMuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLyoqIEEgU2lnbmF0dXJlIHN5bWJvbCB0aGF0IGNhbiBiZSB1c2VkIHRvIGRlY2xhcmUgYSBub24tbWluaW1pemVkIGZ1bmN0aW9uIHNpZ25hdHVyZSAqL1xuZXhwb3J0IGNvbnN0IFNJRyA9IFN5bWJvbC5mb3IoJ1NpZ25hdHVyZScpXG5cbi8qKlxuICogRW5hYmxlcyB0aGUgcmV0cmlldmFsIG9mIGZ1bmN0aW9uIG9yIGNsYXNzIHNpZ25hdHVyZXMgYnkgZGVmaW5pbmcgYSBjdXN0b21cbiAqICdzaWduYXR1cmUnIGdldHRlciBvbiB0aGUgRnVuY3Rpb24gcHJvdG90eXBlLiBUaGUgc2lnbmF0dXJlIGVuY2Fwc3VsYXRlc1xuICogdGhlIGZ1bmN0aW9uIG5hbWUgYW5kIHBhcmFtZXRlciBsaXN0LCBleGNsdWRpbmcgYW55IGZ1bmN0aW9uIGJvZHkgb3IgY29tbWVudHMuXG4gKiBJZiBhIGZ1bmN0aW9uIG9yIGNsYXNzIGV4cGxpY2l0bHkgZGVmaW5lcyBhIHNpZ25hdHVyZSB2aWEgYSB1bmlxdWUgU3ltYm9sIGtleSxcbiAqIHRoaXMgcHJlZGVmaW5lZCBzaWduYXR1cmUgaXMgcmV0dXJuZWQgaW5zdGVhZCBvZiBwYXJzaW5nIHRoZSBzb3VyY2UuXG4gKlxuICogQGV4YW1wbGVcbiAqIGltcG9ydCB7IFNJRyB9IGZyb20gJ25lLXNjaGVtYXRhJ1xuICpcbiAqIGZ1bmN0aW9uIGV4YW1wbGUoYXJnMSwgYXJnMikge31cbiAqIGV4YW1wbGVbU0lHXSA9ICdleGFtcGxlKHN0cmluZywgbnVtYmVyKSdcbiAqIGNvbnNvbGUubG9nKGV4YW1wbGUuc2lnbmF0dXJlKTsgLy8gT3V0cHV0czogJ2V4YW1wbGUoc3RyaW5nLCBudW1iZXIpJ1xuICpcbiAqIEBleGFtcGxlXG4gKiBjbGFzcyBNeUNsYXNzIHtcbiAqICAgY29uc3RydWN0b3IoYXJnMSwgYXJnMikge31cbiAqIH1cbiAqIGNvbnNvbGUubG9nKE15Q2xhc3Muc2lnbmF0dXJlKTsgLy8gT3V0cHV0czogJ2NsYXNzIE15Q2xhc3MoYXJnMSwgYXJnMiknXG4gKlxuICogVGhlICdzaWduYXR1cmUnIGdldHRlciB3aWxsIHN0cmlwIGF3YXkgYW55IGlubGluZSBvciBibG9jayBjb21tZW50cyBmcm9tIHRoZVxuICogc2lnbmF0dXJlLiBJdCBub3JtYWxpemVzIHRoZSBzaWduYXR1cmUgYnkgdHJpbW1pbmcgYW5kIHJlcGxhY2luZyBleGNlc3Mgd2hpdGVzcGFjZVxuICogYW5kIG5ld2xpbmVzIHdpdGhpbiB0aGUgcGFyYW1ldGVyIGxpc3Qgd2l0aCBhIHNpbmdsZSBzcGFjZSwgcHJvdmlkaW5nIGEgY2xlYW5cbiAqIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBmdW5jdGlvbiBvciBjbGFzcyBzaWduYXR1cmUuXG4gKlxuICogVGhpcyBmZWF0dXJlIGlzIGdsb2JhbGx5IGF2YWlsYWJsZSBvbmNlIGBlbmFibGVTaWduYXR1cmVzYCBpcyBpbnZva2VkLiBJdCBzaG91bGRcbiAqIGJlIG5vdGVkIHRoYXQgbW9kaWZ5aW5nIGJ1aWx0LWluIHByb3RvdHlwZXMgaXMgZ2VuZXJhbGx5IGRpc2NvdXJhZ2VkIGFzIGl0IGNhblxuICogbGVhZCB0byB1bmZvcmVzZWVuIGNvbmZsaWN0cywgZXNwZWNpYWxseSBpbiBsYXJnZXIgY29kZSBiYXNlcyBvciB3aGVuIHVzaW5nXG4gKiB0aGlyZC1wYXJ0eSBsaWJyYXJpZXMuXG4gKlxuICogQHJldHVybnMge3ZvaWR9IFRoaXMgZnVuY3Rpb24gZG9lcyBub3QgcmV0dXJuIGEgdmFsdWUuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBlbmFibGVTaWduYXR1cmVzKCkge1xuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoRnVuY3Rpb24ucHJvdG90eXBlLCAnc2lnbmF0dXJlJywge1xuICAgIGdldCgpIHtcbiAgICAgIC8vIElmIHRoZSBmdW5jdGlvbiBvciBjbGFzcyBoYXMgYSAnU3ltYm9sLmZvcihcIlNpZ25hdHVyZVwiKScgb3IgU0lHIHByb3BlcnR5LCByZXR1cm4gaXRcbiAgICAgIGlmICh0aGlzW1NJR10pIHtcbiAgICAgICAgcmV0dXJuIHRoaXNbU0lHXTtcbiAgICAgIH1cblxuICAgICAgY29uc3Qgc291cmNlID0gdGhpcy50b1N0cmluZygpO1xuICAgICAgbGV0IHNpZ25hdHVyZSA9ICcnO1xuXG4gICAgICAvLyBSZW1vdmUgc2luZ2xlLWxpbmUgYW5kIG11bHRpLWxpbmUgY29tbWVudHNcbiAgICAgIGNvbnN0IGNsZWFuZWRTb3VyY2UgPSBzb3VyY2VcbiAgICAgICAgLnJlcGxhY2UoL1xcL1xcLy4qJC9nbSwgJycpXG4gICAgICAgIC5yZXBsYWNlKC9cXC9cXCpbXFxzXFxTXSo/XFwqXFwvL2dtLCAnJyk7XG5cbiAgICAgIGlmIChjbGVhbmVkU291cmNlLnN0YXJ0c1dpdGgoJ2NsYXNzJykpIHtcbiAgICAgICAgLy8gTWF0Y2ggdGhlIGNsYXNzIG5hbWUgYW5kIGV4dGVuZCB1cCB0byB0aGUgY29uc3RydWN0b3IgZGVmaW5pdGlvblxuICAgICAgICBzaWduYXR1cmUgPSBjbGVhbmVkU291cmNlLm1hdGNoKC9jbGFzc1xccytbXFx3JF0rLylbMF07XG4gICAgICAgIC8vIE1hdGNoIHRoZSBjb25zdHJ1Y3RvciBhbmQgaXRzIG11bHRpLWxpbmUgcGFyYW1ldGVyc1xuICAgICAgICBjb25zdCBjb25zdHJ1Y3Rvck1hdGNoID0gY2xlYW5lZFNvdXJjZS5tYXRjaCgvY29uc3RydWN0b3JcXHMqXFwoKFtcXHNcXFNdKj8pXFwpXFxzKnsvKTtcbiAgICAgICAgaWYgKGNvbnN0cnVjdG9yTWF0Y2gpIHtcbiAgICAgICAgICAvLyBSZXBsYWNlIGFsbCBuZXdsaW5lcyBhbmQgbXVsdGlwbGUgc3BhY2VzIHdpdGggYSBzaW5nbGUgc3BhY2VcbiAgICAgICAgICBjb25zdCBwYXJhbXMgPSBjb25zdHJ1Y3Rvck1hdGNoWzFdLnJlcGxhY2UoLyhcXHJcXG58XFxufFxccnxcXHMpKy9nbSwgJyAnKS50cmltKCk7XG4gICAgICAgICAgc2lnbmF0dXJlICs9IGAoJHtwYXJhbXN9KWA7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIE1hdGNoIHRoZSBmdW5jdGlvbiBzaWduYXR1cmUgKGV4Y2x1ZGluZyB0aGUgXCJmdW5jdGlvblwiIGtleXdvcmQpXG4gICAgICAgIGNvbnN0IGZ1bmN0aW9uTWF0Y2ggPSBjbGVhbmVkU291cmNlLm1hdGNoKC8oPzpmdW5jdGlvblxccyspPyhbXFx3JF0rKVxccypcXCgoW1xcc1xcU10qPylcXClcXHMqey8pO1xuICAgICAgICBpZiAoZnVuY3Rpb25NYXRjaCkge1xuICAgICAgICAgIC8vIFJlcGxhY2UgYWxsIG5ld2xpbmVzIGFuZCBtdWx0aXBsZSBzcGFjZXMgd2l0aCBhIHNpbmdsZSBzcGFjZVxuICAgICAgICAgIGNvbnN0IHBhcmFtcyA9IGZ1bmN0aW9uTWF0Y2hbMl0ucmVwbGFjZSgvKFxcclxcbnxcXG58XFxyfFxccykrL2dtLCAnICcpLnRyaW0oKTtcbiAgICAgICAgICBzaWduYXR1cmUgPSBgZnVuY3Rpb24gJHtmdW5jdGlvbk1hdGNoWzFdfSgke3BhcmFtc30pYDtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gc2lnbmF0dXJlLnRyaW0oKTtcbiAgICB9LFxuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSAvLyBTbyB0aGF0IGl0IGNhbiBiZSByZWNvbmZpZ3VyZWQgb3IgZGVsZXRlZCBpZiBuZWNlc3NhcnlcbiAgfSk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGVuYWJsZVNpZ25hdHVyZXNcbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBO0FBQ08sTUFBTUEsR0FBRyxHQUFBQyxPQUFBLENBQUFELEdBQUEsR0FBR0UsTUFBTSxDQUFDQyxHQUFHLENBQUMsV0FBVyxDQUFDOztBQUUxQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ08sU0FBU0MsZ0JBQWdCQSxDQUFBLEVBQUc7RUFDakNDLE1BQU0sQ0FBQ0MsY0FBYyxDQUFDQyxRQUFRLENBQUNDLFNBQVMsRUFBRSxXQUFXLEVBQUU7SUFDckRDLEdBQUdBLENBQUEsRUFBRztNQUNKO01BQ0EsSUFBSSxJQUFJLENBQUNULEdBQUcsQ0FBQyxFQUFFO1FBQ2IsT0FBTyxJQUFJLENBQUNBLEdBQUcsQ0FBQztNQUNsQjtNQUVBLE1BQU1VLE1BQU0sR0FBRyxJQUFJLENBQUNDLFFBQVEsQ0FBQyxDQUFDO01BQzlCLElBQUlDLFNBQVMsR0FBRyxFQUFFOztNQUVsQjtNQUNBLE1BQU1DLGFBQWEsR0FBR0gsTUFBTSxDQUN6QkksT0FBTyxDQUFDLFdBQVcsRUFBRSxFQUFFLENBQUMsQ0FDeEJBLE9BQU8sQ0FBQyxvQkFBb0IsRUFBRSxFQUFFLENBQUM7TUFFcEMsSUFBSUQsYUFBYSxDQUFDRSxVQUFVLENBQUMsT0FBTyxDQUFDLEVBQUU7UUFDckM7UUFDQUgsU0FBUyxHQUFHQyxhQUFhLENBQUNHLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNwRDtRQUNBLE1BQU1DLGdCQUFnQixHQUFHSixhQUFhLENBQUNHLEtBQUssQ0FBQyxrQ0FBa0MsQ0FBQztRQUNoRixJQUFJQyxnQkFBZ0IsRUFBRTtVQUNwQjtVQUNBLE1BQU1DLE1BQU0sR0FBR0QsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLENBQUNILE9BQU8sQ0FBQyxvQkFBb0IsRUFBRSxHQUFHLENBQUMsQ0FBQ0ssSUFBSSxDQUFDLENBQUM7VUFDNUVQLFNBQVMsSUFBSSxJQUFJTSxNQUFNLEdBQUc7UUFDNUI7TUFDRixDQUFDLE1BQU07UUFDTDtRQUNBLE1BQU1FLGFBQWEsR0FBR1AsYUFBYSxDQUFDRyxLQUFLLENBQUMsK0NBQStDLENBQUM7UUFDMUYsSUFBSUksYUFBYSxFQUFFO1VBQ2pCO1VBQ0EsTUFBTUYsTUFBTSxHQUFHRSxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUNOLE9BQU8sQ0FBQyxvQkFBb0IsRUFBRSxHQUFHLENBQUMsQ0FBQ0ssSUFBSSxDQUFDLENBQUM7VUFDekVQLFNBQVMsR0FBRyxZQUFZUSxhQUFhLENBQUMsQ0FBQyxDQUFDLElBQUlGLE1BQU0sR0FBRztRQUN2RDtNQUNGO01BRUEsT0FBT04sU0FBUyxDQUFDTyxJQUFJLENBQUMsQ0FBQztJQUN6QixDQUFDO0lBQ0RFLFlBQVksRUFBRSxJQUFJLENBQUM7RUFDckIsQ0FBQyxDQUFDO0FBQ0o7QUFBQyxJQUFBQyxRQUFBLEdBQUFyQixPQUFBLENBQUFzQixPQUFBLEdBRWNuQixnQkFBZ0IiLCJpZ25vcmVMaXN0IjpbXX0=
//# sourceMappingURL=signatures.js.map