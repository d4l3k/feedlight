import {PolymerElement} from '@polymer/polymer/polymer-element.js'
import * as React from 'react'

import '../feedlight-button'
import 'polymer-react'
import {html} from '../../html'

import * as view from './template.html'

import SyntaxHighlighter, { registerLanguage } from 'react-syntax-highlighter/light'
const js: any = require('react-syntax-highlighter/languages/hljs/javascript')
const xml: any = require('react-syntax-highlighter/languages/hljs/xml')
const style: any = require('react-syntax-highlighter/styles/hljs/solarized-dark')

registerLanguage('javascript', js)
registerLanguage('xml', xml)

interface CodeProps {
  code: string
}

export class IndexPage extends PolymerElement {
  private code: CodeProps = {
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

  render (props: CodeProps) {
    return <SyntaxHighlighter language='html' style={style}>{props.code || ''}</SyntaxHighlighter>
  }
}

customElements.define('index-page', IndexPage)
