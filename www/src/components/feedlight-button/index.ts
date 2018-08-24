import {PolymerElement} from '@polymer/polymer/polymer-element.js'
import '@polymer/paper-button/paper-button.js'
import '@polymer/paper-spinner/paper-spinner-lite.js'

import {html} from '../../html'

import * as view from './template.html'

class FeedlightButton extends PolymerElement {
  loading = false

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
    this.loading = true
    import(/* webpackChunkName: "feedlightForm" */ '../feedlight-form').then(() => {
      (this.$.form as any).open()
      this.loading = false
    })
  }
}

customElements.define('feedlight-button', FeedlightButton)
