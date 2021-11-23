import React, { Component, Fragment } from 'react'
import io from 'socket.io-client'
import { AuthUserContext, withAuthorization } from '../Session';
import * as ROUTES from '../../constants/routes';
import SingletonFactory from '../Firebase/firebase';
import { IconButton, Badge, Input, Button } from '@material-ui/core'
import VideocamIcon from '@material-ui/icons/Videocam'
import VideocamOffIcon from '@material-ui/icons/VideocamOff'
import MicIcon from '@material-ui/icons/Mic'
import MicOffIcon from '@material-ui/icons/MicOff'
import ScreenShareIcon from '@material-ui/icons/ScreenShare'
import StopScreenShareIcon from '@material-ui/icons/StopScreenShare'
import CallEndIcon from '@material-ui/icons/CallEnd'
import ChatIcon from '@material-ui/icons/Chat'
import { withFirebase } from '../Firebase';
import { compose } from 'recompose';
import 'firebase/storage';

import { message } from 'antd'
import 'antd/dist/antd.css'
import './drop.scss';

import { Row } from 'simple-flexbox'
import Modal from 'react-bootstrap/Modal'
import Image from 'react-bootstrap/Image'
import 'bootstrap/dist/css/bootstrap.css'
import "./meet.css"

const server_url = "http://localhost:3001"

var connections = {}
const peerConnectionConfig = {
	'iceServers': [
		// { 'urls': 'stun:stun.services.mozilla.com' },
		{ 'urls': 'stun:stun.l.google.com:19302' },
	]
}
var socket = null
var socketId = null
var elms = 0



class Meet extends Component {
	constructor(props) {
		super(props)

		this.localVideoref = React.createRef()
		this.file_input = React.createRef()
		this.videoAvailable = false
		this.audioAvailable = false
        this.storage = SingletonFactory.getInstance().storage;

		this.state = {
			video: false,
			audio: false,
			screen: false,
			showModal: false,
			showImageUploader: false,
			screenAvailable: false,
			messages: [],
			message: "",
			uploadedImages: [],
			previewImages: [],
			images: [],
			newmessages: 0,
			askForUsername: true,
			username: this.props.firebase.authUser.username,
			userId: this.props.firebase.authUser.userId,
		}
		connections = {}

		this.getPermissions()
	}

	getPermissions = async () => {
		try {
			await navigator.mediaDevices.getUserMedia({ video: true })
				.then(() => this.videoAvailable = true)
				.catch(() => this.videoAvailable = false)

			await navigator.mediaDevices.getUserMedia({ audio: true })
				.then(() => this.audioAvailable = true)
				.catch(() => this.audioAvailable = false)

			if (navigator.mediaDevices.getDisplayMedia) {
				this.setState({ screenAvailable: true })
			} else {
				this.setState({ screenAvailable: false })
			}

			if (this.videoAvailable || this.audioAvailable) {
				navigator.mediaDevices.getUserMedia({ video: this.videoAvailable, audio: this.audioAvailable })
					.then((stream) => {
						window.localStream = stream
						this.localVideoref.current.srcObject = stream
					})
					.then((stream) => { })
					.catch((e) => console.log(e))
			}
		} catch (e) { console.log(e) }
	}

	getMedia = () => {
		this.setState({
			video: false,
			audio: false
		}, () => {
			this.getUserMedia()
			this.connectToSocketServer()
		})
	}

	getUserMedia = () => {
		if ((this.state.video && this.videoAvailable) || (this.state.audio && this.audioAvailable)) {
			navigator.mediaDevices.getUserMedia({ video: this.state.video, audio: this.state.audio })
				.then(this.getUserMediaSuccess)
				.then((stream) => { })
				.catch((e) => console.log(e))
		} else {
			try {
				let tracks = this.localVideoref.current.srcObject.getTracks()
				tracks.forEach(track => track.stop())
			} catch (e) { }
		}
	}

