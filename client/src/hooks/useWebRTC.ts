import { useState, useEffect, useRef, useCallback } from 'react';
import { getSocket } from '../lib/socket';
import { useChatStore } from '../store/chatStore';

const ICE_SERVERS: RTCConfiguration = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' },
  ],
};

export function useWebRTC() {
  const { status, chatMode, isInitiator, roomId } = useChatStore();
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [partnerVideoEnabled, setPartnerVideoEnabled] = useState(true);
  const [partnerAudioEnabled, setPartnerAudioEnabled] = useState(true);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [camError, setCamError] = useState<string | null>(null);

  const pcRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const pendingCandidatesRef = useRef<RTCIceCandidateInit[]>([]);

  // 1. Initialize Local Media Stream
  const initLocalStream = useCallback(async (facing: 'user' | 'environment' = 'user') => {
    try {
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => track.stop());
      }

      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: facing, width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: true,
        });
      } catch (err: any) {
        // Fallback to video only or audio only if user doesn't have both
        try {
          stream = await navigator.mediaDevices.getUserMedia({ video: true });
        } catch {
          // If no video camera, try audio only
          stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        }
      }

      localStreamRef.current = stream;
      setLocalStream(stream);
      setCamError(null);

      // Add tracks to existing PeerConnection if any
      if (pcRef.current) {
        const senders = pcRef.current.getSenders();
        stream.getTracks().forEach((track) => {
          const existingSender = senders.find((s) => s.track?.kind === track.kind);
          if (existingSender) {
            existingSender.replaceTrack(track);
          } else {
            pcRef.current?.addTrack(track, stream);
          }
        });
      }
      return stream;
    } catch (err: any) {
      console.warn('[WebRTC] Camera/Mic access warning:', err.message);
      setCamError('Camera/Mic permission needed. Please allow access.');
      return null;
    }
  }, []);

  // 2. Setup PeerConnection
  const setupPeerConnection = useCallback(() => {
    if (pcRef.current) {
      pcRef.current.close();
      pcRef.current = null;
    }

    const pc = new RTCPeerConnection(ICE_SERVERS);
    pcRef.current = pc;

    // Incoming remote media tracks
    pc.ontrack = (event) => {
      if (event.streams && event.streams[0]) {
        setRemoteStream(event.streams[0]);
      } else {
        const inboundStream = new MediaStream([event.track]);
        setRemoteStream(inboundStream);
      }
    };

    // ICE Candidate generation
    const socket = getSocket();
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit('webrtc-ice-candidate', { candidate: event.candidate.toJSON() });
      }
    };

    // Add local tracks if available
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => {
        pc.addTrack(track, localStreamRef.current!);
      });
    }

    return pc;
  }, []);

  // Start local stream whenever entering video chat
  useEffect(() => {
    if (chatMode === 'video') {
      initLocalStream(facingMode);
    } else {
      // If switching back to text mode, stop camera tracks
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((t) => t.stop());
        localStreamRef.current = null;
        setLocalStream(null);
      }
    }

    return () => {
      if (chatMode === 'video') {
        localStreamRef.current?.getTracks().forEach((t) => t.stop());
      }
    };
  }, [chatMode, facingMode, initLocalStream]);

  // Handle Connected & Signaling
  useEffect(() => {
    if (chatMode !== 'video') return;

    const socket = getSocket();

    // Create PeerConnection when connected
    if (status === 'connected' && roomId) {
      const pc = setupPeerConnection();

      // If initiator, generate offer
      if (isInitiator) {
        const createOffer = async () => {
          try {
            const offer = await pc.createOffer({
              offerToReceiveAudio: true,
              offerToReceiveVideo: true,
            });
            await pc.setLocalDescription(offer);
            socket.emit('webrtc-offer', { offer });
          } catch (err) {
            console.error('[WebRTC] Error creating offer:', err);
          }
        };
        // Small delay to ensure partner is ready
        setTimeout(createOffer, 400);
      }
    } else if (status !== 'connected') {
      // Disconnected or searching: close peer connection and remote stream
      if (pcRef.current) {
        pcRef.current.close();
        pcRef.current = null;
      }
      setRemoteStream(null);
    }

    // Signaling event listeners
    const handleOffer = async (data: { offer: RTCSessionDescriptionInit }) => {
      try {
        let pc = pcRef.current;
        if (!pc) {
          pc = setupPeerConnection();
        }
        await pc.setRemoteDescription(new RTCSessionDescription(data.offer));

        // Process any queued candidates
        while (pendingCandidatesRef.current.length > 0) {
          const candidate = pendingCandidatesRef.current.shift();
          if (candidate) await pc.addIceCandidate(new RTCIceCandidate(candidate));
        }

        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        socket.emit('webrtc-answer', { answer });
      } catch (err) {
        console.error('[WebRTC] Error handling offer:', err);
      }
    };

    const handleAnswer = async (data: { answer: RTCSessionDescriptionInit }) => {
      try {
        if (pcRef.current && pcRef.current.signalingState !== 'stable') {
          await pcRef.current.setRemoteDescription(new RTCSessionDescription(data.answer));
        }
      } catch (err) {
        console.error('[WebRTC] Error handling answer:', err);
      }
    };

    const handleIceCandidate = async (data: { candidate: RTCIceCandidateInit }) => {
      try {
        if (pcRef.current && pcRef.current.remoteDescription) {
          await pcRef.current.addIceCandidate(new RTCIceCandidate(data.candidate));
        } else {
          pendingCandidatesRef.current.push(data.candidate);
        }
      } catch (err) {
        console.error('[WebRTC] Error handling candidate:', err);
      }
    };

    const handlePartnerMediaState = (data: { videoEnabled?: boolean; audioEnabled?: boolean }) => {
      if (typeof data.videoEnabled === 'boolean') {
        setPartnerVideoEnabled(data.videoEnabled);
      }
      if (typeof data.audioEnabled === 'boolean') {
        setPartnerAudioEnabled(data.audioEnabled);
      }
    };

    socket.on('webrtc-offer', handleOffer);
    socket.on('webrtc-answer', handleAnswer);
    socket.on('webrtc-ice-candidate', handleIceCandidate);
    socket.on('webrtc-partner-media-state', handlePartnerMediaState);

    return () => {
      socket.off('webrtc-offer', handleOffer);
      socket.off('webrtc-answer', handleAnswer);
      socket.off('webrtc-ice-candidate', handleIceCandidate);
      socket.off('webrtc-partner-media-state', handlePartnerMediaState);
    };
  }, [status, roomId, isInitiator, chatMode, setupPeerConnection]);

  // Controls: Toggle Video
  const toggleVideo = useCallback(() => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        const nextState = !videoTrack.enabled;
        videoTrack.enabled = nextState;
        setIsVideoEnabled(nextState);
        getSocket().emit('webrtc-media-state', { videoEnabled: nextState });
      }
    }
  }, []);

  // Controls: Toggle Audio
  const toggleAudio = useCallback(() => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        const nextState = !audioTrack.enabled;
        audioTrack.enabled = nextState;
        setIsAudioEnabled(nextState);
        getSocket().emit('webrtc-media-state', { audioEnabled: nextState });
      }
    }
  }, []);

  // Controls: Flip camera
  const flipCamera = useCallback(() => {
    const nextFacing = facingMode === 'user' ? 'environment' : 'user';
    setFacingMode(nextFacing);
    initLocalStream(nextFacing);
  }, [facingMode, initLocalStream]);

  return {
    localStream,
    remoteStream,
    isVideoEnabled,
    isAudioEnabled,
    partnerVideoEnabled,
    partnerAudioEnabled,
    camError,
    toggleVideo,
    toggleAudio,
    flipCamera,
    initLocalStream,
  };
}
