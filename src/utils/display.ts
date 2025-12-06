import { Alert } from 'react-native';
import { showMessage } from 'react-native-flash-message';
import store from '../redux/store';
import { logOut } from '../redux/auth/authSlice';

let showing401Alert = false;

const displayError = (error: any, display: boolean) => {
    let status = error?.response?.status;
    console.log(status, 'status');
    let message;
    if (error?.response?.data?.message) {
        message = error.response.data.message;
    } else if (status === 500) {
        message = 'Internal Server Error';
    } else if (status === 400) {
        message = 'Bad Request';
    } else if (status === 410) {
        message = 'Resource not available';
    } else if (status === 504) {
        message = 'Timeout Error';
    } else if (typeof error === 'string') {
        message = error;
    } else {
        message = 'Server Error';
    }

    if (display) {
        showMessage({
            duration: 3000,
            message: 'Oops!',
            description: message,
            type: 'danger',
        });
    }
    if (status === 401 && !showing401Alert) {
        showing401Alert = true;

        Alert.alert(
            'Do you want to Logout?',
            'Looks like you do not have access to continue',
            [
                {
                    text: 'Logout',
                    onPress: () => {
                        showing401Alert = false;
                        store.dispatch(logOut());
                    },
                },
                {
                    text: 'Cancel',
                    onPress: () => {
                        showing401Alert = false;
                    },
                },
            ],
            { cancelable: false },
        );
    }
    return message;
};

const displaySuccess = (message: string, title?: string) => {
    showMessage({
        duration: 3000,
        message: title || 'Great!',
        description: message,
        type: 'success',
    });
};

export { displayError, displaySuccess };
