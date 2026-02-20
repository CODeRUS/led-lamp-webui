import React, { useEffect, useState } from 'react'
import { EffectsPicker } from './components/EffectsPicker'
import { EffectControl } from './components/EffectControls'
import { sendWSEvent } from '../../helpers/requests'
import { EVENTS } from '../../helpers/constants'

const TAB_CONTROL = 'control'
const TAB_PICKER = 'picker'

export const Effects = ({ activeWSEffect }) => {
  const [effects, setEffects] = useState([])
  const [activeEffect, setActiveEffect] = useState(activeWSEffect)
  const [activeTab, setActiveTab] = useState(TAB_CONTROL)

  useEffect(() => {
    let fetchEffects = async () => {
      try {
        let response = await fetch('/effects.json')
        if (response.ok) {
          let text = await response.text()
          try {
            setEffects(JSON.parse(text))
          } catch (e) {
            console.log(e)
          }
        } else {
          console.log('Error loading settings: ' + response.status)
        }
      } catch (e) {
        console.log(e)
      }
    }

    fetchEffects()
  }, [])

  useEffect(() => {
    if (activeWSEffect !== activeEffect) {
      setActiveEffect(activeWSEffect)
    }
  }, [activeWSEffect]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (activeWSEffect !== activeEffect) {
      sendWSEvent(EVENTS.activeEffect, activeEffect)
    }
  }, [activeEffect]) // eslint-disable-line react-hooks/exhaustive-deps

  const effectName = effects[activeEffect] ? effects[activeEffect].n : ''

  return (
    <div>
      <div className="tabs">
        <button
          className={`tab ${activeTab === TAB_CONTROL ? 'active' : ''}`}
          onClick={() => setActiveTab(TAB_CONTROL)}
        >
          {effectName || 'Control'}
        </button>
        <button
          className={`tab ${activeTab === TAB_PICKER ? 'active' : ''}`}
          onClick={() => setActiveTab(TAB_PICKER)}
        >
          Effects
        </button>
      </div>
      <div className="layout">
        <div className={`panel ${activeTab !== TAB_CONTROL ? 'mobile-hidden' : ''}`}>
          <EffectControl
            effect={effects[activeEffect]}
            activeEffect={activeEffect}
            setEffects={setEffects}
          />
        </div>
        <div className={`panel ${activeTab !== TAB_PICKER ? 'mobile-hidden' : ''}`}>
          <EffectsPicker
            effects={effects}
            activeEffect={activeEffect}
            setActiveEffect={setActiveEffect}
          />
        </div>
      </div>
    </div>
  )
}
