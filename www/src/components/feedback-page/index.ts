import {LitElement, html, property} from '@polymer/lit-element'
import * as moment from 'moment'
import * as Long from 'long'

import {FeedbackService} from '../../rpc'
import {feedlightpb} from '../../feedlightpb'
import '../feedlight-error'
import '../feedlight-blockquote'
import '../feedlight-feedback'

interface Route {
  path: string
}

class FeedbackPage extends LitElement {
  private _route?: Route
  @property()
  private data?: feedlightpb.FeedbackResponse
  @property()
  private error: any

  static get properties () {
    return {
      route: {type: Object}
    }
  }

  render () {
    return html`<style></style>
      <h1>View Feedback</h1>
      <feedlight-error .error=${this.error}></feedlight-error>
      ${this.renderFeedback()}
    `
  }

  renderFeedback () {
    if (!this.data || !this.data.feedback) {
      return
    }

    const fb = this.data.feedback

    return html`
      <p>Submitted ${moment.unix(Long.fromValue(fb.createdAt!).toNumber()).fromNow()}</p>
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

  renderSimilar (similar: feedlightpb.IFeedback[]) {
    if (!similar || similar.length === 0) {
      return
    }

    return html`
      <h2>Similar</h2>
      ${similar.map(a => {
    return html`
            <feedlight-feedback .feedback=${a}></feedlight-feedback>
          `
  })
}
    `
  }

  get route (): Route | undefined {
    return this._route
  }

  set route (route: Route | undefined) {
    this._route = route

    if (!route) {
      return
    }

    const id = route.path.slice(1)
    FeedbackService.feedback(
      new feedlightpb.FeedbackRequest({
        id: Long.fromString(id)
      })
    ).then((resp: feedlightpb.FeedbackResponse) => {
      this.data = resp
    }).catch((err) => {
      this.error = err
    })
  }
}

customElements.define('feedback-page', FeedbackPage)
