import { ToastProgrammatic as Toast } from 'buefy'

const tips = Toast
const defaultDuration = 1500

export const MyMsg = {
    info: info,
    warn: warn,
    success: success,
    error: error
}

function info(message, duration=defaultDuration){
    tips.open({
        message: message,
        type: 'is-info',
        duration: duration
    })
}

function warn(message, duration=defaultDuration){
    tips.open({
        message: message,
        type: 'is-warning',
        duration: duration
    })
}

function success(message, duration=defaultDuration){
    tips.open({
        message: message,
        type: 'is-success',
        duration: duration
    })
}

function error(message, duration=defaultDuration){
    tips.open({
        message: message,
        type: 'is-danger',
        duration: duration
    })
}