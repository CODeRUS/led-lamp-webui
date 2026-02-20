import React, { useEffect, useState } from 'react'
import { uploadSize, uploadBinary } from '../../helpers/requests'

const LABELS = {
  matrix: 'Matrix',
  connection: 'Connection',
  mqtt: 'MQTT',
  button: 'Button',
}

const FIELD_LABELS = {
  pin: 'Pin',
  width: 'Width',
  height: 'Height',
  segments: 'Segments',
  type: 'Type',
  maxBrightness: 'Max brightness',
  currentLimit: 'Current limit (mA)',
  rotation: 'Rotation',
  dither: 'Dither',
  order: 'Color order',
  mdns: 'mDNS name',
  apName: 'AP name',
  apPassword: 'AP password',
  ntpServer: 'NTP server',
  ntpOffset: 'NTP offset (sec)',
  hostname: 'Hostname',
  ssid: 'WiFi SSID',
  bssid: 'WiFi BSSID',
  password: 'Password',
  login: 'Login',
  host: 'Host',
  port: 'Port',
  username: 'Username',
  uniqueId: 'Unique ID',
  name: 'Name',
  model: 'Model',
  state: 'State',
}

const SELECT_OPTIONS = {
  'matrix.rotation': [
    { value: 0, label: '0 (0°)' },
    { value: 1, label: '1 (90°)' },
    { value: 2, label: '2 (180°)' },
    { value: 3, label: '3 (270°)' },
  ],
  'button.type': [
    { value: 0, label: 'Pull High' },
    { value: 1, label: 'Pull Low' },
  ],
  'button.state': [
    { value: 0, label: 'Default Open' },
    { value: 1, label: 'Default Close' },
  ],
}

const MATRIX_CORNER = [
  { value: 0x00, label: 'Top Left' },
  { value: 0x01, label: 'Bottom Left' },
  { value: 0x02, label: 'Top Right' },
  { value: 0x03, label: 'Bottom Right' },
]

const MATRIX_AXIS = [
  { value: 0x00, label: 'Rows (horizontal)' },
  { value: 0x04, label: 'Columns (vertical)' },
]

const MATRIX_SEQUENCE = [
  { value: 0x00, label: 'Progressive' },
  { value: 0x08, label: 'Zigzag' },
]

const MatrixTypePicker = ({ value, onChange }) => {
  const corner = value & 0x03
  const axis = value & 0x04
  const sequence = value & 0x08

  const update = (mask, bits) => {
    const cleared = value & ~mask
    onChange('type', cleared | bits)
  }

  return (
    <div className="settings-field">
      <label className="settings-label">Type</label>
      <div className="settings-bitmask">
        <select
          className="control"
          value={corner}
          onChange={(e) => update(0x03, parseInt(e.target.value))}
        >
          {MATRIX_CORNER.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <select
          className="control"
          value={axis}
          onChange={(e) => update(0x04, parseInt(e.target.value))}
        >
          {MATRIX_AXIS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <select
          className="control"
          value={sequence}
          onChange={(e) => update(0x08, parseInt(e.target.value))}
        >
          {MATRIX_SEQUENCE.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>
    </div>
  )
}

const IGNORED_ROOT_KEYS = ['activeEffect']
const IGNORED_FIELDS = {
  matrix: ['segments'],
}

const SettingsField = ({ name, value, section, onChange }) => {
  const label = FIELD_LABELS[name] || name
  const selectKey = section ? `${section}.${name}` : name

  if (selectKey === 'matrix.type') {
    return <MatrixTypePicker value={value} onChange={onChange} />
  }

  const options = SELECT_OPTIONS[selectKey]

  if (options) {
    return (
      <div className="settings-field">
        <label className="settings-label">{label}</label>
        <select
          className="control settings-input"
          value={value}
          onChange={(e) => onChange(name, parseInt(e.target.value))}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    )
  }

  if (typeof value === 'boolean') {
    return (
      <div className="settings-field">
        <span className="settings-label">{label}</span>
        <label className="switch">
          <input
            type="checkbox"
            checked={value}
            onChange={(e) => onChange(name, e.target.checked)}
          />
          <div />
        </label>
      </div>
    )
  }

  if (typeof value === 'number') {
    return (
      <div className="settings-field">
        <label className="settings-label">{label}</label>
        <input
          className="control settings-input"
          type="number"
          value={value}
          onChange={(e) => onChange(name, parseInt(e.target.value) || 0)}
        />
      </div>
    )
  }

  return (
    <div className="settings-field">
      <label className="settings-label">{label}</label>
      <input
        className="control settings-input"
        type={name.toLowerCase().includes('password') ? 'password' : 'text'}
        value={value}
        onChange={(e) => onChange(name, e.target.value)}
      />
    </div>
  )
}

const SettingsSection = ({ title, section, fields, onChange }) => {
  const ignored = IGNORED_FIELDS[section] || []
  return (
    <div className="settings-section">
      <h3 className="settings-section-title">{title}</h3>
      {Object.entries(fields).map(([key, value]) => {
        if (ignored.includes(key)) return null
        return (
          <SettingsField
            key={key}
            name={key}
            value={value}
            section={section}
            onChange={onChange}
          />
        )
      })}
    </div>
  )
}

export const Settings = ({ isOpen, onClose }) => {
  const [settings, setSettings] = useState(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!isOpen) return
    setError(null)
    fetch('/settings.json')
      .then((r) => {
        if (!r.ok) throw new Error('Failed to load settings')
        return r.json()
      })
      .then(setSettings)
      .catch((e) => setError(e.message))
  }, [isOpen])

  const handleSectionChange = (section) => (field, value) => {
    setSettings((prev) => ({
      ...prev,
      [section]: { ...prev[section], [field]: value },
    }))
  }

  const handleRootChange = (field, value) => {
    setSettings((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = () => {
    setSaving(true)
    setError(null)
    const json = JSON.stringify(settings)
    const blob = new Blob([json], { type: 'application/octet-stream' })
    uploadSize(blob.size)
      .then(() => uploadBinary(blob))
      .then(() => {
        setSaving(false)
        onClose()
      })
      .catch((e) => {
        setError('Failed to save: ' + e.message)
        setSaving(false)
      })
  }

  if (!isOpen) return null

  return (
    <>
      <div
        className={`modal-backdrop ${isOpen ? 'active' : ''}`}
        onClick={onClose}
      />
      <div className={`modal settings-modal ${isOpen ? 'active' : ''}`}>
        <h2 className="modal-heading">Settings</h2>
        {error && <div className="settings-error">{error}</div>}
        {!settings ? (
          <div>Loading...</div>
        ) : (
          <div className="settings-body">
            {Object.entries(settings).map(([key, value]) => {
              if (IGNORED_ROOT_KEYS.includes(key)) return null
              if (typeof value === 'object' && value !== null) {
                return (
                  <SettingsSection
                    key={key}
                    title={LABELS[key] || key}
                    section={key}
                    fields={value}
                    onChange={handleSectionChange(key)}
                  />
                )
              }
              return null
            })}
            {Object.entries(settings).map(([key, value]) => {
              if (IGNORED_ROOT_KEYS.includes(key)) return null
              if (typeof value === 'object' && value !== null) return null
              return (
                <SettingsField
                  key={key}
                  name={key}
                  value={value}
                  onChange={handleRootChange}
                />
              )
            })}
          </div>
        )}
        <div className="modal-actions">
          <button
            className="button mr-1"
            disabled={saving || !settings}
            onClick={handleSave}
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
          <button className="button" disabled={saving} onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </>
  )
}
