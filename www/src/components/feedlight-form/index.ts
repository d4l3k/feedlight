import {PolymerElement} from '@polymer/polymer/polymer-element.js'
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-dialog/paper-dialog.js';
import {PaperDialog} from '@polymer/paper-dialog/paper-dialog.js';

import {html} from '../../html'

import * as view from './template.html'

export class FeedlightForm extends PolymerElement {
  connectedCallback () {
    super.connectedCallback()
  }

  ready () {
    super.ready()
  }

  static get template () {
    return html(view)
  }

  open () {
    (this.$.dialog as PaperDialog).open()
  }
}

customElements.define('feedlight-form', FeedlightForm)
