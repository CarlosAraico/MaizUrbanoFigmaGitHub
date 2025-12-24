import Hero from "../components/Hero";
import Solutions from "../components/Solutions";
import Stats from "../components/Stats";
import Markets from "../components/Markets";
import Purpose from "../components/Purpose";
import Footer from "../components/Footer";

export function HomePage() {
  return (
    <div className="bg-[var(--color-background)] text-[var(--color-text-primary)]">
      <div className="page-shell py-12">
        <Hero />
      </div>
      <Solutions />
      <Stats />
      <Markets />
      <Purpose />
      <Footer />
    </div>
  );
}
