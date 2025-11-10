"use client"
import React from 'react'
import {useState} from "react";

const BookEvent = () => {
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [email, setEmail] = useState("")

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        setTimeout(() => {

            setIsSubmitted(true)

        }, 1000)
    }



    return (
        <div id={"book-event"}>
            {isSubmitted ? (
                <p>Thank you for signing up!</p>
            ) : (
                <form>
                    <div>
                        <label htmlFor="email">
                            Email Address
                        </label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                               placeholder="Enter your email address"/>
                    </div>

                    <button type={"submit"}
                            className={"button-submit"}
                            onClick={handleSubmit}
                    >
                        Submit
                    </button>
                </form>
            )}
        </div>
    )
}
export default BookEvent
