// "use client"
//
// import React from 'react'
// import {useState} from "react";
// import {createBooking} from "@/lib/actions/booking.actions";
//
// interface bookingFormProps {
//     eventId: string
//     slug: string
// }
//
// const BookEvent = ({eventId, slug}: bookingFormProps) => {
//     const [isSubmitted, setIsSubmitted] = useState(false)
//     const [email, setEmail] = useState("")
//
//     const handleSubmit = async (e: React.FormEvent) => {
//         const {success, error} = await createBooking({eventId, email, slug})
//         e.preventDefault()
//
//         if (success) {
//             setIsSubmitted(true)
//             // posthog.capture("event", {eventId, slug, email})
//         } else {
//             setIsSubmitted(false)
//             console.error("Booking creation failed", error)
//             // posthog.captureException(error)
//         }
//
//     }
//
//
//     return (
//         <div id={"book-event"}>
//             {isSubmitted ? (
//                 <p>Thank you for signing up!</p>
//             ) : (
//                 <form>
//                     <div>
//                         <label htmlFor="email">
//                             Email Address
//                         </label>
//                         <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
//                                placeholder="Enter your email address"/>
//                     </div>
//
//                     <button type={"submit"}
//                             className={"button-submit"}
//                             onClick={handleSubmit}
//                     >
//                         Submit
//                     </button>
//                 </form>
//             )}
//         </div>
//     )
// }
// export default BookEvent

"use client"; // important!

import React, {useState} from "react";
import posthog from "posthog-js";

interface Props {
    eventId: string;
    slug: string;
}

export default function BookEvent({eventId, slug}: Props) {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {

        try {

            e.preventDefault();

            setLoading(true);
            const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
            // Call a server action instead of using connectDB / Booking model directly
            const res = await fetch(`/api/book-event`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({eventId, email, slug}),
            });

            posthog.capture("event-booked", {eventId, slug, email});

            const data = await res.json();
            console.log(data);
            setEmail("")
            setLoading(false);
        } catch (e) {
            console.error("Error when booking event", e)
            posthog.captureException(e)

        }
    };

    return (
        <div id={"book-event"}>

            <form onSubmit={handleSubmit} className="flex flex-col gap-2">
                <input
                    type="email"
                    id={"email"}
                    placeholder="Your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <button type="submit" disabled={loading}>
                    {loading ? "Booking..." : "Book Now"}
                </button>
            </form>
        </div>

    )

}

