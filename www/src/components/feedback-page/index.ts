import {LitElement, html} from '@polymer/lit-element'
import * as moment from 'moment'
import * as Long from 'long'

import {FeedbackService} from '../../rpc'
import {feedlightpb} from '../../feedlightpb'
import '../feedlight-error'
import '../feedlight-blockquote'

class FeedbackPage extends LitElement {
  private route?: object
  private data?: feedlightpb.FeedbackResponse
  private error: any

  static get properties () {
    return {
      route: {type: Object},
      data: {type: Object},
      error: {type: Object}
    }
  }

  _render () {
    return html`<style></style>
      <h1>View Feedback</h1>
      <feedlight-error error=${this.error}></feedlight-error>
      ${this.renderFeedback()}
    `
  }

  renderFeedback () {
    if (!this.data || !this.data.feedback) {
      return
    }

    const fb = this.data.feedback

    return html`
      <p>Submitted ${moment(Long.fromValue(fb.created!).toNumber()).fromNow()}</p>
      <feedlight-blockquote>${fb.feedback}</feedlight-blockquote>
      ${this.renderResponse(fb.response)}
      ${this.renderSimilar(this.data.similar)}
    `
  }

  renderResponse (resp: string | undefined | null) {
    if (!resp) {
      return
    }

    return html`
      <h2>Company Response</h2>
      <feedlight-blockquote>${resp}</feedlight-blockquote>
    `
  }

  renderSimilar (similar: feedlightpb.Feedback[]) {
  }

  _propertiesChanged (props, changed, oldProps) {
    const {route} = changed
    if (route) {
      const id = route.path.slice(1)
      FeedbackService.feedback(
        new feedlightpb.FeedbackRequest({
          id: id
        })
      ).then((resp: feedlightpb.FeedbackResponse) => {
        this.data = resp
      }).catch((err) => {
        this.error = err
      })
    }
    super._propertiesChanged(props, changed, oldProps)
  }
}

customElements.define('feedback-page', FeedbackPage)
