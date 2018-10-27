/* global window document hljs */

// library used by RevealJS to download dependency plugins (here: markdown and highlighting)
require('headjs/dist/1.0.0/head.min.js')

// required by the RevealJS markdown plugins
const Reveal = require('reveal.js')
window.Reveal = Reveal

// CSS styles
require('reveal.js/css/reveal.css')
require('reveal.js/css/theme/solarized.css') // select another theme if you like
require('reveal.js/lib/css/zenburn.css') // CSS stylesheet used for code highlighting
require('./styles/index.styl') // customize your CSS here

// includes the plugins in the build, at the url expected by RevealJS
require('file-loader?name=plugin/markdown/[name].[ext]!reveal.js/plugin/markdown/marked.js')
require('file-loader?name=plugin/markdown/[name].[ext]!reveal.js/plugin/markdown/markdown.js')
require('file-loader?name=plugin/highlight/[name].[ext]!reveal.js/plugin/highlight/highlight.js')

// loads the markdown content
window.document.getElementById('source').innerHTML = require('./Web安全.md')
Reveal.initialize({
  // see https://github.com/hakimel/reveal.js#configuration
  slideNumber: true,
  showNotes: 'separate-page',
  // so that live-reload keeps you on the same slide
  history: true,
  transition: 'convex',
  dependencies: [
    // interpret Markdown in <section> elements
    { src: 'plugin/markdown/marked.js', condition: function() { return !!document.querySelector( '[data-markdown]' ) } },
    { src: 'plugin/markdown/markdown.js', condition: function() { return !!document.querySelector( '[data-markdown]' ) } },

    // syntax highlight for <code> elements
    { src: 'plugin/highlight/highlight.js', async: true, callback: function() { hljs.initHighlightingOnLoad() } }
  ]
})
