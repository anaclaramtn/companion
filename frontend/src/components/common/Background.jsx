function Background({ children }) {
  return (
    <div className="relative isolate min-h-dvh bg-companion-cream">
      {/* Camadas decorativas do fundo */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      >
        {/* Base em degradê, na mesma família visual do login */}
        <div className="absolute inset-0 app-bg-base" />

        {/* Brilhos laranja bem leves */}
        <div className="absolute inset-0 app-bg-glow-top" />
        <div className="absolute inset-0 app-bg-glow-bottom" />

        {/* Textura pontilhada sutil */}
        <div className="absolute inset-0 app-bg-dots" />

        {/* Arcos decorativos no canto inferior esquerdo */}
        <div className="app-bg-arc absolute -bottom-72 -left-64 size-[42rem] rounded-full border-[4.5rem] border-companion-orange/[0.07]" />
        <div className="app-bg-arc absolute -bottom-60 -left-52 size-[35rem] rounded-full border border-companion-orange/30" />
        <div className="app-bg-arc absolute -bottom-48 -left-40 size-[28rem] rounded-full border border-companion-orange/20" />
      </div>

      {/* O conteúdo fica acima das decorações */}
      <div className="relative z-10">{children}</div>
    </div>
  )
}

export default Background