import { type Component, VNode } from 'vue'

export type ComponentsMap = Record<string, {
    name: string,
    component: Component
  }>

interface Loader {
  renderText: (el: HTMLElement) => any
  // @ts-ignore TODO
  renderElement: (el: HTMLElement, children) => any
  renderRoot: (vnode: VNode) => Component
}

interface RendererConstructorArguments {
  value: string
  loader?: Loader
}
export default class Renderer {
  value: string
  loader?: Loader
  dom: HTMLElement[] | Element[] | null

  constructor ({ value, loader }: RendererConstructorArguments) {
    if (!loader) {
      console.warn('Attention! Your string will be just converted to regular DOM tree without loader!')
    }

    this.value = value
    this.dom = null
    this.loader = loader
    this.init()
  }

  htmlString2DOMArray (value: string | undefined = undefined) {
    const dom = document.createElement('div')
    
    dom.innerHTML = value || this.value

    return [...dom.children]
  }

  recursiveConvert(el: HTMLElement): any {
    const isTextNode = el.nodeName === '#text'

    if (this.loader) {
      if (isTextNode) {
        return this.loader.renderText(el)
      }

      return this.loader.renderElement(el, [...el.childNodes].reduce((acc, child) => {
        if (!this.ignoreDuringConvertChildren(child as HTMLElement)) {
          acc.push(this.recursiveConvert(child as HTMLElement))
        }

        return acc
      }, [] as any[]))
    } else {
      return el
    }
  }

  ignoreDuringConvertChildren (el: HTMLElement): boolean {
    return el.textContent === '\n' || el.textContent === '\\n'
  }

  render () {
    if (this.dom && this.loader) {
      const vDOM = this.dom.map((entry) => {
        return this.recursiveConvert(entry as HTMLElement)
      })
      // @ts-ignore
      return this.loader && this.loader.renderRoot(vDOM)
    }
  }

  init () {
    this.dom = this.htmlString2DOMArray()
  }
}
