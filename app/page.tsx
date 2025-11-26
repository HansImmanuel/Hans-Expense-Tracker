import { Button } from "@/components/ui/button";
import Head from "next/head";
import Image from "next/image";
import Header from "./_components/header";
import Hero from "./_components/hero";

export default function Home() {
  return (
    <div>
      <Header />
        <br />
      <Hero />
    </div>
  );
}
