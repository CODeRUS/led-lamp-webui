import React from 'react'
import { websocket } from './helpers/requests'
import { Effects } from './components/Effects'
import { Header } from './components/Header'
import { Settings } from './components/Settings'

class App extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      effects: [],
      alarms: [],
      working: null,
      activeEffect: null,
      modalIsOpen: false,
      settingsOpen: false,
      webSocketConnection: false,
    }
  }

  initWebSocket() {
    websocket.onopen = () => {
      console.log('WebSocket connection opened')
      this.setState({ webSocketConnection: true })
    }
    websocket.onmessage = (message) => {
      console.log(`WS message: `, message)
      const data = JSON.parse(message.data)
      this.setState({ ...data })
    }
    websocket.onclose = () => {
      console.log('WebSocket disconnected')
      this.setState({ webSocketConnection: false })
    }
    websocket.onerror = (error) => {
      console.log('WebSocket connection error: ' + JSON.stringify(error))
    }
  }

  componentWillMount() {
    this.initWebSocket()
  }

  render() {
    return (
      <>
        <Header
          powerOn={this.state.working}
          webSocketConnection={this.state.webSocketConnection}
          onSettingsOpen={() => this.setState({ settingsOpen: true })}
        />
        <div className="container">
          {Number.isInteger(this.state.activeEffect) ? (
            <Effects activeWSEffect={this.state.activeEffect} />
          ) : (
            'loading...'
          )}
        </div>
        <Settings
          isOpen={this.state.settingsOpen}
          onClose={() => this.setState({ settingsOpen: false })}
        />
      </>
    )
  }
}

export default App
