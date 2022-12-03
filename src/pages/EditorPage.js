import React, { useEffect, useRef, useState } from 'react'
import Client from '../components/Client.'
import Editor from '../components/Editor'
import { initSocket } from '../socket'
import ACTIONS from '../actions'
import { useLocation, useParams, useNavigate, Navigate } from 'react-router-dom'
import toast from 'react-hot-toast'

const EditorPage = () => {
  const socketRef = useRef(null)
  const codeRef = useRef(null)
  const effectRan = useRef(false)
  const [clients, setLients] = useState([])
  const location = useLocation()
  const { roomId } = useParams()
  const reactNavigator = useNavigate()


  useEffect(() => {
    if (effectRan.current == true) {
      const init = async () => {
        socketRef.current = await initSocket()
        socketRef.current.on('connect_error', (err) => handleErrors(err))
        socketRef.current.on('connect_failed', (err) => handleErrors(err))
        function handleErrors(err) {
          toast.error('Socket lỗi')
          reactNavigator('/')
        }

        socketRef.current.emit(ACTIONS.JOIN, {
          roomId,
          username: location.state?.username
        })

        socketRef.current.on(ACTIONS.JOINED, ({ clients, username, socketId }) => {
          if (username !== location.state?.username) {
            toast.success(`${username} đã tham gia nhóm`)
          }
          setLients(clients)
          socketRef.current.emit(ACTIONS.SYNC_CODE, {
            code: codeRef.current,
            socketId,
          });
        })

        socketRef.current.on(ACTIONS.DISCONNECTED, ({ socketId, username }) => {
          toast.success(`${username} đã rời khỏi phòng!`)
          setLients((prev) => {
            return prev.filter(client => client.socketId !== socketId)
          })
        })
      }
      init()
    }
    return () => {
      effectRan.current = true
    }
  }, [])

  if (!location.state) {
    return <Navigate to='/' />
  }

  async function copyRoomId() {
    try {
      await navigator.clipboard.writeText(roomId)
      toast.success("Coppy RoomID thành công!")
      return
    } catch (error) {
      toast.error("Coppy RoomID lỗi!")
    }
  }

  function leaveRoom() {
    reactNavigator('/')
  }

  return (
    <div className='mainWrap'>
      <div className='aside'>
        <div className='asideInner'>
          <div className='logo'>
            <img className='logoImage' src='/code-sync.png' alt='logo' />
          </div>
          <h3>Đã kết nối</h3>
          <div className='clientsList'>
            {clients.map(client => (
              <Client
                key={client.socketId}
                username={client.username}

              />
            ))}
          </div>
        </div>
        <button onClick={copyRoomId} className='btn copyBtn'>Sao chép ID phòng</button>
        <button onClick={leaveRoom} className='btn leaveBtn'>Rời phòng</button>
      </div>
      <div className='editorWrap'>
        <Editor onCodeChange={(code) => { codeRef.current = code; }} socketRef={socketRef} roomId={roomId} />
      </div>
    </div>
  )
}

export default EditorPage