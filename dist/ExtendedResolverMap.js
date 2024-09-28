"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ExtendedResolverMap = void 0;
var _Schemata = require("./Schemata");
// @ts-check

/**
 * A class that stores information about a set of resolvers and their
 * associated GraphQLSchema (or the sdl to make one), such that when
 * multiple SDL/Schema merges occur the subsequently merged Schemas have
 * a history of the unbound resolver functiosn from previous merges (in order)
 *
 * @class ExtendedResovlerMap
 */
class ExtendedResolverMap {
  /**
   * The constructor takes an object with at least SDL or a GraphQLSchema and
   * a resolver map object of untainted and unbound resolver functions
   *
   * @constructor
   * @param {ExtendedResolverMapConfig} config an object conforming to the
   * flow type `ExtendedResolverMapConfig` as defined above.
   */
  constructor(config) {
    this.schema = config.schema;
    this.sdl = config.sdl;
    this.resolvers = config.resolvers;
  }

  /**
   * A useful iterator on instances of ExtendedResolverMap that yields a
   * key and value for each entry found in the resolvers object set on this
   * instance
   *
   * @return {Function} a bound generator function that iterates over the
   * key/value props of the internal .resovlers property
   */
  get [Symbol.iterator]() {
    return function* () {
      for (let key of Object.keys(this.resolvers)) {
        yield {
          key,
          value: this.resolvers[key]
        };
      }
    }.bind(this);
  }

