/**
 * MicroEvent - to make any js object an event emitter (server or browser)
 *
 * - pure javascript - server compatible, browser compatible
 * - dont rely on the browser doms
 * - super simple - you get it immediatly, no mistery, no magic involved
 *
 * @constructor
 */

var MicroEvent = function() {}

/**
 * Add an event.
 * @expose
 * @param  {string} event
 * @param  {function(...)} fn
 */

MicroEvent.prototype.on = function (event, fn) {
  this._events[event] = this._events[event] || []
  this._events[event].push(fn)
}

/**
 * Remove an event.
 * @expose
 * @param  {string} event
 * @param  {function(...)} fn
 */

MicroEvent.prototype.off = function (event, fn) {
  if (!this._events || event in this._events === false) return
  this._events[event].splice(this._events[event].indexOf(fn), 1)
}

/**
 * Trigger an event.
 * @expose
 * @type {function(string, ...[*])}
 */

MicroEvent.prototype.emit = function (event /* , args... */ ) {
  if (!this._events || event in this._events === false) return
  var args = Array.prototype.slice.call(arguments, 1)
  for (var i = 0, len = this._events[event].length; i < len; i++) {
    this._events[event][i].apply(this, args)
  }
}

/**
 * mixin will delegate all MicroEvent.js function in the destination object
 * require('MicroEvent').mixin(Foobar) will make Foobar able to use MicroEvent
 *
 * @param {Object} destObject the object which will support MicroEvent
 */

MicroEvent.mixin = function(destObject) {
  var props = Object.getOwnPropertyNames(MicroEvent.prototype)
  for (var i = 0; i < props.length; i++) {
    destObject.prototype[props[i]] = MicroEvent.prototype[props[i]]
  }
  this._events = {}
}

// export in common js
if (typeof module !== "undefined" && ('exports' in module)) {
  module.exports = MicroEvent
}