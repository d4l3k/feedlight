import {PolymerElement} from '@polymer/polymer/polymer-element.js'
import '@polymer/paper-button/paper-button.js'
import '@polymer/paper-dialog/paper-dialog.js'
import '@polymer/paper-input/paper-textarea.js'
import '@polymer/paper-checkbox/paper-checkbox.js'
import '@polymer/iron-icons/iron-icons.js'
import '@polymer/paper-progress/paper-progress.js'
import {PaperDialog} from '@polymer/paper-dialog/paper-dialog.js'
import {debounce} from 'debounce'

import {html} from '../../html'
import {feedlightpb} from '../../feedlightpb'
import '../toggle-button'

import * as view from './template.html'

function postData(url: string, data: any): Promise<any> {
  // Default options are marked with *
    return fetch(url, {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, cors, *same-origin
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        credentials: "same-origin", // include, same-origin, *omit
        headers: {
            "Content-Type": "application/json; charset=utf-8",
            // "Content-Type": "application/x-www-form-urlencoded",
        },
        redirect: "follow", // manual, *follow, error
        referrer: "no-referrer", // no-referrer, *client
        body: JSON.stringify(data), // body data type must match "Content-Type" header
    })
    .then(response => response.json()); // parses response to JSON
}

export class FeedlightForm extends PolymerElement {
  similarFeedback?: feedlightpb.IFeedback[]
  sharePublicly?: boolean
  feedback?: string
  email?: string
  domain?: string
  loading = 0
  backendAddr = config.BACKEND_ADDR
  err: any

  constructor () {
    super()
    this.init()

    this.findSimilar = debounce(this.findSimilar, 300)
  }

  static get properties () {
    return {
      sharePublicly: {
        type: Boolean
      },
      email: {
        type: String
      },
      domain: {
        type: String
      },
      feedback: {
        type: String
      }
    }
  }

  static get template (): HTMLTemplateElement {
    return html(view)
  }

  static get observers (): string[] {
    return [
      'findSimilar(feedback)'
    ]
  }

  findSimilar (feedback: string) {
    this.loading += 1
    postData(
      this.backendAddr + '/api/v1/feedback/similar',
      new feedlightpb.SimilarFeedbackRequest({
        domain: this.domain,
        feedback: this.curFeedback(),
      }),
    ).then((resp: feedlightpb.SimilarFeedbackResponse) => {
      this.similarFeedback = resp.feedback
      this.loading -= 1
    }).catch((err) => {
      this.loading -= 1
      this.err = err
    })
  }

  submit (feedback: string) {
    this.loading += 1
    postData(
      this.backendAddr + '/api/v1/feedback/submit',
      new feedlightpb.SubmitFeedbackRequest({
        email: this.email,
        domain: this.domain,
        feedback: this.curFeedback(),
        similar: this.similarFeedback,
      }),
    ).then((resp: feedlightpb.SubmitFeedbackResponse) => {
      ;(this.$.dialog as PaperDialog).close()
      this.loading -= 1
    }).catch((err) => {
      this.loading -= 1
      this.err = err
    })
  }

  curFeedback(): feedlightpb.Feedback {
    return new feedlightpb.Feedback({
      feedback: this.feedback,
      sharePublicly: this.sharePublicly,
    })
  }

  resize () {
    ;(this.$.dialog as PaperDialog).notifyResize()
  }

  init () {
    this.feedback = ''
    this.sharePublicly = true
  }

  open () {
    this.init()
    ;(this.$.dialog as PaperDialog).open()
  }

  similarityScore (f: feedlightpb.IFeedback): number {
    let score = f.numSimilar || 0
    if (f.similar) {
      score += 1
    }
    return score
  }

  updateSimilar (e) {
    e.model.set('item.dissimilar', false)
  }

  updateDissimilar (e) {
    e.model.set('item.similar', false)
  }
}

customElements.define('feedlight-form', FeedlightForm)
