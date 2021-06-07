import { RGBColorToHEX } from '../helpers/utils'

export const fieldsConf = {
  effects: {
    i: {
      disabled: true,
      type: 'text',
    },
    n: {
      type: 'text',
    },
    s: {
      type: 'range',
      min: 0,
      max: 255,
    },
    l: {
      type: 'range',
      min: 0,
      max: 100,
    },
    b: {
      type: 'range',
      min: 0,
      max: 255,
    },
  },
  alarms: {
    time: {
      type: 'time',
    },
    color: {
      type: 'text',
    },
    enabled: {
      type: 'checkbox',
    },
  },
}

export const calcInputProps = (key, value) => {
  const inputProps = fieldsConf.effects[key]
  if (!inputProps && typeof value === `boolean`) {
    return {
      type: 'checkbox',
    }
  }
  if (key.toLowerCase().includes('color'))
    return {
      type: 'color',
    }
  if (!inputProps && Number.isInteger(value)) {
    return {
      type: 'range',
      min: 0,
      max: 255,
    }
  }
  return inputProps
}

export const calcInputValue = (key, value) => {
  if (key.toLowerCase().includes('color') && value)
    try {
      return RGBColorToHEX(value)
    } catch (e) {
      console.warn("Failed to deserialize RGB color", e);
      return "#000000";
    }
  return value
}
