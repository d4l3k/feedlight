import hljs from 'highlight.js/lib/highlight'
import javascript from 'highlight.js/lib/languages/javascript'
import xml from 'highlight.js/lib/languages/xml'
hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('xml', xml)
window['hljs'] = hljs

import(/* webpackChunkName: "codeSampleDynamic" */ './code-sample-dynamic').catch(err => {
  console.error(err)
})