	getUserMediaSuccess = (stream) => {
		try {
			window.localStream.getTracks().forEach(track => track.stop())
		} catch (e) { console.log(e) }

		window.localStream = stream
		this.localVideoref.current.srcObject = stream

		for (let id in connections) {
			if (id === socketId) continue

			connections[id].addStream(window.localStream)

			connections[id].createOffer().then((description) => {
				connections[id].setLocalDescription(description)
					.then(() => {
						socket.emit('signal', id, JSON.stringify({ 'sdp': connections[id].localDescription }))
					})
					.catch(e => console.log(e))
			})
		}

		stream.getTracks().forEach(track => track.onended = () => {
			this.setState({
				video: !this.state.video,
				audio: !this.state.audio,
			}, () => {
				try {
					let tracks = this.localVideoref.current.srcObject.getTracks()
					tracks.forEach(track => track.stop())
				} catch (e) { console.log(e) }

				let blackSilence = (...args) => new MediaStream([this.black(...args), this.silence()])
				window.localStream = blackSilence()
				this.localVideoref.current.srcObject = window.localStream

				for (let id in connections) {
					connections[id].addStream(window.localStream)

					connections[id].createOffer().then((description) => {
						connections[id].setLocalDescription(description)
							.then(() => {
								socket.emit('signal', id, JSON.stringify({ 'sdp': connections[id].localDescription }))
							})
							.catch(e => console.log(e))
					})
				}
			})
		})
	}

	getDislayMedia = () => {
		if (this.state.screen) {
			if (navigator.mediaDevices.getDisplayMedia) {
				navigator.mediaDevices.getDisplayMedia({ video: true, audio: true })
					.then(this.getDislayMediaSuccess)
					.then((stream) => { })
					.catch((e) => console.log(e))
			}
		}
	}

	getDislayMediaSuccess = (stream) => {
		try {
			window.localStream.getTracks().forEach(track => track.stop())
		} catch (e) { console.log(e) }

		window.localStream = stream
		this.localVideoref.current.srcObject = stream

		for (let id in connections) {
			if (id === socketId) continue

			connections[id].addStream(window.localStream)

			connections[id].createOffer().then((description) => {
				connections[id].setLocalDescription(description)
					.then(() => {
						socket.emit('signal', id, JSON.stringify({ 'sdp': connections[id].localDescription }))
					})
					.catch(e => console.log(e))
			})
		}

		stream.getTracks().forEach(track => track.onended = () => {
			this.setState({
				screen: false,
			}, () => {
				try {
					let tracks = this.localVideoref.current.srcObject.getTracks()
					tracks.forEach(track => track.stop())
				} catch (e) { console.log(e) }

				let blackSilence = (...args) => new MediaStream([this.black(...args), this.silence()])
				window.localStream = blackSilence()
				this.localVideoref.current.srcObject = window.localStream

				this.getUserMedia()
			})
		})
	}

	gotMessageFromServer = (fromId, message) => {
		var signal = JSON.parse(message)

		if (fromId !== socketId) {
			if (signal.sdp) {
				connections[fromId].setRemoteDescription(new RTCSessionDescription(signal.sdp)).then(() => {
					if (signal.sdp.type === 'offer') {
						connections[fromId].createAnswer().then((description) => {
							connections[fromId].setLocalDescription(description).then(() => {
								socket.emit('signal', fromId, JSON.stringify({ 'sdp': connections[fromId].localDescription }))
							}).catch(e => console.log(e))
						}).catch(e => console.log(e))
					}
				}).catch(e => console.log(e))
			}

			if (signal.ice) {
				connections[fromId].addIceCandidate(new RTCIceCandidate(signal.ice)).catch(e => console.log(e))
			}
		}
	}

	changeCssVideos = (main) => {
		let widthMain = main.offsetWidth
		let minWidth = "30%"
		if ((widthMain * 30 / 100) < 300) {
			minWidth = "300px"
		}
		let minHeight = "40%"

		let height = String(100 / elms) + "%"
		let width = ""
		if (elms === 0 || elms === 1) {
			width = "100%"
			height = "100%"
		} else if (elms === 2) {
			width = "45%"
			height = "100%"
		} else if (elms === 3 || elms === 4) {
			width = "35%"
			height = "50%"
		} else {
			width = String(100 / elms) + "%"
		}

		let videos = main.querySelectorAll("video")
		for (let a = 0; a < videos.length; ++a) {
			videos[a].style.minWidth = minWidth
			videos[a].style.minHeight = minHeight
			videos[a].style.setProperty("width", width)
			videos[a].style.setProperty("height", height)
		}

		return { minWidth, minHeight, width, height }
	}

