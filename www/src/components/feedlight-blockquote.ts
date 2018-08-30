import {LitElement, html} from '@polymer/lit-element'

class FeedlightBlockquote extends LitElement {
  render () {
    return html`
      <style>
        blockquote {
          padding: 5px 12px;
          border-left: 2px solid var(--primary-color);
          margin: 0;
        }
      </style>
      <blockquote><slot></slot></blockquote>
    `
  }
}

customElements.define('feedlight-blockquote', FeedlightBlockquote)
