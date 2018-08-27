import {PolymerElement} from '@polymer/polymer/polymer-element.js'

import {html} from '../../html'

import * as view from './template.html'

export class NotFoundPage extends PolymerElement {
  static get template (): HTMLTemplateElement {
    return html(view)
  }
}

customElements.define('not-found-page', NotFoundPage)