	connectToSocketServer = () => {
		socket = io(server_url, { secure: true, reconnection: true, rejectUnauthorized: false, transports: ['websocket'] });
		console.log("heeeeere");
		console.log(socket.connected);
		socket.on("connect_error", (err) => {
			console.log(`connect_error due to ${err.message}`);
		});

		socket.on('signal', this.gotMessageFromServer)


		socket.on('connect', () => {
			console.log('S-a realizat conexiunea!')
			console.log("Id: ", this.state.userId);
			socket.emit('join-call', window.location.href, this.state.userId)
			socketId = socket.id

			socket.on("already-in-call-error", () => {
				window.location.href = ROUTES.CALLERROR;
			})
			socket.on('chat-message', (data, sender, socketIdSender) => {
				console.log("socket.on(message)")
				this.addMessage(data, sender, socketIdSender)
			})

			socket.on('image', (data, sender, socketIdSender) => {
				console.log("socket.on(image)")
                console.log(data)
				this.addImage(data, sender, socketIdSender)
			})

			socket.on('user-left', (id) => {
				let video = document.querySelector(`[data-socket="${id}"]`)
				if (video !== null) {
					elms--
					video.parentNode.removeChild(video)

					let main = document.getElementById('main')
					this.changeCssVideos(main)
				}
			})

			socket.on('user-joined', (id, clients) => {
				clients.forEach((socketListId) => {
					connections[socketListId] = new RTCPeerConnection(peerConnectionConfig)
					// Wait for their ice candidate       
					connections[socketListId].onicecandidate = function (event) {
						if (event.candidate != null) {
							socket.emit('signal', socketListId, JSON.stringify({ 'ice': event.candidate }))
						}
					}

					// Wait for their video stream
					connections[socketListId].onaddstream = (event) => {
						var searchVidep = document.querySelector(`[data-socket="${socketListId}"]`)
						if (searchVidep !== null) { // if i don't do this check it make an empyt square
							searchVidep.srcObject = event.stream
						} else {
							elms = clients.length
							let main = document.getElementById('main')
							let cssMesure = this.changeCssVideos(main)

							let video = document.createElement('video')

							let css = {
								minWidth: cssMesure.minWidth, minHeight: cssMesure.minHeight, maxHeight: "100%", margin: "10px",
								borderStyle: "solid", borderRadius: "15px", objectFit: "cover"
							}
							for (let i in css) video.style[i] = css[i]

							video.style.setProperty("width", cssMesure.width)
							video.style.setProperty("height", cssMesure.height)
							video.setAttribute('data-socket', socketListId)
							video.srcObject = event.stream
							video.autoplay = true
							video.playsinline = true

							main.appendChild(video)
						}
					}

					// Add the local video stream
					if (window.localStream !== undefined && window.localStream !== null) {
						connections[socketListId].addStream(window.localStream)
					} else {
						let blackSilence = (...args) => new MediaStream([this.black(...args), this.silence()])
						window.localStream = blackSilence()
						connections[socketListId].addStream(window.localStream)
					}
				})

				if (id === socketId) {
					for (let id2 in connections) {
						if (id2 === socketId) continue

						try {
							connections[id2].addStream(window.localStream)
						} catch (e) { }

						connections[id2].createOffer().then((description) => {
							connections[id2].setLocalDescription(description)
								.then(() => {
									socket.emit('signal', id2, JSON.stringify({ 'sdp': connections[id2].localDescription }))
								})
								.catch(e => console.log(e))
						})
					}
				}
			})
		})
	}

	silence = () => {
		let ctx = new AudioContext()
		let oscillator = ctx.createOscillator()
		let dst = oscillator.connect(ctx.createMediaStreamDestination())
		oscillator.start()
		ctx.resume()
		return Object.assign(dst.stream.getAudioTracks()[0], { enabled: false })
	}
	black = ({ width = 640, height = 480 } = {}) => {
		let canvas = Object.assign(document.createElement("canvas"), { width, height })
		canvas.getContext('2d').fillRect(0, 0, width, height)
		let stream = canvas.captureStream()
		return Object.assign(stream.getVideoTracks()[0], { enabled: false })
	}

