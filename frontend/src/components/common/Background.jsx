function Background({ children }) {
  return (
    <div className="relative isolate min-h-dvh bg-companion-cream">
      {/* Camadas decorativas do fundo */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      >
        {/* Base em degradê, na mesma família visual do login */}
        <div className="absolute inset-0 bg-[linear-gradient(145deg,#fff8f1_0%,#fffaf5_55%,#f7efe5_100%)]" />

        {/* Brilhos laranja bem leves */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_100%_0%,rgba(246,127,0,0.10),transparent_30%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_0%_100%,rgba(246,127,0,0.07),transparent_34%)]" />

        {/* Textura pontilhada sutil */}
        <div className="absolute inset-0 bg-[radial-gradient(rgba(200,112,34,0.10)_0.7px,transparent_0.7px)] [background-size:24px_24px]" />

        {/* Arcos decorativos no canto inferior esquerdo */}
        <div className="absolute -bottom-72 -left-64 size-[42rem] rounded-full border-[4.5rem] border-companion-orange/[0.07]" />
        <div className="absolute -bottom-60 -left-52 size-[35rem] rounded-full border border-companion-orange/30" />
        <div className="absolute -bottom-48 -left-40 size-[28rem] rounded-full border border-companion-orange/20" />
      </div>

      {/* O conteúdo fica acima das decorações */}
      <div className="relative z-10">{children}</div>
    </div>
  )
}

export default Background