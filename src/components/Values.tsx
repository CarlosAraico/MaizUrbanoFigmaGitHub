export function Values() {
  return (
    <section id="valores" className="py-24 bg-white">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="mb-16">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-green-800 font-bold mb-4">Valores</p>
          <h2 className="font-black text-4xl sm:text-5xl text-stone-900 tracking-tight max-w-4xl">Tradición, impacto y escala técnica</h2>
          <p className="mt-6 max-w-3xl text-lg text-stone-600 leading-relaxed">
            Operamos con estándares de restaurante rápido sin perder el corazón de la cocina callejera mexicana.
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          <div className="rounded-3xl bg-[#FDF7E3] p-10 shadow-lg ring-1 ring-stone-100 hover:ring-amber-400/30 transition-all">
            <h3 className="font-black text-2xl text-stone-900 mb-4">Misión</h3>
            <p className="text-base text-stone-600 leading-relaxed">
              Llevar el maíz criollo a cada esquina de la ciudad con recetas auténticas, servicio veloz y calidad consistente.
            </p>
          </div>
          <div className="rounded-3xl bg-[#FDF7E3] p-10 shadow-lg ring-1 ring-stone-100 hover:ring-amber-400/30 transition-all">
            <h3 className="font-black text-2xl text-stone-900 mb-4">Visión</h3>
            <p className="text-base text-stone-600 leading-relaxed">
              Ser la marca líder de antojitos de maíz en Latinoamérica con un modelo replicable y tecnología operativa.
            </p>
          </div>
          <div className="rounded-3xl bg-[#FDF7E3] p-10 shadow-lg ring-1 ring-stone-100 hover:ring-amber-400/30 transition-all">
            <h3 className="font-black text-2xl text-stone-900 mb-4">Valores</h3>
            <p className="text-base text-stone-600 leading-relaxed">
              Tradición culinaria, impacto social para productores, desperdicio mínimo y entrenamiento continuo en cada punto de venta.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