	handleVideo = () => this.setState({ video: !this.state.video }, () => this.getUserMedia())
	handleAudio = () => this.setState({ audio: !this.state.audio }, () => this.getUserMedia())
	handleScreen = () => this.setState({ screen: !this.state.screen }, () => this.getDislayMedia())

	handleEndCall = () => {
		try {
			let tracks = this.localVideoref.current.srcObject.getTracks()
			tracks.forEach(track => track.stop())
		} catch (e) { }
		window.location.href = ROUTES.HOME
	}

	openChat = () => this.setState({ showModal: true, newmessages: 0 })
	closeChat = () => this.setState({ showModal: false })
	handleMessage = (e) => this.setState({ message: e.target.value })

	addMessage = (data, sender, socketIdSender) => {
		console.log("addMessage")
		this.setState(prevState => ({
			messages: [...prevState.messages, { "sender": sender, "data": data, "type": "txt" }],
		}))
		if (socketIdSender !== socketId) {
			this.setState({ newmessages: this.state.newmessages + 1 })
		}
	}

	addImage = (image, sender, socketIdSender) => {
        var folder = window.location.href.substring(27);
        this.storage
            .ref(folder)
            .child(image)
            .getDownloadURL()
            .then(url => {
                console.log("url "+ url)
                this.setState(prevState => ({
                    messages: [...prevState.messages, { 'sender': sender, "data": url, "type": "image" }],
                }))
                if (socketIdSender !== socketId) {
                    this.setState({ newmessages: this.state.newmessages + 1 })
                }
                console.log(this.state.images)
            })
	}

	openImageUloader = () => this.setState({ showImageUploader: true, showModal: false })
	closeImageUloader = () => this.setState({ showImageUploader: false, showModal: true })

	preventDefaults = (e) => {
		e.preventDefault();
		e.stopPropagation();
	};

	removePreviewImage = (e) => {
		const index = e.target.getAttribute('index');
		const images = this.state.previewImages;
		images.splice(index, 1);
		this.setState(images);
	};

	previewFile = (data) => {
		const images = this.state.previewImages;
		this.setState({ images: images.concat(data) });
	};

	handleDrop = (e) => {
		e.preventDefault();
		const files = e.dataTransfer.files;
		this.uploadFile(Array.from(files));
		this.setState({
			greenDrop: false
		})
	};

	handleDragOver = (e) => {
		e.preventDefault();
		this.setState({
			greenDrop: true
		})
	};

	handleInputByClick = (e) => {
		this.uploadFile(Array.from(e.target.files));
	};

	handleDragEnter = () => {
		this.setState({
			greenDrop: true
		})
	}

	handleDragLeave = () => {
		this.setState({
			greenDrop: false
		})
	}

	handleSubmit = () => {
		this.sumbitPreview()
	}

	handleClick = (e) => {
		this.file_input.click();
	}


	sumbitPreview = () => {
		this.setState({ uploadedImages: this.state.uploadedImages.concat(this.state.previewImages) },
			() => { console.log(this.state.uploadedImages) });

		this.setState({ previewImages: [] },
			() => { console.log(this.state.previewImages) });
	}


	handleUsername = (e) => this.setState({ username: e.target.value })

	sendMessage = () => {
		if (this.state.message !== "") {
			socket.emit('chat-message', this.state.message, this.state.username)
			this.setState({ message: "", sender: this.state.username })
		}
	}

	sendImages = () => {
		console.log(this.state.previewImages)
		console.log(this.state.previewImages.length)
		console.log(this.state.previewImages.length > 0)
		if (this.state.previewImages.length > 0) {
			console.log("sendImages")
			this.state.previewImages.forEach((image) => {
                console.log("inamge.fileInfo " + image.name);
                console.log(window.location.href);
                console.log(window.location.href.substring(27));
				socket.emit('image', image.name, this.state.username);
                var folder = window.location.href.substring(27);
                var uploadTask = this.storage.ref(folder + '/'+ image.name).put(image);
                uploadTask.on(
                    "state_changed",
                    error => {
                        console.log(error)
                    }
                )
			})
			this.setState({ previewImages: [], sender: this.state.username })
		}
        
    }

