import React, { useState, useRef } from 'react'
import { v4 as uuidv4 } from 'uuid'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'


const Home = () => {
    const navigate = useNavigate()

    const roomIDRef = useRef('')
    const usernameRef = useRef('')

    const createNewRoom = (e) => {
        e.preventDefault()
        const id = uuidv4()
        roomIDRef.current.value = ""
        roomIDRef.current.value = id
        toast.success("Tạo ID phòng thành công!")
    }

    const joinRoom = () => {
        if(!roomIDRef.current.value || !usernameRef.current.value) {
            toast.error("Không được bỏ trống mục nào!")
            return;
        }
        navigate(`/editor/${roomIDRef.current.value}`, {
            state: {
                username: usernameRef.current.value
            }
        })
    }

    const handleInputEnter = (e) => {
        if(e.code == "Enter") {
            joinRoom()
        }
    }

    return (
        <div className='homePageWrapper'>
            <div className='formWrapper'>
                <img src="/code-sync.png" alt='code-sync' />
                <h4 className='mainLabel'>
                    Nhập ID phòng
                </h4>
                <div className='inputGroup'>
                    <input
                    ref={roomIDRef}
                    type="text" 
                    className='inputBox'
                    placeholder='Nhập ID'
                    onKeyUp={handleInputEnter}
                    />
                    <input
                    ref={usernameRef}
                    type="text" 
                    className='inputBox'
                    placeholder='Nhập Tên'
                    onKeyUp={handleInputEnter}
                    />
                    <button onClick={joinRoom} className='btn joinBtn'>Tham gia</button>
                    <span className='createInfo'>Nếu bạn muốn tạo phòng riêng: &nbsp; <a onClick={createNewRoom} className='createNewBtn' href=''>Tạo phòng</a></span>
                </div>
            </div>
            <footer>
                <h4>Xây dựng bởi Đại :))</h4>
            </footer>
        </div>
    )
}

export default Home