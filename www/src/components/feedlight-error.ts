import {LitElement, html, property} from '@polymer/lit-element'

class FeedlightError extends LitElement {
  @property()
  public error: any

  render () {
    return html`<style> p { color: red } </style>
      ${this.renderError()}
    `
  }

  renderError () {
    if (!this.error) {
      return
    }

    return html`
      <p>${this.error}</p>
    `
  }
}

customElements.define('feedlight-error', FeedlightError)