	copyUrl = () => {
		let text = window.location.href
		if (!navigator.clipboard) {
			let textArea = document.createElement("textarea")
			textArea.value = text
			document.body.appendChild(textArea)
			textArea.focus()
			textArea.select()
			try {
				document.execCommand('copy');
				message.success("Link copied to clipboard!");
			} catch (err) {
				message.error("Failed to copy")
			}
			document.body.removeChild(textArea)
			return
		}
		navigator.clipboard.writeText(text).then(function () {
			message.success("Link copied to clipboard!")
		}, () => {
			message.error("Failed to copy")
		})
	}

	connect = () => this.setState({ askForUsername: false }, () => this.getMedia())

	isChrome = function () {
		let userAgent = (navigator && (navigator.userAgent || '')).toLowerCase()
		let vendor = (navigator && (navigator.vendor || '')).toLowerCase()
		let matchChrome = /google inc/.test(vendor) ? userAgent.match(/(?:chrome|crios)\/(\d+)/) : null
		// let matchFirefox = userAgent.match(/(?:firefox|fxios)\/(\d+)/)
		// return matchChrome !== null || matchFirefox !== null
		return matchChrome !== null
	}

	renderItem(item, index) {
		if (item.type == "txt") {
			return <div key={index} style={
				item.sender === this.state.username
					? { textAlign: "right" }
					: { textAlign: "left" }
			}>
				<p style={{ wordBreak: "break-all", color: "black" }}><b>{
					item.sender !== this.state.username ? item.sender : "Me"}</b>: {item.data}</p>
			</div>
		}
		else if (item.type == "image") {
			return <div key={index} style={
				item.sender === this.state.username
					? { textAlign: "right" }
					: { textAlign: "left" }
			}>
				<p style={{ wordBreak: "break-all", color: "black" }}><b>{
					item.sender !== this.state.username ? item.sender : "Me"}</b>: <br></br><Image src={item.data} className="chat-image" /></p>
			</div>
		}
	}

