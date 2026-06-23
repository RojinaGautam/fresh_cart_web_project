import Footer from "../_components/Footer";
import Navbar from "../_components/Navbar";

export default function HomepageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-[#f5f6f4] text-[#182d1f]">
      <Navbar variant="storefront" />
      <section className="mx-auto w-full max-w-[1500px] px-5 py-5 md:px-8">
        {children}
      </section>
      <Footer wide />
    </main>
  );
}
