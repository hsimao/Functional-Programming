import * as R from 'ramda'

const MSGS = {
  SHOW_FORM: 'SHOW_FORM',
  MEAL_INPUT: 'MEAL_INPUT',
  CALORIES_INPUT: 'CALORIES_INPUT',
  SAVE_MEAL: 'SAVE_MEAL',
  EDIT_MEAL: 'EDIT_MEAL',
}

export function showFormMsg(showForm) {
  return {
    type: MSGS.SHOW_FORM,
    showForm,
  }
}

export function mealInputMsg(description) {
  return {
    type: MSGS.MEAL_INPUT,
    description,
  }
}

export function caloriesInputMsg(calories) {
  return {
    type: MSGS.CALORIES_INPUT,
    calories,
  }
}

export const saveMealMsg = { type: MSGS.SAVE_MEAL }

export function deleteMealMsg(id) {
  return {
    type: MSGS.DELETE_MEAL,
    id,
  }
}

export function editMealMsg(editId) {
  return {
    type: MSGS.EDIT_MEAL,
    editId,
  }
}

function update(msg, model) {
  switch (msg.type) {
    case MSGS.SHOW_FORM: {
      const { showForm } = msg
      return { ...model, showForm, description: '', calories: 0 }
    }
    case MSGS.MEAL_INPUT: {
      const { description } = msg
      return { ...model, description }
    }
    case MSGS.CALORIES_INPUT: {
      // 將字串轉換成數字, 預設值為 0
      const calories = R.pipe(parseInt, R.defaultTo(0))(msg.calories)
      return { ...model, calories }
    }
    case MSGS.SAVE_MEAL: {
      const { editId } = model
      const updatedModel = editId !== null ? edit(msg, model) : add(msg, model)

      return updatedModel
    }
    case MSGS.DELETE_MEAL: {
      const { id } = msg
      const meals = R.filter(meal => meal.id !== id, model.meals)
      return { ...model, meals }
    }
    case MSGS.EDIT_MEAL: {
      const { editId } = msg
      // 抓出當前選中的 meal 資料, 並顯示在表單編輯畫面
      const meal = model.meals.find(meal => meal.id === editId)
      const { description, calories } = meal

      return {
        ...model,
        editId,
        description,
        calories,
        showForm: true,
      }
    }
  }
  return model
}

// 送出表單後更新 model 資料的方法
function add(msg, model) {
  const { nextId, description, calories } = model
  const meal = { id: nextId, description, calories }
  const meals = [...model.meals, meal]

  return {
    ...model,
    meals,
    nextId: nextId + 1,
    description: '',
    calories: 0,
    showForm: false,
  }
}

function edit(msg, model) {
  const { description, calories, editId } = model
  const meals = model.meals.map(meal => {
    if (meal.id === editId) return { ...meal, description, calories }
    return meal
  })

  return {
    ...model,
    meals,
    description: '',
    calories: 0,
    showForm: false,
    editId: null,
  }
}

export default update
