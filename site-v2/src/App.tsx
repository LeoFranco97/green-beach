import { useEffect, useState } from 'react'
import { ArrowRight, ChevronDown } from 'lucide-react'
import { chamada, heroFoto, linkWhatsApp, menu, pousada, rodapeHero } from './conteudo'

/* ========================================================================== */
/* Navbar                                                                     */
/* ========================================================================== */

function Navbar() {
  const [rolou, setRolou] = useState(false)
  const [aberto, setAberto] = useState(false)

  useEffect(() => {
    const aoRolar = () => setRolou(window.scrollY > 20)
    aoRolar()
    window.addEventListener('scroll', aoRolar, { passive: true })
    return () => window.removeEventListener('scroll', aoRolar)
  }, [])

  // Com o menu aberto o fundo não rola. Restaurar no desmonte evita deixar a
  // página travada se o componente sair com o menu ainda aberto.
  useEffect(() => {
    document.body.style.overflow = aberto ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [aberto])

  useEffect(() => {
    if (!aberto) return
    const aoTeclar = (e: KeyboardEvent) => { if (e.key === 'Escape') setAberto(false) }
    document.addEventListener('keydown', aoTeclar)
    return () => document.removeEventListener('keydown', aoTeclar)
  }, [aberto])

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          rolou ? 'bg-brand-cream/90 backdrop-blur-md shadow-sm' : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <nav className="relative flex items-center h-16 md:h-20" aria-label="Navegação principal">
            {/* Links da esquerda, só no desktop */}
            <div className="hidden md:flex items-center gap-8 animate-fade-down stagger-1">
              {menu.map((item) =>
                item.tipo === 'menu' ? (
                  <button
                    key={item.rotulo}
                    type="button"
                    className="flex items-center gap-1 py-3 text-sm text-brand-dark tracking-wide uppercase hover:opacity-70 transition-opacity"
                  >
                    {item.rotulo}
                    <ChevronDown className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                ) : (
                  <a
                    key={item.rotulo}
                    href={`#${item.rotulo.toLowerCase()}`}
                    className="py-3 text-sm text-brand-dark tracking-wide uppercase hover:opacity-70 transition-opacity"
                  >
                    {item.rotulo}
                  </a>
                ),
              )}
            </div>

            {/* Marca, centrada de verdade na barra e não no meio do que sobra */}
            <a
              href="#topo"
              className="flex items-center gap-2 py-2 md:absolute md:left-1/2 md:-translate-x-1/2 animate-fade-down stagger-2"
              aria-label={`${pousada.nomeCompleto}, ir para o topo`}
            >
              <img
                src="/marca/green-beach-simbolo.webp"
                alt=""
                aria-hidden="true"
                width={40}
                height={38}
                /* Um pouco maior que o triangulo do molde: a rosacea da marca
                   tem traco fino e some abaixo de 24px. */
                className="w-6 h-6 object-contain"
              />
              <span className="text-xl text-brand-dark tracking-tight font-helvetica-neue">
                {pousada.nome}
              </span>
            </a>

            {/* CTA da direita, só no desktop */}
            <a
              href={linkWhatsApp('v2-navbar')}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:inline-flex items-center ml-auto px-5 py-2.5 bg-brand-dark text-white text-sm tracking-wide uppercase rounded-full hover:bg-brand-green transition-colors animate-fade-down stagger-3"
            >
              {chamada.cta}
            </a>

            {/* Hambúrguer, só no mobile */}
            <button
              type="button"
              onClick={() => setAberto((v) => !v)}
              aria-label={aberto ? 'Fechar menu' : 'Abrir menu'}
              aria-expanded={aberto}
              aria-controls="menu-mobile"
              className="md:hidden ml-auto z-50 w-10 h-10 relative"
            >
              <span
                className={`absolute left-1/2 -translate-x-1/2 top-[6px] block w-6 h-[2px] bg-brand-dark rounded transition-all duration-300 ease-[cubic-bezier(0.68,-0.6,0.32,1.6)] ${
                  aberto ? 'rotate-45 translate-y-[5px]' : ''
                }`}
              />
              <span
                className={`absolute left-1/2 -translate-x-1/2 top-[13px] block w-6 h-[2px] bg-brand-dark rounded transition-all duration-300 ease-[cubic-bezier(0.68,-0.6,0.32,1.6)] ${
                  aberto ? '-rotate-45' : ''
                }`}
              />
            </button>
          </nav>
        </div>
      </header>

      {/* Painel de tela cheia do mobile */}
      <div
        id="menu-mobile"
        aria-hidden={!aberto}
        className={`md:hidden fixed inset-0 bg-brand-cream z-40 transition-opacity duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          aberto ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div
          className={`flex flex-col items-center justify-center h-full gap-8 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] delay-100 ${
            aberto ? 'translate-y-0 opacity-100' : '-translate-y-8 opacity-0'
          }`}
        >
          {menu.map((item) => (
            <a
              key={item.rotulo}
              href={`#${item.rotulo.toLowerCase()}`}
              onClick={() => setAberto(false)}
              tabIndex={aberto ? 0 : -1}
              className="px-4 py-2 text-3xl text-brand-dark tracking-tight"
            >
              {item.rotulo}
            </a>
          ))}
          <a
            href={linkWhatsApp('v2-menu-mobile')}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setAberto(false)}
            tabIndex={aberto ? 0 : -1}
            className="mt-4 inline-flex items-center px-8 py-3.5 bg-brand-dark text-white text-lg tracking-wide rounded-full"
          >
            {chamada.cta}
          </a>
        </div>
      </div>
    </>
  )
}

