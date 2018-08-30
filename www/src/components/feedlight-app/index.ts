import {PolymerElement} from '@polymer/polymer/polymer-element.js'
import '@polymer/app-route/app-location.js'
import '@polymer/app-route/app-route.js'
import '@polymer/iron-pages/iron-pages.js'
import '@polymer/app-layout/app-header/app-header.js'
import '@polymer/app-layout/app-toolbar/app-toolbar.js'
import '@polymer/paper-progress/paper-progress.js'

import {html} from '../../html'
import {incr, decr, setCallback} from '../../loading'

import * as view from './template.html'

export class FeedlightApp extends PolymerElement {
  private tmpl?: HTMLTemplateElement
  private element: string = ''
  private loading: number = 0

  static get template (): HTMLTemplateElement {
    return html(view)
  }

  connectedCallback () {
    super.connectedCallback()

    setCallback((loading) => {
      this.loading = loading
    })
  }

  static get observers () {
    return [
      'updatePage(data.page)'
    ]
  }

  updatePage (page: string) {
    incr()

    console.log('Page:', page)

    let imp: Promise<{}>
    if (!page) {
      imp = import(/* webpackChunkName: "indexPage" */ '../index-page')
      this.element = 'index-page'
    } else if (page === 'feedback') {
      imp = import(/* webpackChunkName: "feedbackPage" */ '../feedback-page')
      this.element = 'feedback-page'
    } else {
      imp = import(/* webpackChunkName: "notFoundPage" */ '../not-found-page')
      this.element = 'not-found-page'
    }

    imp.then(() => {
      decr()
    }).catch(err => {
      console.error(err)
      decr()
    })
  }

  eq (a: any, b: any): boolean {
    return a === b
  }
}

customElements.define('feedlight-app', FeedlightApp)
