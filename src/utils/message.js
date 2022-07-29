import { ToastProgrammatic as Toast } from 'buefy'

const tips = Toast
const defaultDuration = 1500
const defaultPosition = "is-top"

export const MyMsg = {
    info: info,
    indefiniteInfo: indefiniteInfo,
    warn: warn,
    success: success,
    error: error
}

function info(message, duration=defaultDuration, position=defaultPosition){
    return tips.open({
        message: message,
        type: 'is-info',
        duration: duration,
        position: position
    })
}

function indefiniteInfo(message, position=defaultPosition){
    return tips.open({
        message: message,
        type: 'is-info',
        position: position,
        indefinite: true
    })
}

function warn(message, duration=defaultDuration, position=defaultPosition){
    return tips.open({
        message: message,
        type: 'is-warning',
        duration: duration,
        position: position
    })
}

function success(message, duration=defaultDuration, position=defaultPosition){
    return tips.open({
        message: message,
        type: 'is-success',
        duration: duration,
        position: position
    })
}

function error(message, duration=defaultDuration, position=defaultPosition){
    return tips.open({
        message: message,
        type: 'is-danger',
        duration: duration,
        position: position
    })
}