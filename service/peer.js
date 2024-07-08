class PeerService {
    peer = null;
    createPeer = () => {
      if (typeof window !== 'undefined' && !this.peer) {
          this.peer = new RTCPeerConnection({
              iceServers: [{
                  urls: [
                      "stun:stun.l.google.com:19302",
                      "stun:global.stun.twilio.com:3478",
                      "stun:stun01.sipphone.com",
                      'stun:stun.ekiga.net',
                      "stun:stun.ideasip.com",
                      "stun:stun.rixtelecom.se",
                      "stun:stun.schlund.de",
                      "stun:stun.stunprotocol.org:3478",
                      "stun:stun.uls.co.za",
                      "stun:stun1.l.google.com:19302",
                      "stun:stun2.l.google.com:19302",
                      "stun:stun3.l.google.com:19302",
                      "stun:stun4.l.google.com:19302",
                      "stun:stunserver.org",
                      "stun:stun.softjoys.com",
                      "stun:stun.voiparound.com",
                      "stun:stun.voipbuster.com",

                  ]
              }]
          });
      }
  }

  setLocalDescription = async (ans) => {
    if (this.peer) {
      await this.peer.setLocalDescription(new RTCSessionDescription(ans));
    }
  };
  
  setRemoteDescription = async (offer) => {
    if (this.peer) {
      await this.peer.setRemoteDescription(offer);
    }
  };

  getAnswer = async (offer) => {
      if (this.peer) {
          await this.peer.setRemoteDescription(offer);
          const ans = await this.peer.createAnswer();
          await this.peer.setLocalDescription(new RTCSessionDescription(ans));
          return ans;
      }
  }

  getOffer = async () => {
      if (this.peer) {
          const offer = await this.peer.createOffer();
          await this.peer.setLocalDescription(new RTCSessionDescription(offer));
          return offer;
      }
  }

  toggleAudio = () => {
      const audioTracks = this.peer.getSenders().find(sender => sender.track.kind === 'audio').track;
      audioTracks.enabled = !audioTracks.enabled;

      // Mute the local audio track
      const localAudioTrack = this.peer.getLocalStreams()[0].getAudioTracks()[0];
      localAudioTrack.enabled = !localAudioTrack.enabled;
  };

  toggleVideo = () => {
      const videoTracks = this.peer.getSenders().find(sender => sender.track.kind === 'video').track;
      videoTracks.enabled = !videoTracks.enabled;
  };

  addStream = (stream) => {
      if (this.peer) {
          stream.getTracks().forEach(track => {
              this.peer.addTrack(track, stream);
          });
      }
  }

  onTrack = (callback) => {
      if (this.peer) {
          this.peer.addEventListener('track', callback);
      }
  }
}

export default new PeerService();