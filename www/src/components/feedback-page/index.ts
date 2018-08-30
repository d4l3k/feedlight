import {LitElement, html} from '@polymer/lit-element'

import {FeedbackService} from '../../rpc'
import {feedlightpb} from '../../feedlightpb'
import '../feedlight-error'

class FeedbackPage extends LitElement {
  private route: any
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
      <h1>Feedback Page</h1>
      <feedlight-error error=${this.error}></feedlight-error>
      <p>${this.route.path}</p>
    `
  }

  _propertiesChanged(props, changed, oldProps) {
    const {route} = changed
    if (route) {
      const id = route.path.slice(1)
      FeedbackService.feedback(
        new feedlightpb.FeedbackRequest({
          id: id,
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
