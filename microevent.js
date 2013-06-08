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
 * Add an event listener.
 *
 * @expose
 * @param  {string} event
 * @param  {function(...)} fn
 */
MicroEvent.prototype.on = function (event, fn) {
  this._events = this._events || {}
  this._events[event] = this._events[event] || []
  this._events[event].push({fn: fn, once: false})
}

/**
 * Add an event listener that will get executed at most once, even
 * if the event is emitted multiple times.
 *
 * @expose
 * @param  {string} event
 * @param  {function(...)} fn
 */
MicroEvent.prototype.once = function (event, fn) {
  this._events = this._events || {}
  this._events[event] = this._events[event] || []
  this._events[event].push({fn: fn, once: true})
}

/**
 * Remove an event listener.
 *
 * @expose
 * @param  {string} event
 * @param  {function(...)} fn
 */
MicroEvent.prototype.off = function (event, fn) {
  this._events = this._events || {}
  if (event in this._events === false) return

  this._events[event].map(function (obj, i) {
    if (obj.fn === fn) {
      this._events[event].splice(i, 1)
    }
  })
}

/**
 * Trigger an event. Execute all listening functions.
 *
 * @expose
 * @type {function(string, ...[*])}
 */
MicroEvent.prototype.emit = function (event /* , args... */ ) {
  this._events = this._events || {}
  var args = Array.prototype.slice.call(arguments, 1)
  if (event in this._events === false) return

  for (var i = 0, len = this._events[event].length; i < len; i++) {
    var obj = this._events[event][i]
    obj.fn.apply(this, args)
    if (obj.once) {
      this.off(event, obj.fn)
    }
  }
}

/**
 * mixin will delegate all MicroEvent.js function in the destination object
 * require('MicroEvent').mixin(Foobar) will make Foobar able to use MicroEvent
 *
 * @param {Object} destObject the object which will support MicroEvent
 */
MicroEvent.mixin = function (destObject) {
  var props = Object.getOwnPropertyNames(MicroEvent.prototype)
  for (var i = 0; i < props.length; i++) {
    destObject.prototype[props[i]] = MicroEvent.prototype[props[i]]
  }
}

if (typeof module !== "undefined" && ('exports' in module)) {
  module.exports = MicroEvent
}