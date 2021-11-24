import React, { useRef, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import socketio, { Socket } from "socket.io-client";
import Peer, { MediaConnection } from "peerjs";
import VControllers from "../components/yun/vcontrollers";
var myLocalStream:MediaStream;

console.log('runnning lc');
const RoomPage: React.FC = () => {
    const [userPrefs, setuserPrefs] = useState({
        audio: true,
        video: true,
    })
    const toggleMic = () => {
        myLocalStream?.getAudioTracks().forEach(track => track.enabled = !track.enabled);
        setuserPrefs((oldPrefs) => {
            return { ...oldPrefs, audio: !oldPrefs.audio }
        })
        // socket!.emit("join-room", roomId, peer?.id);

    }
    const toggleVideo = () => {
        myLocalStream?.getVideoTracks().forEach(track => track.enabled = !track.enabled);
        setuserPrefs((oldPrefs) => {
            return { ...oldPrefs, video: !oldPrefs.video }
        })
        // socket!.emit("join-room", roomId, peer?.id);

    }
    const { roomId } = useParams();
    const [socket, setsocket] = useState<Socket | null>(null)
    const [peers, setpeers] = useState<{ [key: string]: MediaConnection }>({})
    const [peer, setpeer] = useState<Peer | null>(null)
    // const [myLocalStream, setmyLocalStream] = useState<MediaStream | null>(null)
    const localVideoRef = useRef() as React.MutableRefObject<HTMLVideoElement>;
    const [vidStreams, setvidStreams] = useState<{ [key: string]: React.MutableRefObject<HTMLVideoElement> }>({ 'me': localVideoRef })
    const addVideoStream = (videoRef: React.MutableRefObject<HTMLVideoElement>, stream: MediaStream) => {
        if (!videoRef.current) {
            return;
        }
        videoRef.current.srcObject = stream;
        videoRef.current.addEventListener("loadedmetadata", () => {
            videoRef.current?.play();
        });
    }
    console.log('total videos', vidStreams)
    useEffect(() => {
        const socket = socketio('http://192.168.206.59:3001')
        const per = new Peer(undefined, { host: "192.168.206.59", path: "/peerjs", port: 3001 });
        setpeer(per);
        setsocket(socket);

    }, [])
    useEffect(() => {
        if (!peer || !socket) {
            return;
        }
        const connectToNewUser = (ppeer: Peer, userId: string, stream: MediaStream) => {
            console.log('calling');
            const call = ppeer.call(userId, myLocalStream);
            const remoteVideoRef = React.createRef() as React.MutableRefObject<HTMLVideoElement>;
            console.log('adding another user stream on calling ')
            setvidStreams((oldStreams) => {
                return { ...oldStreams, [userId]: remoteVideoRef }
            })
            setpeers((old_peers) => {
                console.log('adding user ', { ...old_peers, userId: call });
                return { ...old_peers, [userId]: call }
            })

            console.log('called ')
            call.on("stream", (userVideoStream) => {
                console.log('addig his video stream')
                addVideoStream(remoteVideoRef, userVideoStream);
            });
            // peers[userId] = call;

            call.on('close', () => {
                console.log('removing object');
                setpeers((oldpeers) => {
                    delete oldpeers[call.peer];
                    return oldpeers;
                })
                setvidStreams((oldVidStream) => Object.fromEntries(Object.entries(oldVidStream).filter(([key, value]) => key !== call.peer)) as { [key: string]: React.MutableRefObject<HTMLVideoElement> })
            })
        }
        console.log('adding your cam', socket, peer);
        navigator.mediaDevices.getUserMedia({audio:true,video:true}).then((stream) => {
            // setmyLocalStream(stream)
            myLocalStream = stream;
            addVideoStream(localVideoRef, stream);
            peer.on('call', (call) => {
                const remoteVideoRef = React.createRef() as React.MutableRefObject<HTMLVideoElement>;
                console.log('adding another user stream on answering ')
                setvidStreams((oldStreams) => {
                    return { ...oldStreams, [call.peer]: remoteVideoRef }
                })
                // answering with out stream
                call.answer(myLocalStream);
                // after other peer send stream add to grid
                call.on('stream', (userVideoStream) => {
                    addVideoStream(remoteVideoRef, userVideoStream)
                });
            });

            // adding peer stream
            socket.on('user-connected', (userId) => {
                console.log('another user with peer  id connected', userId)

                connectToNewUser(peer!, userId, stream);
            });
        });

        peer.on("open", (id) => {
            console.log('opened connection with peer id', id)
            socket!.emit("join-room", roomId, id);
        });
        socket?.on('ud', (userId) => {

            console.log('removeing user', userId, peers);
            peers[userId] && peers[userId].close();
        })


    }, [peer, roomId, socket, peers])
    // useEffect(() => {
    //     // removing peer video when it disconnnect
    //     console.log('runinng remove useffect', peers);
    //     socket?.on('ud', (userId) => {

    //         console.log('removeing user', userId, peers);
    //         peers[userId] && peers[userId].close();
    //     })


    // }, [peers, socket])
    return (
        <div className="bg-Cultured 2 w-3/5 h-4/5">
            {Object.values(vidStreams).map((userRef) => {
                return <video ref={userRef} />
            })}

            <VControllers isMute={!userPrefs.audio} isVideoOpen={userPrefs.video} toggleMic={toggleMic} toggleVideo={toggleVideo} />
        </div>
    );
}
export default RoomPage;