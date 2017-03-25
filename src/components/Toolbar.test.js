/* global expect, it */
const assign = require('lodash/assign')
const { Toolbar, mapStateToProps, mapDispatchToProps } = require('./Toolbar')
const h = require('inferno-hyperscript')
const { REFRESH } = require('../actions')
const { shallow } = require('../utils/Test')

it('dispatches action without payload', () => {
  const actions = []
  const dispatch = action => actions.push(action)
  const tree = shallow(h(Toolbar, assign(
    {},
    mapStateToProps({
      files: { showHidSys: true }
    }),
    mapDispatchToProps(dispatch)
  )))
  tree.children.filter(x => x.type === 'button')[0].events.on_pressed()
  expect(actions).toContain({ type: REFRESH })
})
