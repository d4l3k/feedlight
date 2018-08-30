import {LitElement, html} from '@polymer/lit-element'

class FeedlightError extends LitElement {
  private error: any

  static get properties () {
    return {
      error: {type: Object}
    }
  }

  _render () {
    return html`<style> p { color: red } </style>
      <p>${this.error}</p>
    `
  }
}

customElements.define('feedlight-error', FeedlightError)
