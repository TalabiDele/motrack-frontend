import React, { useState, useContext } from 'react'
import AuthContext from './context/AuthContext'
import { motion as m } from 'framer-motion'
import { MdCancel } from 'react-icons/md'
import { API_URL } from './config'
import userImage from './imgs/userImage.png'
import toast, { Toaster } from 'react-hot-toast'

const AddCircle = () => {
	const [searchText, setSearchText] = useState('')
	const [loading, setLoading] = useState(false)
	const [searchData, setSearchData] = useState(null)
	const [isCurrent, setIsCurrent] = useState(false)

	const { isAdd, setIsAdd, user, checkUserLoggedIn } = useContext(AuthContext)

	const handleSearch = async (e) => {
		e.preventDefault()
		setLoading(true)
		setSearchText('')

		const res = await fetch(
			`${API_URL}/users?filters[identifier][$eq]=${searchText}&populate=*`
		)

		const data = await res.json()
		const present = user.circle.find((current) => {
			return data[0].id === current.id
		})

		setIsCurrent(present)

		setSearchData(data)

		setLoading(false)
	}

	const handleRequest = async (e) => {
		setLoading(true)
		const toastId = toast.loading('Sending request...')

		const res = await fetch(`${API_URL}/requests`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				data: {
					receiver: e,
					senders: user,
				},
			}),
		})

		const data = await res.json()

		toast.success('Request sent! 🎉', {
			duration: 6000,
		})

		checkUserLoggedIn()

		setLoading(false)
		toast.remove(toastId)

		setIsAdd(false)

		// window.location.reload()
	}

	const bgVariants = {
		visible: {
			y: 0,
		},
		hidden: {
			y: '-100%',
		},
	}

	return (
		<m.div
			variants={bgVariants}
			initial='hidden'
			animate={isAdd ? 'visible' : 'hidden'}
			exit='hidden'
			transition={{
				duration: 0.1,
				ease: 'easeOut',
				type: 'spring',
				stiffness: 260,
				damping: 20,
			}}
			className=' ml-[2rem] w-[20rem]'
		>
			<div className='bg-white backdrop-filter backdrop-blur-md bg-opacity-50 rounded-3xl p-[1rem] shadow-gray/70 shadow-lg transition-all duration-300 ease-in-out relative'>
				<div className=' w-[100%] flex justify-end'>
					<MdCancel
						className=' text-2xl cursor-pointer absolute right-0 -top-[2rem] mb-[0.5rem] '
						onClick={() => setIsAdd(false)}
					/>
				</div>
				<form
					action=''
					onSubmit={handleSearch}
					className=' w-[100%] flex justify-center'
				>
					<input
						type='text'
						id='searchText'
						name='searchText'
						onChange={(e) => setSearchText(e.target.value)}
						placeholder='Enter user identifier...'
						className=' py-[0.5rem] px-[1rem] text-md rounded-3xl w-[100%] mx-auto'
					/>
				</form>

				<div className=' mt-[1rem]'>
					{isCurrent && (
						<div className=' font-medium text-center'>
							<h1>User already in your circle</h1>
						</div>
					)}
					{isCurrent === undefined &&
						searchData?.map((e) => (
							<div
								className=' flex items-center justify-start mb-[1rem] bg-white rounded-3xl shadow-sm p-[1rem] transition-all duration-300 ease-in-out'
								key={e.id}
							>
								<img
									src={e.image ? e.image.url : userImage}
									alt=''
									className=' w-[3rem] h-[3rem] rounded-full border border-primary p-[2px] object-cover'
								/>
								<div className=' ml-[1rem]'>
									<h1 className=' text-lg font-bold'>{e.username}</h1>

									<div className=''>
										<button
											className=' bg-primary text-text rounded-md py-[0.2rem] px-[1rem] cursor-pointer hover:bg-btn_hover transition-all duration-300 ease-in-out'
											onClick={() => handleRequest(e)}
										>
											Send Request
										</button>
									</div>
								</div>
							</div>
						))}
				</div>
			</div>
		</m.div>
	)
}

export default AddCircle
