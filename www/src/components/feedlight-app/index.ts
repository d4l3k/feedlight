import {PolymerElement} from '@polymer/polymer/polymer-element.js'
import '@polymer/app-route/app-location.js'
import '@polymer/app-route/app-route.js'
import '@polymer/iron-pages/iron-pages.js'
import '@polymer/app-layout/app-header/app-header.js'
import '@polymer/app-layout/app-toolbar/app-toolbar.js'
import '@polymer/paper-progress/paper-progress.js'

import {html} from '../../html'

import * as view from './template.html'

export class FeedlightApp extends PolymerElement {
  private tmpl?: HTMLTemplateElement
  private element: string = ''
  private loading: number = 0

  static get template (): HTMLTemplateElement {
    return html(view)
  }

  static get observers () {
    return [
      'updatePage(data.page)'
    ]
  }

  incrLoading () {
    this.loading += 1
  }

  decrLoading () {
    this.loading -= 1
  }

  updatePage (page: string) {
    this.incrLoading()

    console.log('Page:', page)

    let imp: Promise<{}>
    if (!page) {
      imp = import(/* webpackChunkName: "indexPage" */ '../index-page')
      this.element = 'index-page'
    } else if (page === 'feedback') {
      imp = import(/* webpackChunkName: "indexPage" */ '../feedback-page')
      this.element = 'index-page'
    } else {
      imp = import(/* webpackChunkName: "notFoundPage" */ '../not-found-page')
      this.element = 'not-found-page'
    }

    imp.then(() => {
      this.decrLoading()
    }).catch(err => {
      console.error(err)
      this.decrLoading()
    })
  }

  eq (a, b) {
    return a === b
  }
}

customElements.define('feedlight-app', FeedlightApp)
