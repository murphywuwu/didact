import test from 'ava'
import browserEnv from 'browser-env'

/** @jsx createElement **/
import { createElement } from '../src/element'
import Component from '../src/component'
import { render } from '../src/dom-render'

// Create document global var
browserEnv(['document']);


test.beforeEach(t => {
  const root = document.createElement('div');
  document.body.appendChild(root);
  t.context.root = root;
})

test.afterEach.always(t => {
  const root = t.context.root;
  root.innerHTML = '';
  document.body.removeChild(root);
})


test('maintain child state', t => {
  const root = t.context.root;
  
  class Child extends Component {
    constructor(props) {
      super(props);
      this.handleClick = this.handleClick.bind(this);
      this.state = {
        score: 0
      }
    }
    handleClick() {
      this.props.onChange();
      this.setState({
        score: this.state.score + 1
      })
    }
    render() {
      return (
        <div onClick={this.handleClick}>
          {this.props.name}-{this.state.score}
        </div>
      )
    }
  }

  class Parent extends Component {
    handleChange() {
      this.setState({
        somthing: 'bar'
      })
    }
    render() {
      return <div><Child name="Foo"  onChange={ this.handleChange.bind(this)}/></div>
    }
  }

  render(<Parent/>, root);

  t.is(root.innerHTML, '<div><div>Foo-0</div></div>')
  const evt = new Event("click", {"bubbles":true, "cancelable":false});
  root.firstChild.firstChild.dispatchEvent(evt);
  t.is(root.innerHTML, '<div><div>Foo-1`</div></div>')
})

test('update value property', t => {
  const root = t.context.root;
  let changeState;

  class Foo extends Component {
    constructor(props) {
      super(props);
      this.state = { value: 'init' }
      changeState = this.setState.bind(this)
    }
    render() {
      return <input value={this.state.value}/>
    }
  }
  render(<Foo/>, root);
  t.is(root.firstChild.value, 'init')

  changeState({ value: null })
  t.is(root.firstChild.value, '')
})