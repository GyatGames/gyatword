import Swal from 'sweetalert2';

const PopupWrong = () => {

    Swal.fire({
        title: 'Nearly there!!',
        html: `<p>One or more squares are incorrect</p>`,
        icon: 'error',
        confirmButtonText: 'Keep trying!',
    });
};

export default PopupWrong;