

class DomComponent {
  constructor(element) {
    this.currentElement = element;
    this.dom = null;
    this.childInstances = null
  }
  mount() {
    const { type, props } = this.currentElement;
    this.dom = document.createElement(type);
    
    // set attribute
    Object.keys(props).filter(isAttribute).forEach(name => {
      const value = props[name];
      if (value !== null && value !== false) {
        this.dom.setAttribute(name, value)
      }
    })

    // set event
    Object.keys(props).filter(isEvent).forEach(name => {
      const eventType = name.toLowerCase().substring(2);
      this.dom.addEventListener(eventType, props[name])
    })

    // set children
    const childElements = props.children || [];
    this.childInstances = childElements.filter(child => child !== null).map(instantiate).forEach(childDom => this.dom.appendChild(childDom))

    return this.dom;
  }

  update(nextElement) {
    const prevProps = this.currentElement.props;
    const nextProps = nextElement.props;

    // remove attributes
    Object.keys(prevProps).filter(isAttribute).forEach(name => {
      this.dom.removeAttribute(name);
    })

    // set attribute
    Object.keys(nextProps).filter(isAttribute).forEach(name => {
      const value = nextProps[name];
      if (value !== null && value !== false) {
        this.don.setAttribute(name, value)
      }
    })

    // remove events
    Object.keys(prevProps).filter(isEvent).forEach(name => {
      const eventType = name.toLowerCase().substring(2);
      this.dom.removeEventListener(eventType, prevProps[name]);
    })

    // set events
    Object.keys(nextProps).filter(isEvent).forEach(name => {
      const eventType = name.toLowerCase().substring(2);
      this.dom.addEventListener(eventType, nextProps[name])
    })

    // update children
    // obj sub tree(obj format as dom)
    const prevChildElements = nextProps.children || [];
    const nextChildElements = nextProps.children || [];

    // dom sub tree
    const prevChildInstances = this.childInstances;
    const nextChildInstances = [];
    const length = Math.max(prevChildElements.length, nextChildElements.length);

    for (let i = 0; i < length; i++) {
      const prevChildElement = prevChildElements[i];
      const nextChildElement = nextChildElements[i];

      if (!prevChildElement) {
        // add new child

      }

    }
  }
  getDom() {
    return this.dom;
  }
}

class TextComponent {
  constructor(element) {
    this.text = '' + element
  }
  mount() {
    return document.createTextNode(this.text);
  }
  update(nextElement) {
    const nextText = '' + nextElement;
    return document.createTextNode(nextText);
  }
} 

export function instantiate(element) {
  if (typeof element == 'string' || typeof element == 'number') {
    return new TextComponent(element);
  }
  else if (typeof element.type == 'string') {
    return new DomComponent(element)
  }
  else {
    return new CompositeComponent(element)
  }
}

const isEvent = name => name.startsWith("on");
const isAttribute = name => !isEvent(name) && name !== 'children'