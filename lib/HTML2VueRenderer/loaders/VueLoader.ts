import { createTextVNode, h, defineComponent, type Component, VNode } from "vue"

type ElementAttrDataType = 'attribute' | 'prop' | 'listener'

interface ElementAttrData {
  type: ElementAttrDataType
  attr: string
  rawAttr: string
  value: any
}

export class VueLoader {
  components?: Record<string, Component>
  props?: Record<string, any>
  constructor ({ components, props = {} }: { components: Record<string, Component>, props: Record<string, any> }) {
    this.components = this.getInitedComponents(components)
    this.props = props
  }
  getInitedComponents (components: Record<string, Component>): Record<string, Component> {
    return Object.entries(components).reduce((acc, [key, value]) => {
      const upperKey = key.toUpperCase()
      acc[upperKey] = value
      return acc
    }, {} as Record<string, Component>)
  }
  getAttrs (el: HTMLElement): ElementAttrData[] {
    const attrs = el.getAttributeNames()

    return attrs.map((attr) => this.getAttrData(el, attr))
  }
  getAttrData(el: HTMLElement, key: string): ElementAttrData {
    const first = key[0]

    switch (first) {
      case ':':
        return {
          type:'prop', 
          attr: key.slice(0, 1),
          rawAttr: key, 
          value: this.getAttributeValue(el, key.slice(0, 1)) 
        }
      case '@':
        return {
          type:'listener', 
          attr: key.slice(0, 1), 
          rawAttr: key, 
          value: this.getAttributeValue(el, key.slice(0, 1)) 
        }
      default:
        return {
          type:'attribute', 
          attr: key, 
          rawAttr: key, 
          value: el.getAttribute(key)
        }
    }
  }
  getAttributeValue (el: HTMLElement, key: string) {
    if (this.props && this.props[key]) return this.props[key]

    return el.getAttribute(key)
  }
  resolveComponent (el: HTMLElement): any {
    const { tagName, nodeName } = el

    if (this.components && this.components[tagName]) {
      return this.components[tagName]
    }

    return nodeName
  }
  resolveProps(attrs: ElementAttrData[]) {
    return attrs.reduce((acc, attr) => {
      if (attr.type != 'listener') {
        acc[attr.attr] = attr.value
      }

      return acc
    }, {} as Record<string, any>)
  }
  renderText (el: HTMLElement): ReturnType<typeof createTextVNode> {
    return createTextVNode(el.textContent || '')
  }
  renderElement(el: HTMLElement, children: HTMLElement[]) {
    const component = this.resolveComponent(el)
    const attrs = this.getAttrs(el)
    const props = this.resolveProps(attrs)
    
    return h(component, props, {
      default: () => children
    })
  }
  renderRoot (root: any) {
    return defineComponent({
      setup () {
        return root
      }
    })
  }
}
