import {PolymerElement} from '@polymer/polymer/polymer-element.js'
import '@polymer/paper-button/paper-button.js'
import '@polymer/paper-input/paper-textarea.js'
import '@polymer/paper-checkbox/paper-checkbox.js'
import '@polymer/paper-progress/paper-progress.js'
import '@polymer/paper-dialog/paper-dialog.js'

import '../feedlight-feedback'

import {FeedbackService} from '../../rpc'
import {feedlightpb} from '../../feedlightpb'
import {html} from '../../html'

import * as view from './template.html'

const debounce = require('lodash.debounce')

export class FeedlightForm extends PolymerElement {
  similarFeedback?: feedlightpb.IFeedback[]
  submitResponse?: feedlightpb.SubmitFeedbackResponse
  sharePublicly?: boolean
  feedback?: string
  email?: string
  domain?: string
  loading = 0
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
    FeedbackService.similarFeedback(
      new feedlightpb.SimilarFeedbackRequest({
        domain: this.domain,
        feedback: this.curFeedback()
      })
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
    FeedbackService.submitFeedback(
      new feedlightpb.SubmitFeedbackRequest({
        email: this.email,
        domain: this.domain,
        feedback: this.curFeedback(),
        similar: this.similarFeedback
      })
    ).then((resp: feedlightpb.SubmitFeedbackResponse) => {
      this.submitResponse = resp
      ;(this.$.dialog as any).close()
      ;(this.$.submitted as any).open()
      this.loading -= 1
    }).catch((err) => {
      this.loading -= 1
      this.err = err
    })
  }

  curFeedback (): feedlightpb.Feedback {
    return new feedlightpb.Feedback({
      feedback: this.feedback,
      sharePublicly: this.sharePublicly
    })
  }

  resize () {
    ;(this.$.dialog as any).notifyResize()
  }

  init () {
    this.feedback = ''
    this.sharePublicly = true
  }

  open () {
    this.init()
    ;(this.$.dialog as any).open()
  }

  updateSimilar (e: any) {
    const item = e.model.item
    item.similar = true
    item.dissimilar = false
    e.model.item = null
    e.model.item = item
  }

  updateDissimilar (e: any) {
    const item = e.model.item
    item.similar = false
    item.dissimilar = true
    e.model.item = null
    e.model.item = item
  }
}

customElements.define('feedlight-form', FeedlightForm)
