import {PolymerElement} from '@polymer/polymer/polymer-element.js'
import React from 'react'

import '../feedlight-button'
import 'polymer-react'
import {html} from '../../html'

import * as view from './template.html'

import SyntaxHighlighter, { registerLanguage } from 'react-syntax-highlighter/light'
import js from 'react-syntax-highlighter/languages/hljs/javascript'
import xml from 'react-syntax-highlighter/languages/hljs/xml'
import style from 'react-syntax-highlighter/styles/hljs/solarized-dark'

registerLanguage('javascript', js)
registerLanguage('xml', xml)

// import './code-sample'

export class IndexPage extends PolymerElement {
  private code = {
    code: `<!-- Load webcomponents polyfills if necessary -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/webcomponentsjs/2.0.2/custom-elements-es5-adapter.js"></script>
<script
src="https://cdnjs.cloudflare.com/ajax/libs/webcomponentsjs/2.0.2/webcomponents-loader.js"></script>

<!-- load the button and add it -->
<script src="https://feedlight.fn.lc/button.js" async></script>
<feedlight-button email="your@user.com" domain="your-domain"></feedlight-button>`
  }

  static get template (): HTMLTemplateElement {
    return html(view)
  }

  render (props) {
    return <SyntaxHighlighter language='html' style={style}>{props.code || ''}</SyntaxHighlighter>
  }
}

customElements.define('index-page', IndexPage)
