import { MouseEventHandler } from 'react';
import { BsMicMuteFill, BsMicFill, BsCameraVideoFill, BsCameraVideoOffFill } from 'react-icons/bs'
type VProps = {
    isMute: boolean,
    isVideoOpen: boolean,
    toggleMic: MouseEventHandler,
    toggleVideo: MouseEventHandler,

}
const VControllers = ({ toggleMic, isMute, isVideoOpen, toggleVideo }: VProps) => {
    return (
        <div>
            <button onClick={toggleMic} > {!isMute ? <BsMicFill /> : <BsMicMuteFill />} </button>
            <button onClick={toggleVideo} > {!isVideoOpen ? <BsCameraVideoOffFill /> : <BsCameraVideoFill />} </button>
        </div>

    );
}
export default VControllers;