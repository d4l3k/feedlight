import {PolymerElement} from '@polymer/polymer/polymer-element.js'

import './code-sample'

import '../feedlight-button'
import {html} from '../../html'

import * as view from './template.html'


export class IndexPage extends PolymerElement {
  static get template (): HTMLTemplateElement {
    return html(view)
  }
}

customElements.define('index-page', IndexPage)
