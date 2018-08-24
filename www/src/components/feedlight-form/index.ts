import {PolymerElement} from '@polymer/polymer/polymer-element.js'
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-dialog/paper-dialog.js';
import '@polymer/paper-input/paper-textarea.js';
import '@polymer/paper-checkbox/paper-checkbox.js';
import {PaperDialog} from '@polymer/paper-dialog/paper-dialog.js';

import {html} from '../../html'

import * as view from './template.html'

interface Feedback {
  feedback: string
  similar: number
  response?: string
}

export class FeedlightForm extends PolymerElement {
  similarFeedback?: Feedback[]

  static get properties () {
    return {
      sharePublicly: {
        type: Boolean,
        value: true,
      },
      feedback: {
        type: String,
      },
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

  connectedCallback () {
    super.connectedCallback()
  }

  ready () {
    super.ready()
  }

  findSimilar (feedback: string) {
    this.similarFeedback = [
      {
        feedback: "The app crashes when I try to post.",
        similar: 10,
        response: "We're aware of the issue and a fix should be rolling out soon!",
      },
      {
        feedback: "It'd be nice to be able to insert emoji in our statuses.",
        similar: 1,
      },
    ]
  }

  open () {
    (this.$.dialog as PaperDialog).open()
  }
}

customElements.define('feedlight-form', FeedlightForm)
