// components/CallButtons.jsx
import {MicrophoneIcon as MicOffIcon} from '@heroicons/react/24/outline';
import {MicrophoneIcon} from '@heroicons/react/24/solid';
import {VideoCameraIcon} from '@heroicons/react/24/outline';
import {VideoCameraSlashIcon} from '@heroicons/react/24/solid';
import {PhoneXMarkIcon} from '@heroicons/react/24/outline';

const CallHandleButtons = ({ isAudioMute, isVideoOnHold, onToggleAudio, onToggleVideo, onEndCall }) => (
    <div className='absolute bottom-0 flex w-full md:space-x-4 space-x-1 h-[65px] items-center justify-center rounded-md'>
        <div className=' bg-[#2c3e508b] rounded-md flex  p-2 justify-center md:gap-10 gap-4'>
            <button onClick={onToggleAudio}>
                {isAudioMute ? <MicOffIcon className='p-2 btn-error btn btn-circle' /> : <MicrophoneIcon className='btn btn-circle p-2 btn-success'/>}
            </button>
            <button
                onClick={onToggleVideo}
            >
                {isVideoOnHold ? <VideoCameraSlashIcon className='p-2 btn-error btn btn-circle' /> : <VideoCameraIcon className='btn btn-circle p-2 btn-success' />}
            </button>
            <button onClick={onEndCall}>
                <PhoneXMarkIcon className='p-2 btn-error btn btn-circle' />
            </button>
        </div>
    </div>
);
export default CallHandleButtons;
