import { h, diff, patch } from 'vitrual-dom'
import createElement from 'virtual-dom/create-element'

function app(initModel, update, view, node) {
  let model = initModel
  let currentView = view(dispatch, model)
  let rootNode = createElement(currentView)
  node.appendChild(rootNode)

  function dispatch(msg) {
    model = update(msg, model)
    const updatedView = view(dispatch, model)
    const patches = diff(currentView, updatedView)
    rootNode = patch(rootNode, patches)
  }
}

export default app
