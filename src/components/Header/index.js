import React from 'react'
import { PowerButton } from '../PowerButton'
import { WSReconnectButton } from '../WSReconnectButton'
import { UpdateModal } from '../UpdateModal'
import { EmojiBtn } from '../EmojiBtn'

export const Header = ({ powerOn, webSocketConnection, onSettingsOpen }) => (
  <div className={`header ${webSocketConnection ? 'active' : 'disconnected'}`}>
    <div className="container">
      <div className="header-layout">
        <h1 className="heading">LED - {powerOn ? 'working' : 'not working'}</h1>
        <div>
          <WSReconnectButton />
          <PowerButton powerOn={powerOn} />
          <UpdateModal />
          <EmojiBtn title="Settings" onClick={onSettingsOpen}>
            {String.fromCodePoint(0x2699, 0xFE0F)}
          </EmojiBtn>
          <EmojiBtn
            title="WiFi"
            onClick={() => {
              window.location.href = '/wifi.html'
            }}
          >
            {String.fromCodePoint(0x1f4e1)}
          </EmojiBtn>
        </div>
      </div>
    </div>
  </div>
)
