/* global imports */
const { connect } = require('inferno-redux')
const { exec } = require('../actions')
const h = require('inferno-hyperscript')
const getActiveTabId = require('../selectors/getActiveTabId').default
const Pango = imports.gi.Pango

exports.Prompt = ({ handleActivate, location }) => {
  return (
    h('box', { expand: false }, [
      h('box', { border_width: 4 }),
      h('label', {
        ellipsize: Pango.EllipsizeMode.MIDDLE,
        label: location.replace(/^file:\/\//, '') + '$'
      }),
      h('box', { border_width: 4 }),
      h('entry', { expand: true, on_activate: handleActivate })
    ])
  )
}

exports.mapStateToProps = state => ({
  location: state.entities.tabs[getActiveTabId(state)].location
})

exports.mapDispatchToProps = dispatch => ({
  handleActivate: node => {
    if (node.text) {
      dispatch(exec(node.text))
    }
  }
})

exports.default = connect(
  exports.mapStateToProps,
  exports.mapDispatchToProps
)(exports.Prompt)
