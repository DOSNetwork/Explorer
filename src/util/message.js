import { notification } from 'antd'

const Notification = {
    Normal: ({ key, message, description }) => {
        notification.open({
            key,
            message: message,
            description: description,
        });
    }
}

export default {
    Notification
}