  /**
   * A shorthand way to create a new instance of `ExtendedResolverMap`. In
   * the case that an instance of Schemata is passed in, the schema
   * property is first attempted as
   *
   * @param {SchemataConfigUnion} config the same config object passed
   * to the constructor or an instance of Schemata
   * @return {ExtendedResolverMap} a new instance of `ExtendedResolverMap`
   */
  static from(config) {
    if (config instanceof _Schemata.Schemata) {
      const {
        schema,
        sdl
      } = config;
      const resolvers = config.buildResolvers();
      return new ExtendedResolverMap({
        schema,
        sdl,
        resolvers
      });
    } else {
      return new ExtendedResolverMap(config);
    }
  }
}
exports.ExtendedResolverMap = ExtendedResolverMap;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfU2NoZW1hdGEiLCJyZXF1aXJlIiwiRXh0ZW5kZWRSZXNvbHZlck1hcCIsImNvbnN0cnVjdG9yIiwiY29uZmlnIiwic2NoZW1hIiwic2RsIiwicmVzb2x2ZXJzIiwiU3ltYm9sIiwiaXRlcmF0b3IiLCJrZXkiLCJPYmplY3QiLCJrZXlzIiwidmFsdWUiLCJiaW5kIiwiZnJvbSIsIlNjaGVtYXRhIiwiYnVpbGRSZXNvbHZlcnMiLCJleHBvcnRzIl0sInNvdXJjZXMiOlsiLi4vc3JjL0V4dGVuZGVkUmVzb2x2ZXJNYXAuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gQHRzLWNoZWNrXG5cbmltcG9ydCB7IFNjaGVtYXRhIH0gZnJvbSAnLi9TY2hlbWF0YSdcblxuaW1wb3J0IHR5cGUgeyBHcmFwaFFMU2NoZW1hIH0gZnJvbSAnZ3JhcGhxbCdcbmltcG9ydCB0eXBlIHsgRXh0ZW5kZWRSZXNvbHZlck1hcENvbmZpZywgU2NoZW1hdGFDb25maWdVbmlvbiB9IGZyb20gJy4vdHlwZXMnXG5cbi8qKlxuICogQSBjbGFzcyB0aGF0IHN0b3JlcyBpbmZvcm1hdGlvbiBhYm91dCBhIHNldCBvZiByZXNvbHZlcnMgYW5kIHRoZWlyXG4gKiBhc3NvY2lhdGVkIEdyYXBoUUxTY2hlbWEgKG9yIHRoZSBzZGwgdG8gbWFrZSBvbmUpLCBzdWNoIHRoYXQgd2hlblxuICogbXVsdGlwbGUgU0RML1NjaGVtYSBtZXJnZXMgb2NjdXIgdGhlIHN1YnNlcXVlbnRseSBtZXJnZWQgU2NoZW1hcyBoYXZlXG4gKiBhIGhpc3Rvcnkgb2YgdGhlIHVuYm91bmQgcmVzb2x2ZXIgZnVuY3Rpb3NuIGZyb20gcHJldmlvdXMgbWVyZ2VzIChpbiBvcmRlcilcbiAqXG4gKiBAY2xhc3MgRXh0ZW5kZWRSZXNvdmxlck1hcFxuICovXG5leHBvcnQgY2xhc3MgRXh0ZW5kZWRSZXNvbHZlck1hcCB7XG4gIHNjaGVtYTogP0dyYXBoUUxTY2hlbWFcbiAgc2RsOiA/KHN0cmluZyB8IFNjaGVtYXRhKVxuICByZXNvbHZlcnM6ID97IFtzdHJpbmddOiBzdHJpbmcgfVxuXG4gIC8qKlxuICAgKiBUaGUgY29uc3RydWN0b3IgdGFrZXMgYW4gb2JqZWN0IHdpdGggYXQgbGVhc3QgU0RMIG9yIGEgR3JhcGhRTFNjaGVtYSBhbmRcbiAgICogYSByZXNvbHZlciBtYXAgb2JqZWN0IG9mIHVudGFpbnRlZCBhbmQgdW5ib3VuZCByZXNvbHZlciBmdW5jdGlvbnNcbiAgICpcbiAgICogQGNvbnN0cnVjdG9yXG4gICAqIEBwYXJhbSB7RXh0ZW5kZWRSZXNvbHZlck1hcENvbmZpZ30gY29uZmlnIGFuIG9iamVjdCBjb25mb3JtaW5nIHRvIHRoZVxuICAgKiBmbG93IHR5cGUgYEV4dGVuZGVkUmVzb2x2ZXJNYXBDb25maWdgIGFzIGRlZmluZWQgYWJvdmUuXG4gICAqL1xuICBjb25zdHJ1Y3Rvcihjb25maWc6IEV4dGVuZGVkUmVzb2x2ZXJNYXBDb25maWcpIHtcbiAgICB0aGlzLnNjaGVtYSA9IGNvbmZpZy5zY2hlbWFcbiAgICB0aGlzLnNkbCA9IGNvbmZpZy5zZGxcbiAgICB0aGlzLnJlc29sdmVycyA9IGNvbmZpZy5yZXNvbHZlcnNcbiAgfVxuXG4gIC8qKlxuICAgKiBBIHVzZWZ1bCBpdGVyYXRvciBvbiBpbnN0YW5jZXMgb2YgRXh0ZW5kZWRSZXNvbHZlck1hcCB0aGF0IHlpZWxkcyBhXG4gICAqIGtleSBhbmQgdmFsdWUgZm9yIGVhY2ggZW50cnkgZm91bmQgaW4gdGhlIHJlc29sdmVycyBvYmplY3Qgc2V0IG9uIHRoaXNcbiAgICogaW5zdGFuY2VcbiAgICpcbiAgICogQHJldHVybiB7RnVuY3Rpb259IGEgYm91bmQgZ2VuZXJhdG9yIGZ1bmN0aW9uIHRoYXQgaXRlcmF0ZXMgb3ZlciB0aGVcbiAgICoga2V5L3ZhbHVlIHByb3BzIG9mIHRoZSBpbnRlcm5hbCAucmVzb3ZsZXJzIHByb3BlcnR5XG4gICAqL1xuICBnZXQgW1N5bWJvbC5pdGVyYXRvcl0oKTogRnVuY3Rpb24ge1xuICAgIHJldHVybiBmdW5jdGlvbiooKSB7XG4gICAgICBmb3IgKGxldCBrZXkgb2YgT2JqZWN0LmtleXModGhpcy5yZXNvbHZlcnMpKSB7XG4gICAgICAgIHlpZWxkIHsga2V5LCB2YWx1ZTogdGhpcy5yZXNvbHZlcnNba2V5XSB9XG4gICAgICB9XG4gICAgfS5iaW5kKHRoaXMpXG4gIH1cblxuICAvKipcbiAgICogQSBzaG9ydGhhbmQgd2F5IHRvIGNyZWF0ZSBhIG5ldyBpbnN0YW5jZSBvZiBgRXh0ZW5kZWRSZXNvbHZlck1hcGAuIEluXG4gICAqIHRoZSBjYXNlIHRoYXQgYW4gaW5zdGFuY2Ugb2YgU2NoZW1hdGEgaXMgcGFzc2VkIGluLCB0aGUgc2NoZW1hXG4gICAqIHByb3BlcnR5IGlzIGZpcnN0IGF0dGVtcHRlZCBhc1xuICAgKlxuICAgKiBAcGFyYW0ge1NjaGVtYXRhQ29uZmlnVW5pb259IGNvbmZpZyB0aGUgc2FtZSBjb25maWcgb2JqZWN0IHBhc3NlZFxuICAgKiB0byB0aGUgY29uc3RydWN0b3Igb3IgYW4gaW5zdGFuY2Ugb2YgU2NoZW1hdGFcbiAgICogQHJldHVybiB7RXh0ZW5kZWRSZXNvbHZlck1hcH0gYSBuZXcgaW5zdGFuY2Ugb2YgYEV4dGVuZGVkUmVzb2x2ZXJNYXBgXG4gICAqL1xuICBzdGF0aWMgZnJvbShjb25maWc6IFNjaGVtYXRhQ29uZmlnVW5pb24pOiBFeHRlbmRlZFJlc29sdmVyTWFwIHtcbiAgICBpZiAoY29uZmlnIGluc3RhbmNlb2YgU2NoZW1hdGEpIHtcbiAgICAgIGNvbnN0IHsgc2NoZW1hLCBzZGwgfSA9IGNvbmZpZ1xuICAgICAgY29uc3QgcmVzb2x2ZXJzID0gY29uZmlnLmJ1aWxkUmVzb2x2ZXJzKClcblxuICAgICAgcmV0dXJuIG5ldyBFeHRlbmRlZFJlc29sdmVyTWFwKHsgc2NoZW1hLCBzZGwsIHJlc29sdmVycyB9KVxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHJldHVybiBuZXcgRXh0ZW5kZWRSZXNvbHZlck1hcChjb25maWcpXG4gICAgfVxuICB9XG59XG4iXSwibWFwcGluZ3MiOiI7Ozs7OztBQUVBLElBQUFBLFNBQUEsR0FBQUMsT0FBQTtBQUZBOztBQU9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDTyxNQUFNQyxtQkFBbUIsQ0FBQztFQUsvQjtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0VBQ0VDLFdBQVdBLENBQUNDLE1BQWlDLEVBQUU7SUFDN0MsSUFBSSxDQUFDQyxNQUFNLEdBQUdELE1BQU0sQ0FBQ0MsTUFBTTtJQUMzQixJQUFJLENBQUNDLEdBQUcsR0FBR0YsTUFBTSxDQUFDRSxHQUFHO0lBQ3JCLElBQUksQ0FBQ0MsU0FBUyxHQUFHSCxNQUFNLENBQUNHLFNBQVM7RUFDbkM7O0VBRUE7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtFQUNFLEtBQUtDLE1BQU0sQ0FBQ0MsUUFBUSxJQUFjO0lBQ2hDLE9BQU8sYUFBWTtNQUNqQixLQUFLLElBQUlDLEdBQUcsSUFBSUMsTUFBTSxDQUFDQyxJQUFJLENBQUMsSUFBSSxDQUFDTCxTQUFTLENBQUMsRUFBRTtRQUMzQyxNQUFNO1VBQUVHLEdBQUc7VUFBRUcsS0FBSyxFQUFFLElBQUksQ0FBQ04sU0FBUyxDQUFDRyxHQUFHO1FBQUUsQ0FBQztNQUMzQztJQUNGLENBQUMsQ0FBQ0ksSUFBSSxDQUFDLElBQUksQ0FBQztFQUNkOztFQUVBO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtFQUNFLE9BQU9DLElBQUlBLENBQUNYLE1BQTJCLEVBQXVCO0lBQzVELElBQUlBLE1BQU0sWUFBWVksa0JBQVEsRUFBRTtNQUM5QixNQUFNO1FBQUVYLE1BQU07UUFBRUM7TUFBSSxDQUFDLEdBQUdGLE1BQU07TUFDOUIsTUFBTUcsU0FBUyxHQUFHSCxNQUFNLENBQUNhLGNBQWMsQ0FBQyxDQUFDO01BRXpDLE9BQU8sSUFBSWYsbUJBQW1CLENBQUM7UUFBRUcsTUFBTTtRQUFFQyxHQUFHO1FBQUVDO01BQVUsQ0FBQyxDQUFDO0lBQzVELENBQUMsTUFDSTtNQUNILE9BQU8sSUFBSUwsbUJBQW1CLENBQUNFLE1BQU0sQ0FBQztJQUN4QztFQUNGO0FBQ0Y7QUFBQ2MsT0FBQSxDQUFBaEIsbUJBQUEsR0FBQUEsbUJBQUEiLCJpZ25vcmVMaXN0IjpbXX0=
//# sourceMappingURL=ExtendedResolverMap.js.map