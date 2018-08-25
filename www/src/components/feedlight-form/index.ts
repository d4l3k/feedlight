import {PolymerElement} from '@polymer/polymer/polymer-element.js'
import '@polymer/paper-button/paper-button.js'
import '@polymer/paper-dialog/paper-dialog.js'
import '@polymer/paper-input/paper-textarea.js'
import '@polymer/paper-checkbox/paper-checkbox.js'
import '@polymer/iron-icons/iron-icons.js'
import '../toggle-button'
import {PaperDialog} from '@polymer/paper-dialog/paper-dialog.js'

import {html} from '../../html'

import * as view from './template.html'

interface Feedback {
  feedback: string
  numSimilar: number
  response?: string
  similar?: boolean
  dissimilar?: boolean
}

export class FeedlightForm extends PolymerElement {
  similarFeedback?: Feedback[]
  sharePublicly?: boolean
  feedback?: string
  backendAddr = config.BACKEND_ADDR

  constructor () {
    super()
    this.init()
  }

  static get properties () {
    return {
      sharePublicly: {
        type: Boolean
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
    if (!feedback) {
      this.similarFeedback = []
    } else {
      this.similarFeedback = [
        {
          feedback: 'The app crashes when I try to post.',
          numSimilar: 10,
          response: "We're aware of the issue and a fix should be rolling out soon!"
        },
        {
          feedback: "It'd be nice to be able to insert emoji in our statuses.",
          numSimilar: 1
        }
      ]
    }
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

  similarityScore (f: Feedback): number {
    let score = f.numSimilar
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
