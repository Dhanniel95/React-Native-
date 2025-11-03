import { toast } from 'sonner-native';

const displayError = (error: any, display: boolean) => {
    let status = error?.response?.status;
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
        // toast.error('Error', {
        //     description: message,
        //     dismissible: true,
        //     style: { backgroundColor: '#8B0000' },
        //     cancelButtonTextStyle: { color: '#FFF' },
        //     styles: {
        //         title: {
        //             color: '#FFF',
        //         },
        //         description: {
        //             color: '#FFF',
        //         },
        //     },
        // });
    }
    return message;
};

const displaySuccess = (title?: string, message?: string) => {
    //toast.success(title || 'Success', { description: message });
};

export { displayError, displaySuccess };
