import test from 'ava';
/** @jsx element **/
import { createElement } from '../src/element'
import Component from '../src/component'

test('create component', t => {
  class Foo extends Component {
    render () {
      return <div/>
    }
  }

  const element = <Foo/>;
  const expected = { type: Foo, props: {} };
  t.deepEqual(element, expected)
})

test('create component with props', t => {
  class Foo extends Component {
    render() {
      return <div/>
    }
  }

  const element = <Foo foo="bar"/>
  const expected = { type: Foo, props: { foo: 'bar' } }

  t.deepEqual(element, expected);
})

test('create nested Components', t => {
  class Foo extends Component {
    render() {
      return <div/>
    }
  }

  const element = <Foo><Foo/></Foo>
  const expectedChild = { type: Foo, props: {} }
  const expected = { type: Foo, props: { children: [expectedChild] } }

  t.deepEqual(element, expected);
})