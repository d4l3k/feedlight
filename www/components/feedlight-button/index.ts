import {PolymerElement} from '@polymer/polymer/polymer-element.js'

import * as view from './template.html'

class FeedlightButton extends PolymerElement {
  connectedCallback () {
    super.connectedCallback()
    this.textContent = 'I\'m a custom element!'
    console.log('my-element created!')
  }

  ready () {
    super.ready()
    console.log('my-element is ready!')
  }

  static get template () {
    return view
  }
}

// Associate the new class with an element name
customElements.define('feedlight-button', FeedlightButton)
