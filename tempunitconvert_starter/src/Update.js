import * as R from 'ramda'

export const MSGS = {
  LEFT_VALUE_INPUT: 'LEFT_VALUE_INPUT',
  RIGHT_VALUE_INPUT: 'RIGHT_VALUE_INPUT',
  LEFT_UNIT_CHANGED: 'LEFT_UNIT_CHANGED',
  RIGHT_UNIT_CHANGED: 'RIGHT_UNIT_CHANGED',
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

export function leftUnitChangedMsg(leftUnit) {
  return {
    type: MSGS.LEFT_UNIT_CHANGED,
    leftUnit,
  }
}

export function rightUnitChangedMsg(rightUnit) {
  return {
    type: MSGS.RIGHT_UNIT_CHANGED,
    rightUnit,
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
  return convert({ ...model, sourceLeft, [type]: value })
}

function update(msg, model) {
  switch (msg.type) {
    case MSGS.LEFT_VALUE_INPUT: {
      return handleUpdateInput('leftValue', msg, model)
    }
    case MSGS.RIGHT_VALUE_INPUT: {
      return handleUpdateInput('rightValue', msg, model)
    }
    case MSGS.LEFT_UNIT_CHANGED: {
      const { leftUnit } = msg
      return convert({ ...model, leftUnit })
    }
    case MSGS.RIGHT_UNIT_CHANGED: {
      const { rightUnit } = msg
      return convert({ ...model, rightUnit })
    }
  }
  return model
}

// 單位轉換方法
function convert(model) {
  const { leftValue, leftUnit, rightValue, rightUnit } = model

  const [fromUnit, fromTemp, toUnit] = model.sourceLeft
    ? [leftUnit, leftValue, rightUnit]
    : [rightUnit, rightValue, leftUnit]

  const otherValue = R.pipe(convertFromToTemp, round)(fromUnit, toUnit, fromTemp)

  return model.sourceLeft ? { ...model, rightValue: otherValue } : { ...model, leftValue: otherValue }
}

function convertFromToTemp(fromUnit, toUnit, temp) {
  // 找到對應轉換單位方法
  // UnitConversions.Celsius.Fahrenheit
  const convertFn = R.pathOr(R.identity, [fromUnit, toUnit], UnitConversions)
  return convertFn(temp)
}

function round(number) {
  return Math.round(number * 10) / 10
}

function FtoC(temp) {
  return (5 / 9) * (temp - 32)
}

function CtoF(temp) {
  return (9 / 5) * temp + 32
}

function KtoC(temp) {
  return temp - 273.15
}

function CtoK(temp) {
  return temp + 273.15
}

const FtoK = R.pipe(FtoC, CtoK)
const KtoF = R.pipe(KtoC, CtoF)

const UnitConversions = {
  Celsius: {
    Fahrenheit: CtoF,
    Kelvin: CtoK,
  },
  Fahrenheit: {
    Celsius: FtoC,
    Kelvin: FtoK,
  },
  Kelvin: {
    Celsius: KtoC,
    Fahrenheit: KtoF,
  },
}

export default update
