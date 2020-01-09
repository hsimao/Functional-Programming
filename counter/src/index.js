import h from 'hyperscript'
import hh from 'hyperscript-helpers'

const { div, button } = hh(h)

const MSGS = {
  ADD: 'ADD',
  SUBTRACT: 'SUBTRACT',
}

const initModel = 0

function view(dispatch, model) {
  return div({ className: 'mv2' }, [
    div(`Count: ${model}`),
    button({ className: 'pv1 ph2 mr2', onclick: () => dispatch(MSGS.ADD) }, '+'),
    button({ className: 'pv1 ph2', onclick: () => dispatch(MSGS.SUBTRACT) }, '-'),
  ])
}

function update(msg, model) {
  switch (msg) {
    case MSGS.ADD:
      return model + 1
    case MSGS.SUBTRACT:
      return model - 1
    default:
      return model
  }
}

function app(initModel, update, view, node) {
  let model = initModel
  let currentView = view(dispatch, model)
  node.appendChild(currentView)
  function dispatch(msg) {
    model = update(msg, model)
    const updatedView = view(dispatch, model)
    node.replaceChild(updatedView, currentView)
    currentView = updatedView
  }
}

const rootNode = document.getElementById('app')

app(initModel, update, view, rootNode)
