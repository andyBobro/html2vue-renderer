import type { Component } from "vue"
import { h, defineComponent, createTextVNode } from 'vue'


export type ComponentsMap = Record<string, {
    name: string,
    component: Component
  }>

interface RendererProps {
  value: string
  componentsMap: ComponentsMap
}
export default class Renderer implements RendererProps {
  value: string
  componentsMap: ComponentsMap
  DOM: HTMLElement[] | Element[] | null
  vDOM: any

  constructor (props: Record<string, string | ComponentsMap>) {
    this.value = props.value as string
    this.componentsMap = props.componentsMap as ComponentsMap
    this.DOM = null
    this.vDOM = null
    this.init()
  }

  initDOM (value: string | undefined  = undefined) {
    const DOM = document.createElement('div')
    
    DOM.innerHTML = value || this.value

    return [...DOM.children]
  }

  initComponentsMap () {
    return Object.entries(this.componentsMap).reduce((_, [name, component]) => {
      _[name.toUpperCase()] = {
        name,
        component
      }

      return _
    }, {} as Record<string, unknown>)
  }

  getPropsData (el: HTMLElement, props: Record<string, unknown>, tagName: string) {
    if (el.nodeName === '#text') {
      return {}
    }
    
    const attrsArr = el.getAttributeNames()
    const propsData = attrsArr.reduce((_, attr) => {
      const isProp = attr[0] === ':'
      const isListener = attr[0] === '@'
      const attrValue = el.getAttribute(attr)
      if (isProp) {
        const propName = attr.slice(1)
        _[propName] = {
          name: propName,
          value: props?.[`${tagName}.${attrValue}`],
          isProp,
          isListener,
          fullName: `:${propName}`
        }
      } else if (isListener) {
        const propName = attr.slice(1)
        _[propName] = {
          name: propName,
          value: props?.[`${tagName}.${attrValue}`],
          isProp,
          isListener,
          fullName: `:${propName}`
        }
      } else {
        _[attr] = {
          name: attr,
          value: attrValue,
          isProp,
          isListener
        }
      }

      return _
    }, {} as Record<string, unknown>)
    
    return propsData
  }

  renderVNode ({component, propsData, children}: {component: Component, propsData: Record<string, unknown>, children: unknown[]}) {
    const props = Object.entries(propsData).reduce((_, [name, data]) => {
      _[name] = (data as Record<string, unknown>).value
      
      return _
    }, {} as Record<string, unknown>)
    

    const vNode = h(component, props, {
      default: () => children
    })

    return vNode
  }

  renderTextVNode (textContent: string) {
    return createTextVNode(textContent)
  }

  el2VNode (el: HTMLElement, props: Record<string, unknown>) {
    let vNodePayload: any = null
    const hasComponent = !!this.componentsMap[el.tagName]
    const propsData = this.getPropsData(el, props, el.tagName)
    
    const isTextNode = el.nodeName === '#text'
    if (hasComponent) {
      const { component } = this.componentsMap[el.tagName]
      vNodePayload = {
        component,
        propsData,
      }
    } else {
      vNodePayload = {
        component: el.nodeName,
        propsData,
      }
    }

    vNodePayload.isTextNode = isTextNode

    if (el.childNodes.length) {
      vNodePayload.children = [...el.childNodes].reduce((_, child) => {
        const isTextNode = child.nodeName === '#text'
        const isContentLineBreak = child.textContent === '\n' || child.textContent === '\\n'

        if (isTextNode && !isContentLineBreak) {
          _.push(this.el2VNode(child as HTMLElement, props))
        }
        
        if (!isTextNode && !isContentLineBreak) {
          _.push(this.el2VNode(child as HTMLElement, props))
        }

        return _
      }, [] as unknown[])
    }
    
    const vNode = isTextNode ? this.renderTextVNode(el.textContent || '') : this.renderVNode(vNodePayload)

    return vNode
  }



  render (props: Record<string, unknown>) {
    if (!this.DOM) return []

    const vDOM = this.DOM.map((entry) => {
      return this.el2VNode(entry as HTMLElement, props)
    })

    return defineComponent({
      setup () {
        return vDOM
      }
    })
  }

  init () {
    this.DOM = this.initDOM()
    this.componentsMap = this.initComponentsMap() as ComponentsMap
  }

  destroy () {
    
  }
}
