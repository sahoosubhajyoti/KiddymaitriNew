import Image from "next/image";
import styles from "./page.module.css";
import "tailwindcss";


import LandingPage from "../components/LandingPage"; // Make sure this path is correct

export default function Home() {
  return (
    <>
      <LandingPage />
    </>
  );
}
