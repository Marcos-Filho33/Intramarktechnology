"use client";

import { motion } from "framer-motion";
import { useMemo, useRef, useState, type FormEvent } from "react";
import { IntraMarkLogo } from "@/components/intramark-logo";
import { ParticleField } from "@/components/particle-field";

const services = [
  {
    id: "sites",
    name: "Criação de Sites",
    icon: "◈",
    description: "Landing pages, portais e presenças digitais premium.",
  },
  {
    id: "software",
    name: "Desenvolvimento de Software",
    icon: "⌁",
    description: "Soluções web e desktop com arquitetura moderna.",
  },
  {
    id: "apps",
    name: "Criação de Aplicativos",
    icon: "✦",
    description: "Apps elegante e intuitivos para mobile e web.",
  },
  {
    id: "automacao",
    name: "Automação de Processos",
    icon: "⟡",
    description: "Fluxos inteligentes que reduzem retrabalho.",
  },
  {
    id: "ia",
    name: "Integração com IA",
    icon: "◌",
    description: "Assistentes, automações e insights orientados por dados.",
  },
  {
    id: "marketing",
    name: "Marketing Digital",
    icon: "⬢",
    description: "Campanhas otimizadas para conversão e performance.",
  },
  {
    id: "apis",
    name: "APIs e Integrações",
    icon: "⌘",
    description: "Conecte times, ferramentas e sistemas em uma estrutura única.",
  },
  {
    id: "sistemas",
    name: "Sistemas Empresariais",
    icon: "▣",
    description: "Plataformas operacionais com escalabilidade real.",
  },
  {
    id: "dashboards",
    name: "Dashboards",
    icon: "◍",
    description: "Painéis analíticos e monitoramento em tempo real.",
  },
  {
    id: "chatbots",
    name: "Chatbots",
    icon: "↗",
    description: "Experiências automatizadas com atendimento inteligente.",
  },
];

const whatsappNumber = "553899229849";

