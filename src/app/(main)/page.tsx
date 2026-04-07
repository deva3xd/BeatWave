import type { Metadata } from "next";
import MainClient from "./MainClient";

export const metadata: Metadata = {
    title: "My Music App",
};

export default function Page() {
    return <MainClient />;
}