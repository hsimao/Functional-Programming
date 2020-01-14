import * as R from 'ramda'

export const MSGS = {
  LEFT_VALUE_INPUT: 'LEFT_VALUE_INPUT',
  RIGHT_VALUE_INPUT: 'RIGHT_VALUE_INPUT',
}

export function leftValueInputMsg(leftValue) {
  return {
    type: MSGS.LEFT_VALUE_INPUT,
    leftValue,
  }
}

export function rightValueInputMsg(rightValue) {
  return {
    type: MSGS.RIGHT_VALUE_INPUT,
    rightValue,
  }
}

// 將字串轉成純數字
const toInt = R.pipe(parseInt, R.defaultTo(0))

function handleUpdateInput(type, msg, model) {
  const sourceLeft = type === 'leftValue' ? true : false
  if (msg[type] === '') {
    return { ...model, sourceLeft, leftValue: '', rightValue: '' }
  }
  const value = toInt(msg[type])
  return { ...model, sourceLeft, [type]: value }
}

function update(msg, model) {
  switch (msg.type) {
    case MSGS.LEFT_VALUE_INPUT: {
      return handleUpdateInput('leftValue', msg, model)
    }
    case MSGS.RIGHT_VALUE_INPUT: {
      return handleUpdateInput('rightValue', msg, model)
    }
  }
  return model
}

export default update