export default function Home() {
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    whatsapp: "",
    description: "",
  });
  const [status, setStatus] = useState("idle");
  const formRef = useRef<HTMLDivElement | null>(null);

  const selectedLabels = useMemo(() => {
    return services
      .filter((service) => selectedServices.includes(service.id))
      .map((service) => `✅ ${service.name}`);
  }, [selectedServices]);

  const toggleService = (id: string) => {
    setSelectedServices((current) =>
      current.includes(id)
        ? current.filter((service) => service !== id)
        : [...current, id],
    );
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (selectedServices.length === 0) {
      setStatus("Selecione ao menos um serviço.");
      return;
    }

    const requiredFields = [
      formData.name,
      formData.company,
      formData.whatsapp,
      formData.description,
    ];

    if (requiredFields.some((field) => field.trim() === "")) {
      setStatus("Preencha todos os campos do formulário.");
      return;
    }

    const message = `Olá, IntraMark! 👋\n\nTenho interesse nos seguintes serviços:\n\n${selectedLabels.join("\n")}\n\n👤 Nome: ${formData.name}\n🏢 Empresa: ${formData.company}\n📱 WhatsApp: ${formData.whatsapp}\n\n📝 Projeto:\n${formData.description}\n\nGostaria de conversar sobre o projeto.`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    setStatus("Mensagem pronta e enviada ao WhatsApp.");
  };

  return (
    <main className="relative overflow-hidden bg-[#020202] text-white">
      <ParticleField />
      <div className="absolute inset-x-0 top-0 h-[30rem] bg-[radial-gradient(circle_at_top,_rgba(255,31,61,0.28),_transparent_45%)]" />

      {/* Logo principal centralizada no topo */}
      <div className="relative z-40 flex w-full flex-col items-center pt-8 pb-2">
        <img
          src="/logo.svg"
          alt="Logo IntraMark"
          className="h-20 w-auto max-w-[90vw] drop-shadow-[0_0_32px_rgba(255,31,61,0.45)]"
          draggable={false}
        />
      </div>

      <header className="sticky top-0 z-30 border-b border-white/10 bg-black/55 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <IntraMarkLogo />

          <nav className="hidden items-center gap-7 text-sm text-white/70 md:flex">
            <a href="#servicos" className="transition hover:text-white">Serviços</a>
            <a href="#formulario" className="transition hover:text-white">Projeto</a>
            <a href="#sobre" className="transition hover:text-white">Sobre</a>
          </nav>

          <a
            href={`https://wa.me/${whatsappNumber}`}
            className="rounded-full border border-red-500/70 bg-red-500/10 px-4 py-2 text-sm font-semibold text-white shadow-[0_0_24px_rgba(255,31,61,0.28)] transition hover:border-red-400 hover:bg-red-500/20"
          >
            Falar no WhatsApp
          </a>
        </div>
      </header>

      <section className="relative mx-auto flex min-h-[calc(100vh-80px)] max-w-7xl flex-col justify-center px-4 pb-20 pt-8 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center"
        >
          <div className="space-y-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1 text-sm text-red-200">
              <span className="h-2 w-2 rounded-full bg-red-500 shadow-[0_0_12px_rgba(255,31,61,0.8)]" />
              Estratégia tecnológica premium
            </div>

            <div className="space-y-4">
              <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-[3.4rem] lg:leading-[1.02]">
                SUA IDEIA. <span className="text-red-500">NOSSO CÓDIGO.</span>
              </h1>
              <p className="max-w-2xl text-base leading-8 text-white/75 sm:text-lg">
                Softwares, sites, aplicativos, automações e soluções inteligentes para empresas modernas.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })}
                className="rounded-full bg-red-500 px-5 py-3 text-sm font-semibold text-black shadow-[0_0_28px_rgba(255,31,61,0.4)] transition hover:scale-[1.01] hover:bg-red-400"
              >
                Começar Projeto
              </button>
              <a
                href={`https://wa.me/${whatsappNumber}`}
                className="rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:border-red-500/70 hover:bg-red-500/10"
              >
                Falar no WhatsApp
              </a>
            </div>

            <div className="grid gap-4 pt-4 sm:grid-cols-3">
              {[
                ["+10", "soluções entregues"],
                ["24h", "tempo de resposta"],
                ["99%", "satisfação"],
              ].map(([value, label]) => (
                <div key={label} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-sm">
                  <p className="text-2xl font-semibold text-red-400">{value}</p>
                  <p className="text-sm text-white/70">{label}</p>
                </div>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
            className="relative"
          >
            <div className="absolute inset-0 rounded-[2rem] bg-[radial-gradient(circle_at_center,_rgba(255,31,61,0.16),_transparent_55%)] blur-3xl" />
            <div className="relative rounded-[2rem] border border-red-500/20 bg-white/[0.02] p-4 shadow-[0_0_80px_rgba(255,31,61,0.12)] backdrop-blur-xl sm:p-6">
              <div className="rounded-[1.5rem] border border-white/10 bg-[#090909]/95 p-5">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.35em] text-red-300">AI Assist</p>
                    <p className="mt-2 text-lg font-semibold">Fluxo inteligente para seu projeto</p>
                  </div>
                  <span className="rounded-full border border-red-500/50 px-3 py-1 text-xs text-red-200">online</span>
                </div>
                <div className="mt-4 space-y-3">
                  {["Escuta o cliente", "Define o escopo", "Gera proposta e conversa no WhatsApp"].map((item, index) => (
                    <div key={item} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-black/40 px-4 py-3">
                      <span className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-red-500/20 text-sm text-red-200">
                        {index + 1}
                      </span>
                      <p className="text-sm text-white/80">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      <section id="servicos" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          className="mb-8 flex flex-col gap-3"
        >
          <p className="text-sm uppercase tracking-[0.4em] text-red-300">Serviços</p>
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 className="text-3xl font-semibold text-white sm:text-4xl">Catálogo inteligente de serviços</h2>
              <p className="mt-3 max-w-2xl text-white/70">
                Selecione o que você precisa e o formulário vai montar uma mensagem pronta para o WhatsApp da IntraMark.
              </p>
            </div>
          </div>
        </motion.div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {services.map((service, index) => {
            const isSelected = selectedServices.includes(service.id);
            return (
              <motion.button
                type="button"
                key={service.id}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: index * 0.03 }}
                onClick={() => toggleService(service.id)}
                className={`text-left rounded-[1.6rem] border px-5 py-5 transition-all duration-300 ${
                  isSelected
                    ? "border-red-500 bg-red-500/10 shadow-[0_0_24px_rgba(255,31,61,0.3)]"
                    : "border-white/10 bg-white/[0.03] hover:border-red-500/60 hover:bg-red-500/5"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-black text-xl text-red-300">
                    {service.icon}
                  </div>
                  <span className={`rounded-full px-3 py-1 text-[11px] ${isSelected ? "bg-red-500 text-black" : "bg-white/5 text-white/80"}`}>
                    {isSelected ? "Selecionado" : "Disponível"}
                  </span>
                </div>
                <h3 className="mt-4 text-lg font-semibold text-white">{service.name}</h3>
                <p className="mt-2 text-sm leading-6 text-white/70">{service.description}</p>
              </motion.button>
            );
          })}
        </div>
      </section>

      <section id="formulario" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <motion.div
          ref={formRef}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]"
        >
          <div className="rounded-[2rem] border border-red-500/20 bg-gradient-to-br from-red-500/10 to-transparent p-6 sm:p-8">
            <p className="text-sm uppercase tracking-[0.4em] text-red-300">Formulário inteligente</p>
            <h2 className="mt-4 text-3xl font-semibold text-white">Personalize o projeto com rapidez</h2>
            <p className="mt-3 text-white/70">
              Preencha os campos e, ao enviar, a mensagem será automaticamente formatada e aberta no WhatsApp da empresa.
            </p>
            <div className="mt-6 space-y-3 text-sm text-white/75">
              <div className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3">
                Serviços selecionados: {selectedServices.length > 0 ? selectedServices.length : "nenhum"}
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3">
                Status: {status === "idle" ? "Pronto para enviar" : status}
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="rounded-[2rem] border border-white/10 bg-white/[0.02] p-5 sm:p-7">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-2 text-sm text-white/80">
                Nome
                <input
                  value={formData.name}
                  onChange={(event) => setFormData((current) => ({ ...current, name: event.target.value }))}
                  className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none transition focus:border-red-500"
                  placeholder="Seu nome"
                />
              </label>
              <label className="space-y-2 text-sm text-white/80">
                Empresa
                <input
                  value={formData.company}
                  onChange={(event) => setFormData((current) => ({ ...current, company: event.target.value }))}
                  className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none transition focus:border-red-500"
                  placeholder="Nome da empresa"
                />
              </label>
            </div>

            <label className="mt-4 block space-y-2 text-sm text-white/80">
              WhatsApp
              <input
                value={formData.whatsapp}
                onChange={(event) => setFormData((current) => ({ ...current, whatsapp: event.target.value }))}
                className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none transition focus:border-red-500"
                placeholder="(99) 99999-9999"
              />
            </label>

            <label className="mt-4 block space-y-2 text-sm text-white/80">
              Descrição do projeto
              <textarea
                value={formData.description}
                onChange={(event) => setFormData((current) => ({ ...current, description: event.target.value }))}
                rows={7}
                className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none transition focus:border-red-500"
                placeholder="Descreva sua ideia ou projeto..."
              />
            </label>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="submit"
                className="rounded-full bg-red-500 px-5 py-3 text-sm font-semibold text-black shadow-[0_0_28px_rgba(255,31,61,0.4)] transition hover:bg-red-400"
              >
                Enviar Projeto
              </button>
              <button
                type="button"
                onClick={() => setSelectedServices([])}
                className="rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:border-red-500/70"
              >
                Limpar seleção
              </button>
            </div>
          </form>
        </motion.div>
      </section>

      <section id="sobre" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          className="rounded-[2rem] border border-white/10 bg-white/[0.02] px-5 py-8 sm:px-8"
        >
          <p className="text-sm uppercase tracking-[0.4em] text-red-300">Sobre a IntraMark</p>
          <h2 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">Tecnologia com foco em resultado real</h2>
          <p className="mt-4 max-w-3xl text-white/75">
            A IntraMark transforma operações complexas em experiências digitais confortáveis, rápidas e visualmente premium. Entregamos softwares, integrações e experiências digitais que conectam estratégia, automação e crescimento.
          </p>
        </motion.div>
      </section>

      <footer className="mt-12 border-t border-white/10 bg-black/70">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-6 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div>
            <IntraMarkLogo className="mb-2" />
            <p className="text-sm text-white/65">© 2026 IntraMark Tecnolig. Todos os direitos reservados.</p>
          </div>
          <div className="flex flex-wrap gap-4 text-sm text-white/70">
            <a href={`https://wa.me/${whatsappNumber}`} className="transition hover:text-white">WhatsApp</a>
            <a href="https://www.instagram.com/intramark_tech?igsh=MTFwZXo3MWg5dnBvZw==" target="_blank" rel="noopener noreferrer" className="transition hover:text-white">Instagram</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
