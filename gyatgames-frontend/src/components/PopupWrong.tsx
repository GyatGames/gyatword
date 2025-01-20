import Swal from 'sweetalert2';

const PopupWrong = () => {

    Swal.fire({
        title: 'Nearly there!!',
        html: `<p>One or more squares are incorrect</p>`,
        icon: 'error',
        confirmButtonText: 'Keep trying!',
        customClass: {
            container: 'swal-container',
            popup: 'swal-popup',
            title: 'swal-title',
            htmlContainer: 'swal-html-container',
            confirmButton: 'swal-confirm',
        },
    });
};

export default PopupWrong;