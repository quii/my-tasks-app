"use client"
import dynamic from "next/dynamic";

const TaskManager = dynamic(() => import("@/app/TaskManager"), {
    ssr: false,
});

export default function Home() {
    return <TaskManager />
}