/* global expect, it */
const actions = require('../../actions')
const filesActions = require('../../actions/files')
const reducer = require('./tabs').default

it('saves cursor', () => {
  let state = {
    '1': {
      cursor: 0,
      selected: []
    }
  }

  const action = filesActions.cursor({
    tabId: 1,
    cursor: 2
  })
  state = reducer(state, action)
  expect(state[1].cursor).toEqual(2)
})

it('saves selected', () => {
  let state = {
    '1': {
      cursor: 0,
      selected: []
    }
  }

  const action = filesActions.selected({
    tabId: 1,
    selected: [3, 4, 5]
  })
  state = reducer(state, action)
  expect(state[1].selected).toEqual([3, 4, 5])
})

it('sorts files in tab', () => {
  let action
  let state = {
    '0': {
      files: [
        ['config.sub', 2],
        ['usb.ids', 1],
        ['magic.mgc', 0],
        ['pci.ids', 4],
        ['node_modules', 5, true],
        ['config.guess', 3]
      ].map(([name, modificationTime, isDir]) => ({
        name: name,
        modificationTime: modificationTime,
        fileType: isDir ? 'DIRECTORY' : 'REGULAR'
      })),
      sortedBy: undefined
    }
  }

  action = filesActions.sorted({ tabId: 0, by: 'filename' })
  state = reducer(state, action)
  expect(state[0].files.map(x => x.name)).toEqual([
    'node_modules',
    'config.guess',
    'config.sub',
    'magic.mgc',
    'pci.ids',
    'usb.ids'
  ])

  action = filesActions.sorted({ tabId: 0, by: 'filename' })
  state = reducer(state, action)
  expect(state[0].files.map(x => x.name)).toEqual([
    'node_modules',
    'usb.ids',
    'pci.ids',
    'magic.mgc',
    'config.sub',
    'config.guess'
  ])

  action = filesActions.sorted({ tabId: 0, by: 'ext' })
  state = reducer(state, action)
  expect(state[0].files.map(x => x.name)).toEqual([
    'node_modules',
    'config.guess',
    'pci.ids',
    'usb.ids',
    'magic.mgc',
    'config.sub'
  ])

  action = filesActions.sorted({ tabId: 0, by: 'ext' })
  state = reducer(state, action)
  expect(state[0].files.map(x => x.name)).toEqual([
    'node_modules',
    'config.sub',
    'magic.mgc',
    'usb.ids',
    'pci.ids',
    'config.guess'
  ])

  action = filesActions.sorted({ tabId: 0, by: 'mtime' })
  state = reducer(state, action)
  expect(state[0].files.map(x => x.name)).toEqual([
    'node_modules',
    'magic.mgc',
    'usb.ids',
    'config.sub',
    'config.guess',
    'pci.ids'
  ])

  action = filesActions.sorted({ tabId: 0, by: 'mtime' })
  state = reducer(state, action)
  expect(state[0].files.map(x => x.name)).toEqual([
    'node_modules',
    'pci.ids',
    'config.guess',
    'config.sub',
    'usb.ids',
    'magic.mgc'
  ])
})

it('saves files list on ls success', () => {
  let action
  let state = {
    '0': {
      files: [],
      sortedBy: 'ext'
    }
  }

  action = actions.ls(0, 'file:///')
  expect(reducer(state, action)).toBe(state)

  action = actions.lsSuccess({
    tabId: 0,
    result: {
      files: [
        ['config.sub', 2],
        ['usb.ids', 1],
        ['magic.mgc', 0],
        ['pci.ids', 4],
        ['node_modules', 5, true],
        ['config.guess', 3]
      ].map(([name, modificationTime, isDir]) => ({
        name: name,
        modificationTime: modificationTime,
        fileType: isDir ? 'DIRECTORY' : 'REGULAR'
      }))
    }
  })
  state = reducer(state, action)
  expect(state[0].files.map(x => x.name)).toEqual([
    'node_modules',
    'config.guess',
    'pci.ids',
    'usb.ids',
    'magic.mgc',
    'config.sub'
  ])
})
