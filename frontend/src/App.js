import React from 'react'
import './App.css';
import SwipeableButton from './SwipeableButton';

function loadScript(src) {
	return new Promise((resolve) => {
		const script = document.createElement('script')
		script.src = src
		script.onload = () => {
			resolve(true)
		}
		script.onerror = () => {
			resolve(false)
		}
		document.body.appendChild(script)
	})
}

const __DEV__ = document.domain === 'localhost'

function App() {

	async function displayRazorpay() {
		const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js')

		if (!res) {
			alert('Razorpay SDK failed to load. Are you online?')
			return
		}

		const data = await fetch('http://localhost:1337/razorpay', { method: 'POST' }).then((t) =>
			t.json()
		)

		console.log(data)

		const options = {
			key: __DEV__ ? 'rzp_test_1ixCBs3v3SiRz5' : 'PRODUCTION_KEY',
			currency: data.currency,
			amount: data.amount.toString(),
			order_id: data.id,
			name: 'Bill Pay',
			description: 'Thank you',
			image: 'http://localhost:1337/logo.svg',
			handler: function (response) {
				alert(response.razorpay_payment_id)
				alert(response.razorpay_order_id)
				alert(response.razorpay_signature)
			},
			prefill: {
				name: 'Prem Biswas',
				email: 'govindbiswas44@gmail.com',
				phone_number: '9511723507'
			}
		}
		const paymentObject = new window.Razorpay(options);
		paymentObject.open()
	}

	return (
		<div className="App">
			<header className="App-header">
				<SwipeableButton onSuccess={displayRazorpay} color='#6ab04c' text='SLIDE TO PAY' />
			</header>
		</div>
	)
}

export default App
