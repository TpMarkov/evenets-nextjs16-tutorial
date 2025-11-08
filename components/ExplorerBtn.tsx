"use client"
import React from 'react'
import Image from "next/image"

const ExplorerBtn = () => {
    return (
        <button onClick={() => {
            console.log("Clicked")
        }}
                id="explore-btn"
                className="mt-7 mx-auto"
        >
            <a href="/events">Explore Events
                <Image src="/icons/arrow-down.svg" alt="arrow down" width={22} height={22}/>
            </a>
        </button>
    )
}
export default ExplorerBtn
