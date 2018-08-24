import {PolymerElement} from '@polymer/polymer/polymer-element.js'
import '@polymer/paper-button/paper-button.js';

import {html} from '../../html'

import * as view from './template.html'

class FeedlightButton extends PolymerElement {
  connectedCallback () {
    super.connectedCallback()
  }

  ready () {
    super.ready()
  }

  static get template () {
    return html(view)
  }

  sendFeedback () {
    import(/* webpackChunkName: "feedlightForm" */ '../feedlight-form').then(() => {
      (this.$.form as any).open()
    })
  }
}

customElements.define('feedlight-button', FeedlightButton)
