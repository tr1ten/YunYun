import Button from "../ui/button";
import { useNavigate } from "react-router-dom";
import { uuid } from "uuidv4";
const Welcome: React.FC = () => {
    const navgator = useNavigate();
    const onClickHandler = () => {
        console.log('navigating ');
        navigator.permissions.query({ name: 'microphone' as PermissionName }).then(function (result) {
            alert(result.state);
            if (result.state === 'granted') {
                navgator('/' + uuid())
                //permission has already been granted, no prompt is shown
            } else if (result.state === 'prompt') {
                // onClickHandler()
                navigator.mediaDevices.getUserMedia({audio:true}).then((stream) => {
                    stream.getVideoTracks().forEach(function (track) {
                        track.stop();
                    });

                })
                //there's no peristent permission registered, will be showing the prompt
            } else if (result.state === 'denied') {
                return;
            }
        });

    }

    return (
        <>
            <h1>Welcome</h1>
            <Button>Join Room</Button>
            <Button onClick={onClickHandler} >Create Room</Button>
        </>


    );
}
export default Welcome;