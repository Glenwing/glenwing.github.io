class Spoiler extends HTMLElement {

}

window.customElements.define('glenwing-spoiler', Spoiler);

var GlenwingSpoilerProto = Object.create(HTMLElement.prototype);

Object.defineProperty(GlenwingSpoilerProto, 'open', { value: true, writable: true });
Object.defineProperty(GlenwingSpoilerProto, 'retractable', { value: true, writable: true});
Object.defineProperty(GlenwingSpoilerProto, 'footer', { value: true, writable: true });