/* ========================================================================== */
/* Fileira de comodidades, embaixo do título                                  */
/* ========================================================================== */

function Comodidades() {
  return (
    <div className="w-full mt-8 md:mt-10 animate-fade-up stagger-5">
      <p className="text-left text-xs tracking-[0.25em] uppercase text-brand-soft mb-6 md:mb-8 font-helvetica-neue">
        {rodapeHero.rotulo}
      </p>
      <ul className="flex flex-wrap items-center justify-start gap-x-6 gap-y-3 md:gap-x-12 lg:gap-x-16 animate-fade-up stagger-6">
        {rodapeHero.itens.map((item) => (
          <li
            key={item}
            className="text-lg md:text-xl lg:text-2xl text-brand-green whitespace-nowrap font-helvetica-neue"
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}

/* ========================================================================== */
/* Hero                                                                       */
/* ========================================================================== */

function Hero() {
  const srcset = heroFoto.larguras.map((l) => `${heroFoto.base}-${l}.webp ${l}w`).join(', ')

  return (
    <section
      id="topo"
      className="relative w-full h-screen min-h-[700px] overflow-hidden bg-brand-cream flex flex-col"
    >
      {/*
        Aqui o molde original põe vídeo atrás do texto escuro. Medi as catorze
        aéreas do acervo e NENHUMA aguenta tinta escura por cima: no pior
        pixel da zona de texto a melhor delas dá 1,87:1, e corpo de texto
        precisa de 4,5:1. O molde funciona porque o vídeo dele é claro de ponta
        a ponta.

        Três saídas possíveis: escurecer a foto com véu (o próprio spec proíbe),
        virar o texto para claro (é o que a v1 já faz, e aí as duas versões
        ficam iguais), ou separar as camadas. Escolhi separar: tinta escura
        sobre creme em cima, fotografia sangrando embaixo. Zero véu, zero
        gradiente, contraste garantido, e continua sendo uma tela cheia só.
      */}
      <div className="relative z-10 flex flex-col items-start w-full max-w-7xl mx-auto pt-28 md:pt-36 pb-10 md:pb-14 px-6 lg:px-8">
        <a
          href={linkWhatsApp('v2-aviso')}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-brand-dark/15 bg-white/60 backdrop-blur-sm hover:bg-white/80 transition-colors mb-5 md:mb-6 animate-fade-up stagger-3"
        >
          <span className="text-sm text-brand-dark">{chamada.aviso}</span>
          <ArrowRight className="w-3.5 h-3.5 text-brand-dark" aria-hidden="true" />
        </a>

        <h1 className="text-left text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-brand-dark leading-[1.05] tracking-tight max-w-4xl font-helvetica-neue animate-fade-up stagger-4">
          {chamada.tituloLinha1}
          <br className="hidden sm:block" /> {chamada.tituloLinha2}
        </h1>

        <Comodidades />
      </div>

      {/* A foto ocupa o que sobra da tela e sangra de ponta a ponta. */}
      <div className="relative flex-1 min-h-0 w-full overflow-hidden">
        <img
          src={`${heroFoto.base}-1920.webp`}
          srcSet={srcset}
          sizes="100vw"
          alt={heroFoto.alt}
          width={heroFoto.largura}
          height={heroFoto.altura}
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover object-bottom animate-deriva"
        />
      </div>
    </section>
  )
}

/* ========================================================================== */

export default function App() {
  return (
    <div className="font-helvetica-neue">
      <Navbar />
      <Hero />
    </div>
  )
}
