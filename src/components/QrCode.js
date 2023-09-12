import React, { useEffect, useState, useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import io from 'socket.io-client';

const QrCode = () => {
	const [socket, setSocket] = useState(null);
	const [address, setAddr] = useState('');

	const qrRef = useRef();

	const downloadQRCode = (e) => {
		e.preventDefault();
		let canvas = qrRef.current.querySelector('canvas');
		let image = canvas.toDataURL('image/png');
		let anchor = document.createElement('a');
		anchor.href = image;
		anchor.download = `qr-code.png`;
		document.body.appendChild(anchor);
		anchor.click();
		document.body.removeChild(anchor);
		setAddr('');
	};

	const qrCodeEncoder = (e) => {
		setAddr(e.target.value);
	};

	const qrcode = (
		<QRCodeCanvas
			id="qrCode"
			value={address}
			size={300}
			bgColor={'#00ff00'}
			level={'H'}
		/>
	);
	useEffect(() => {
		const newSocket = io.connect('http://localhost:9000');
		setSocket(newSocket);

		newSocket.on('get_qrdata', (qrdata) => {
			console.log('connected socketId is ---', newSocket.id);
			console.log('qrdata---------', qrdata);
			setAddr(qrdata);
		});
	}, []);

	return (
		<div className="qrcode__container">
			<div ref={qrRef}>{qrcode}</div>
			<div className="input__group">
				<form onSubmit={downloadQRCode}>
					<label style={{ margin: '10px' }}>Text payment :</label>
					<input
						type="text"
						value={address}
						onChange={qrCodeEncoder}
						placeholder="automatical payment method"
					/>
					{/* <label>Token</label>
          <input
            type="text"
            value={token}
            onChange={qrCodeEncoder}
            placeholder="automatical payment method"
          />
          <label>Amount</label>
          <input
            type="text"
            value={amount}
            onChange={qrCodeEncoder}
            placeholder="automatical payment method"
          /> */}
					<button type="submit" style={{ margin: '10px' }} disabled={!address}>
						Download QR code
					</button>
				</form>
			</div>
		</div>
	);
};

export default QrCode;
