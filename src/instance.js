
class CompositeComponent {
  
}

class DomComponent {
  constructor(element) {
    // 虚拟节点实例化
    this.currentElement = element;
    this.dom = null;
    this.childInstances = null
  }
  mount() {
    const { type, props } = this.currentElement;
    this.dom = document.createElement(type);

    // 构建真实的dom
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
    
    // 虚拟子节点实例化
    this.childInstances = childElements.filter(child => child !== null).map(instantiate)
    
    this.childInstances.map(childInstance => 
      // 构建真实的子节点
      childInstance.mount()
    ).forEach(childDom => this.dom.appendChild(childDom))

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
    // 虚拟子节点树
    const prevChildElements = nextProps.children || [];
    const nextChildElements = nextProps.children || [];

    // 实例子节点树
    const prevChildInstances = this.childInstances;
    const nextChildInstances = [];
    const length = Math.max(prevChildElements.length, nextChildElements.length);

    for (let i = 0; i < length; i++) {
      const prevChildElement = prevChildElements[i];
      const nextChildElement = nextChildElements[i];

      if (!prevChildElement) {
        // add new child
        const childInstance = instantiate(nextChildElement);
        nextChildInstances.push(childInstance);
        const childDom = childInstance.mout();
        this.dom.appendChild(childDom);
      }
      else if (!nextChildElement) {
        // remove old child
        const childInstance = prevChildInstances[i];
        const childDom = childInstance.getDom();
        this.dom.removeChild(childDom)
      }
      else if (prevChildElement.type && prevChildElement.type == nextChildElement.type) {
        // update child
        const childInstance = prevChildInstances[i];
        nextChildInstances.push(childInstance);
        childInstance.update(nextChildElement);
      }
      else {
        // replace old with new
        const nextChildInstance = instantiate(nextChildElement);
        nextChildInstances.push(nextChildInstance);
        const nextChildDom = nextChildInstance.mount();
        const prevChildInstance = prevChildInstances[i];
        const prevChildDom = prevChildInstance.getDom(); // FIX fails for text
        this.dom.replaceChild(nextChildDom, prevChildDom);
      }
    }

    this.currentElement = nextElement;
    this.childInstances = nextChildInstances;
  }
  getDom() {
    return this.dom;
  }
}

class TextComponent {
  constructor(element) {
    this.text = '' + element
    this.dom = null
  }
  mount() {
    this.dom = document.createTextNode(this.text);
    return this.dom;
  }
  update(nextElement) {
    const nextText = '' + nextElement;
    this.dom.nodeValue = nextText;
  }
  getDom() {
    return this.dom;
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