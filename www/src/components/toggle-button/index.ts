import {PolymerElement} from '@polymer/polymer/polymer-element.js'
import '@polymer/paper-button/paper-button.js'

import {html} from '../../html'

import * as view from './template.html'

export class ToggleButton extends PolymerElement {
  value = false

  static get template (): HTMLTemplateElement {
    return html(view)
  }

  static get properties () {
    return {
      value: {
        notify: true,
        type: Boolean
      }
    }
  }

  toggle () {
    this.value = !this.value
  }
}

customElements.define('toggle-button', ToggleButton)
