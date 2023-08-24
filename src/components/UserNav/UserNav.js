import React, { useContext, useState, useEffect } from 'react'
import AuthContext from '../context/AuthContext'
import { MdOutlineMyLocation } from 'react-icons/md'
import {
	HiStatusOnline,
	HiStatusOffline,
	HiOutlineLogout,
} from 'react-icons/hi'
import { TiGroup } from 'react-icons/ti'
import { BsFillBellFill, BsFillPlusCircleFill } from 'react-icons/bs'
// import { TbBellFilled } from "react-icons/tb";
import { FaSearchLocation } from 'react-icons/fa'
import userImage from '../imgs/userImage.png'
import logo from '../imgs/motrackLogo.png'
import { API_URL } from '../config'
import { motion as m } from 'framer-motion'
import Circle from '../Circle'
import AddCircle from '../AddCircle'
import Request from '../Request'
import SearchMember from '../SearchMember'
import Profile from '../Profile'

const UserNav = () => {
	const [isOpen, setIsOpen] = useState(false)
	const [searchValue, setSearchValue] = useState('')
	const [searchItem, setSearchItem] = useState(null)
	const [isProfile, setIsProfile] = useState(false)

	const {
		user,
		token,
		lati,
		long,
		address,
		city,
		state,
		country,
		setLati,
		setLong,
		isOnline,
		setIsOnline,
		logout,
		isCircle,
		setIsCircle,
		isAdd,
		setIsAdd,
		isRequest,
		setIsRequest,
		map,
		setPosition,
		setError,
		error,
	} = useContext(AuthContext)

	useEffect(() => {
		// Send longitude and latitude request

		const handleLocation = async () => {
			const res = await fetch(`${API_URL}/users/${user.id}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({
					lat: lati,
					lng: long,
					address,
					city,
					state,
					country,
				}),
			})
			const data = await res.json()

			// console.log(data);
		}

		handleLocation()

		return () => {
			window.removeEventListener('offline', () => {
				setIsOnline(false)
			})
			window.removeEventListener('online', () => {
				setIsOnline(true)
			})
		}
	}, [
		lati,
		long,
		token,
		user.id,
		address,
		city,
		state,
		country,
		isOnline,
		setIsOnline,
	])

	const handleIsCircle = () => {
		setIsCircle(true)

		setIsAdd(false)
		setIsRequest(false)
	}

	const handleIsAdd = () => {
		setIsAdd(true)

		setIsCircle(false)
		setIsRequest(false)
	}

	const handleRequest = () => {
		setIsRequest(true)

		setIsCircle(false)
		setIsAdd(false)
	}

	const handleOpen = () => {
		setIsOpen(true)
	}

	const handleClose = () => {
		setIsOpen(false)
	}

	const handlePosition = () => {
		setPosition([parseFloat(lati), parseFloat(long)])

		map.setView([parseFloat(lati), parseFloat(long)], map.getZoom(), {
			animate: true,
			pan: {
				duration: 2,
			},
		})
	}

	const handleSearch = async (e) => {
		e.preventDefault()

		if (searchValue === '') {
			setError(true)
		} else {
			setError(false)
			const search = user.circle.filter((person) => {
				// return searchValue === person.username.toLowerCase();
				return person.username.toLowerCase().includes(searchValue)
			})
			setSearchItem(search)

			setSearchValue('')
		}
	}

	return (
		<div className=' fixed z-10 right-0 left-0'>
			<div className=' h-[0rem]'>
				<div className=' bg-white backdrop-filter backdrop-blur-md bg-opacity-50 w-[70vw] mx-auto px-[3rem] py-[1rem] flex justify-between items-center rounded-3xl relative top-[2rem] shadow-gray/70 shadow-lg max-md:px-[1rem] max-md:w-[90vw] max-md:py-[0.5rem]'>
					<div className=' '>
						<img src={logo} alt='' className=' w-[5rem] max-md:w-[4rem]' />
					</div>

					<div className=''>
						<form
							action=''
							className=' relative flex items-center'
							onSubmit={handleSearch}
						>
							<input
								type='text'
								id='search'
								name='search'
								placeholder=' Search circle'
								value={searchValue}
								onChange={(e) => setSearchValue(e.target.value)}
								className=' bg-white rounded-3xl px-[1rem] py-[0.5rem] w-[40rem] max-md:w-[13rem] max-sm:w-[10rem]'
							/>
							<button className=' bg-primary absolute right-[0.3rem] py-[0.4rem] rounded-3xl w-[2rem] h-[2rem] grid justify-items-center text-light text-xl'>
								<FaSearchLocation />
							</button>
						</form>
					</div>

					<div className=' flex items-center '>
						<div
							className=' flex items-center cursor-pointer'
							onClick={() => setIsProfile(!isProfile)}
						>
							<img
								src={user.image ? user.image.url : userImage}
								alt=''
								className=' w-[3rem] h-[3rem] rounded-full border border-primary p-[2px] object-cover max-md:w-[2rem] max-md:h-[2rem]'
							/>
						</div>
					</div>
				</div>

				<div className=' w-[4rem] right-0 relative top-[6rem] left-[2rem] items-start justify-start max-md:left-[1rem] max-md:top-[90vh] max-md:absolute'>
					<div
						className={` ${
							isOpen
								? 'w-[12rem] max-md:w-[90vw] max-md:mx-auto'
								: 'w-[4rem] max-md:w-[90vw] max-md:mx-auto'
						} bg-white backdrop-filter backdrop-blur-md bg-opacity-50 grid justify-items-center rounded-3xl py-[2rem] shadow-gray/70 shadow-lg transition-all duration-300 ease-in-out max-md:flex max-md:items-center max-md:py-[0.5rem] max-md:px-[0.5rem] max-md:justify-between`}
						onMouseEnter={() => handleOpen()}
						onMouseLeave={() => handleClose()}
					>
						<ul
							className={` mx-auto justify-items-center pb-[2rem] relative max-md:flex max-md:justify-between max-md:w-[70%] max-md:items-center max-md:pb-[0rem] max-md:mx-[0rem] ${
								isOpen && 'px-[0.5rem] max-md:px-[0rem]'
							} `}
						>
							<li
								className=' text-3xl text-primary_blue hover:bg-primary hover:text-white p-[0.5rem] cursor-pointer transition-all duration-600 ease-in-out rounded-3xl mb-[1rem] flex items-center max-md:mb-[0rem]'
								onClick={() => handleIsAdd()}
							>
								<BsFillPlusCircleFill
									className={` ${isOpen && 'mr-[0.5rem] max-md:mr-[0rem]'}`}
								/>
								{isOpen && (
									<p className={` max-md:hidden text-sm font-bold w-[7rem]`}>
										Add to Circle
									</p>
								)}
							</li>
							<li
								className=' text-3xl text-primary_blue hover:bg-primary hover:text-white p-[0.5rem] cursor-pointer transition-all duration-300 ease-in-out rounded-3xl mb-[1rem] flex items-center max-md:mb-[0rem]'
								onClick={() => handleIsCircle()}
							>
								<TiGroup
									className={` ${isOpen && 'mr-[0.5rem] max-md:mr-[0rem]'}`}
								/>
								{isOpen && (
									<p className={` max-md:hidden text-sm font-bold w-[7rem]`}>
										Circle
									</p>
								)}
							</li>
							<li
								className=' text-3xl text-primary_blue hover:bg-primary hover:text-white p-[0.5rem] cursor-pointer transition-all duration-300 ease-in-out rounded-3xl mb-[1rem] flex items-center max-md:mb-[0rem]'
								onClick={() => handleRequest()}
							>
								<BsFillBellFill
									className={` ${isOpen && 'mr-[0.5rem] max-md:mr-[0rem]'}`}
								/>
								{isOpen && (
									<p className={` max-md:hidden text-sm font-bold w-[7rem]`}>
										Requests
									</p>
								)}
							</li>
						</ul>
						<div className=''>
							<div
								className=' text-3xl text-red-600 hover:bg-primary hover:text-white p-[0.5rem] cursor-pointer transition-all duration-300 ease-in-out rounded-3xl self-end flex items-center'
								onClick={() => logout()}
							>
								<HiOutlineLogout
									className={` ${isOpen && 'mr-[0.5rem] max-md:mr-[0rem]'}`}
								/>
								{isOpen && (
									<p className={` max-md:hidden text-sm font-bold w-[7rem]`}>
										Logout
									</p>
								)}
							</div>
						</div>
					</div>
					<div
						className={`${
							isOpen
								? 'left-[10rem] max-md:left-[2rem]'
								: 'left-[3rem] max-md:left-[2rem]'
						} absolute top-0 transition-all duration-300 ease-in-out max-md:-top-[30rem]`}
					>
						{isCircle && <Circle />}
						{isAdd && <AddCircle />}
						{isRequest && <Request />}
					</div>

					<div
						className=' text-3xl text-primary_blue hover:bg-primary hover:text-white p-[0.5rem] cursor-pointer transition-all duration-300 ease-in-out rounded-full self-end flex justify-center items-center bg-white backdrop-filter backdrop-blur-md bg-opacity-50 h-[4rem] w-[4rem] relative -bottom-[5rem] max-md:bottom-[10rem]'
						onClick={() => handlePosition()}
					>
						<MdOutlineMyLocation />
					</div>
				</div>
			</div>

			<div className=' relative w-[40rem] mx-auto top-[8rem] max-md:w-[80vw] max-md:left-[0]'>
				<SearchMember searchItem={searchItem} setSearchItem={setSearchItem} />
			</div>

			<div className=' absolute w-[20rem] mx-auto top-[8rem] right-[19rem] max-md:right-[3rem]'>
				<Profile isProfile={isProfile} setIsProfile={setIsProfile} />
			</div>
		</div>
	)
}

export default UserNav
