import './style.css'

let localStream;
let remoteStream;
let peerConnection;

const servers = {
	iceServers: [
		{
			urls: ['stun:stun1.l.google.com:19302']
		}
	]
};

async function init() {
	localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
	document.getElementById('local-video').srcObject = localStream;
}

async function createPeerConnection(sdpOfferTextAreaId) {
	peerConnection = new RTCPeerConnection(servers);

	remoteStream = new MediaStream();
	document.getElementById('remote-video').srcObject = remoteStream;

	localStream.getTracks().forEach(track => peerConnection.addTrack(track, localStream));

	peerConnection.ontrack = event => {
		event.streams[0].getTracks().forEach(track => remoteStream.addTrack(track));
	};

	peerConnection.onicecandidate = event => {
		if (event.candidate) {
			document.getElementById(sdpOfferTextAreaId).textContent = JSON.stringify(peerConnection.localDescription);
		}
	};
}

async function createOffer() {
	if (!localStream) {
		return;
	}

	const offer = await createPeerConnection('sdp-offer-text-area');

	await peerConnection.setLocalDescription(offer)
}

async function createAnswer() {
	await createPeerConnection('sdp-answer-text-area');

	let offer = document.getElementById('sdp-offer-text-area');
	if (!offer) {
		return aler('Offer is required');
	}
	offer = JSON.parse(offer.value);

	await peerConnection.setRemoteDescription(offer);

	const answer = await peerConnection.createAnswer();
	await peerConnection.setLocalDescription(answer);

	document.getElementById('sdp-answer-text-area').textContent = JSON.stringify(answer);
}

async function addAnswer() {
	let answer = document.getElementById('sdp-answer-text-area').value;
	if (!answer) {
		return alert('Answer is required');
	}
	answer = JSON.parse(answer);

	if (!peerConnection.currentRemoteDescription) {
		peerConnection.setRemoteDescription(answer);
	}
}

init();

document.getElementById('create-offer-button').addEventListener('click', createOffer);
document.getElementById('create-answer-button').addEventListener('click', createAnswer);
document.getElementById('add-answer-button').addEventListener('click', addAnswer);
