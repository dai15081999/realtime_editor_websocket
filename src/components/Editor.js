import React, { useEffect, useRef } from 'react'
import Codemirror from 'codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/dracula.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/addon/edit/closetag';
import 'codemirror/addon/edit/closebrackets';
import ACTIONS from '../actions';

const Editor = ({socketRef, roomId, onCodeChange}) => {
  const effectRan = useRef(false)
  const effectChangeRan = useRef(false)
  const editorRef = useRef(null)

  useEffect(() => {
    if (effectRan.current == true) {
      async function init() {
        editorRef.current = Codemirror.fromTextArea(document.getElementById('realtimeEditor'), {
          mode: { name: 'javascript', json: true },
          theme: 'dracula',
          autoCloseTags: true,
          autoCloseBrackets: true,
          lineNumbers: true,
        })
      }
      init()
      
      editorRef.current.on('change', (instance, changes) => {
        const {origin} = changes
        const code = instance.getValue()
        onCodeChange(code)
        if(origin !== 'setValue') {
          socketRef.current.emit(ACTIONS.CODE_CHANGE, {
            roomId,
            code
          })
        }
      })
    }

    return () => {
      effectRan.current = true
    }
  }, [])

  useEffect(() => {
    if(effectChangeRan.current == true) {
      if(socketRef.current) {
        socketRef.current.on(ACTIONS.CODE_CHANGE, ({code}) => {
          if(code !== null) {
            editorRef.current.setValue(code)
          }
        })
      }
    }
   return () => {
     effectChangeRan.current = true
   }
  }, [socketRef.current])

  return (
    <textarea id='realtimeEditor'></textarea>
  )
}

export default Editor