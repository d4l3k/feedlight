import {LitElement, html, property} from '@polymer/lit-element'

import '@polymer/iron-icons/iron-icons.js'

import {feedlightpb} from '../feedlightpb'
import './feedlight-blockquote'
import './toggle-button'

class FeedlightFeedback extends LitElement {
  @property()
  public feedback?: feedlightpb.IFeedback

  render () {
    return html`<style>
    .feedback {
      display: flex;
      justify-content: stretch;
      align-items: center;

      padding: 12px;
      margin: 12px;
      border: 1px solid #ccc;
      border-radius: 3px;
    }
    .feedback-body {
      flex-grow: 1;
    }
    .check {
      --primary-color: green;
    }
    .clear {
      --primary-color: red;
    }
    .buttons {
      display: flex;
      justify-content: flex-end;
      align-items: center;
    }
    </style>

    ${this.renderFeedback()}
    `
  }

  renderFeedback () {
    if (!this.feedback) {
      return
    }

    return html`
    <div class="feedback">
      <div class="feedback-body">
        ${this.feedback.feedback}
        ${this.renderResponse(this.feedback)}
      </div>
      <div class="buttons">
        ${this.similarityScore(this.feedback)}
        <toggle-button class="check" .value=${this.feedback.similar} @tap=${() => {
  this.dispatchEvent(new CustomEvent('similar'))
}}>
          <iron-icon icon="check"></iron-icon>
        </toggle-button>
        <toggle-button class="clear" .value=${this.feedback.dissimilar} @tap=${() => {
  this.dispatchEvent(new CustomEvent('dissimilar'))
}}>
          <iron-icon icon="clear"></iron-icon>
        </toggle-button>
      </div>
    </div>
    `
  }

  renderResponse (f: feedlightpb.IFeedback) {
    if (!f.response) {
      return
    }

    return html`
      <label>Company Response</label>
      <feedlight-blockquote>${f.response}</feedlight-blockquote>
    `
  }

  similarityScore (f: feedlightpb.IFeedback): number {
    let score = f.score || 0
    if (f.similar) {
      score += 1
    }
    return score
  }
}

customElements.define('feedlight-feedback', FeedlightFeedback)