	render() {
		if (this.isChrome() === false) {
			return (
				<div style={{
					background: "white", width: "30%", height: "auto", padding: "20px", minWidth: "400px",
					textAlign: "center", margin: "auto", marginTop: "50px", justifyContent: "center"
				}}>
					<h1>Sorry, this works only with Google Chrome</h1>
				</div>
			)
		}
		return (
			<div>
				{this.state.askForUsername === true ?
					<div>
						<div style={{
							background: "white", width: "30%", height: "auto", padding: "20px", minWidth: "400px",
							textAlign: "center", margin: "auto", marginTop: "50px", justifyContent: "center"
						}}>
							<p style={{ margin: 0, fontWeight: "bold", paddingRight: "50px", color: "black" }}>Set your username</p>
							<AuthUserContext.Consumer>
								{authUser => (
									<Input placeholder="Username" value={this.state.username} onChange={e => this.handleUsername(e)} />)
								}
							</AuthUserContext.Consumer>
							<Button variant="contained" color="primary" onClick={this.connect} style={{ margin: "20px", backgroundColor: "#01abf4" }}>Connect</Button>
						</div>

						<div style={{ justifyContent: "center", textAlign: "center", paddingTop: "40px" }}>
							<video id="my-video" ref={this.localVideoref} autoPlay={this.state.video} muted={this.state.audio} style={{
								borderStyle: "solid", borderRadius: "15px", borderColor: "#bdbdbd", objectFit: "fill", width: "60%", height: "30%"
							}}></video>
						</div>

						<div style={{ justifyContent: "center", textAlign: "center" }}>
							<IconButton style={{ color: "#424242" }} onClick={this.handleAudio}>
								{this.state.audio === true ? <MicIcon /> : <MicOffIcon />}
							</IconButton>

							<IconButton style={{ color: "#424242" }} onClick={this.handleVideo}>
								{(this.state.video === true) ? <VideocamIcon /> : <VideocamOffIcon />}
							</IconButton>

						</div>
					</div>
					:
					<div>
						<div className="btn-down" style={{ color: "whitesmoke", textAlign: "center" }}>
							<IconButton style={{ color: "#424242" }} onClick={this.handleEndCall}>
								<CallEndIcon />
							</IconButton>

							<IconButton style={{ color: "#424242" }} onClick={this.handleVideo}>
								{(this.state.video === true) ? <VideocamIcon /> : <VideocamOffIcon />}
							</IconButton>

							<IconButton style={{ color: "#424242" }} onClick={this.handleAudio}>
								{this.state.audio === true ? <MicIcon /> : <MicOffIcon />}
							</IconButton>

							{this.state.screenAvailable === true ?
								<IconButton style={{ color: "#424242" }} onClick={this.handleScreen}>
									{this.state.screen === true ? <ScreenShareIcon /> : <StopScreenShareIcon />}
								</IconButton>
								: null}

							<Badge badgeContent={this.state.newmessages} max={999} color="secondary" onClick={this.openChat}>
								<IconButton style={{ color: "#424242" }} onClick={this.openChat}>
									<ChatIcon />
								</IconButton>
							</Badge>
						</div>

						<Modal show={this.state.showModal} onHide={this.closeChat} style={{ zIndex: "999999", color: "black !important" }}>
							<Modal.Header closeButton >
								<Modal.Title style={{ color: "black" }}>Chat Room</Modal.Title>
							</Modal.Header>
							<Modal.Body style={{ overflow: "auto", overflowY: "auto", height: "400px", textAlign: "left", color: "black" }} >
								{this.state.messages.length > 0 ? this.state.messages.map((item, index) => (
									this.renderItem(item, index)
								)) : <p style={{ color: "black" }}>No message yet</p>}
							</Modal.Body>
							<Modal.Footer className="div-send-msg">
								<Input placeholder="Message" value={this.state.message} onChange={e => this.handleMessage(e)} />
								<Button variant="contained" color="primary" onClick={this.sendMessage}>Send</Button>
								<Button variant="contained" color="primary" onClick={this.openImageUloader}>Add picture</Button>
							</Modal.Footer>
						</Modal>

						<Modal show={this.state.showImageUploader} onHide={this.closeImageUloader} style={{ zIndex: "999999" }}>
							<Modal.Header closeButton onclick={this.closeImagesUloader}>
								<Modal.Title style={{ color: "black" }}>Image uploader</Modal.Title>
							</Modal.Header>
							<Modal.Body style={{ overflow: "auto", overflowY: "auto", height: "400px", textAlign: "left" }} >
								<div className='App'>
									<div className='drop-container'>
										<div
											id='drop-region-container'
											className={'drop-region-container mx-auto'}
											onDrop={this.handleDrop}
											onDragOver={this.handleDragOver}
											onDragEnter={this.handleDragEnter}
											onDragLeave={this.handleDragLeave}
											onClick={this.handleClick}
										>
											<div id='drop-region' className='drop-region text-center'>
												<img id='download-btn' src='/Download.png' width='80' alt='' />
												<h2>Drag and Drop or Click to Upload</h2>
												<input
													id='file-input'
													type='file'
													ref={input => this.file_input = input}
													onChange={this.handleInputByClick}
												/>
											</div>
										</div>

										<div id='preview' className='mx-auto'>
											{this.state.previewImages.map((img, index) => (
												<Fragment key={index}>
													<img src={URL.createObjectURL(img)} alt='' />
													<button
														className='btn btn-danger btn-block mx-auto'
														onClick={this.removePreviewImage}
													>
														Delete
													</button>
												</Fragment>
											))}
										</div>
									</div>
								</div>
							</Modal.Body>
							<Modal.Footer className="div-send-msg">
								<Button variant="contained" color="primary" onClick={this.sendImages}>Sumbit</Button>
							</Modal.Footer>
						</Modal>

						<div className="container">
							<div style={{ paddingTop: "20px", paddingBottom: "20px" }}>
								<Input value={window.location.href} disable="true" style={{ color: "white" }}></Input>
								<Button style={{
									backgroundColor: "#01abf4", color: "whitesmoke", marginLeft: "20px",
									marginTop: "10px", width: "120px", fontSize: "10px"
								}} onClick={this.copyUrl}>Copy invite link</Button>
							</div>

							<Row id="main" className="flex-container" style={{ margin: 0, padding: 0 }}>
								<video id="my-video" ref={this.localVideoref} autoPlay={this.state.video} muted={this.state.audio} style={{
									borderStyle: "solid", borderRadius: "15px", margin: "10px", objectFit: "cover",
									width: "100%", height: "100%"
								}}></video>
							</Row>
						</div>
					</div>
				}
			</div>
		)
	}
}

const condition = authUser => !!authUser;
export default compose(withFirebase, withAuthorization(condition))(Meet);