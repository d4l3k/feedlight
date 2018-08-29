import {LitElement, html} from '@polymer/lit-element'

class FeedbackPage extends LitElement {
  private mood: string

  static get properties () {
    return {
      mood: {type: String}
    }
  }

  constructor () {
    super()
    this.mood = 'happy'
  }

  render () {
    return html`<style> .mood { color: green; } </style>
      <h1>Feedback Page</h1>
    `
  }
}

customElements.define('feedback-page', FeedbackPage)
