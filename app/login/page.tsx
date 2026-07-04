import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AuthForm } from "@/components/AuthForm";

export default function LoginPage() {
  return (
    <>
      <Navbar />
      <main className="flex min-h-[75vh] items-center justify-center bg-white px-6 py-16 dark:bg-ink-950">
        <AuthForm mode="login" />
      </main>
      <Footer />
    </>
  );
}
