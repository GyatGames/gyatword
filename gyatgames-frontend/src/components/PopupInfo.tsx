import Swal from "sweetalert2";
import { Button } from "@/components/ui/button";

export const PopInfo = () => {
    const showPopup = () => {
        Swal.fire({
            title: "📜 Crossword Rules & Leaderboard",
            html: `
                <ul style="text-align: left; font-size: 14px; line-height: 1.5;">
                    <li>⏳ The <b>timer starts</b> when you begin the crossword.</li>
                    <li>💡 <b>Reveal Cell hints add +20s</b> to your total time.</li>
                    <li>💡 <b>Reveal Answer hints add +60s</b> to your total time.</li>
                    <li>🔄 If you use <b>Reveal All</b>, your time won’t be submitted.</li>
                    <li>🔐 <b>You must be logged in</b> to submit a time.</li>
                    <li>📅 <b>Only the first completion of the day</b> is recorded on the leaderboard.</li>
                </ul>
            `,
            icon: "info",
            confirmButtonText: "Got it!",
            customClass: {
                container: 'swal-container',
                popup: 'swal-popup',
                title: 'swal-title',
                htmlContainer: 'swal-html-container',
                confirmButton: 'swal-confirm',
            },
        });
    };

    return (
        <Button className="cursor-pointer text-xs h-6 md:h-10 md:text-sm w-16" variant="outline" onClick={showPopup}>
            Rules
        </Button>
    );
};