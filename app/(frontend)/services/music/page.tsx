import React from "react";
import Link from "next/link";

export default function MusicServicesPage() {
  return (
    <div className="bg-zinc-950 text-white min-h-screen font-sans">
      {/* En-tête / Hero Section XXL */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden border-b border-zinc-800">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/40 to-blue-900/40 z-0" />
        <div className="container mx-auto px-6 relative z-10 text-center max-w-5xl">
          <span className="text-sm font-semibold tracking-widest text-cyan-400 uppercase mb-4 block">
            Pôle Audiovisuel & Production
          </span>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-zinc-200 to-cyan-400">
            HBL Studio+ & Production Musicale
          </h1>
          <p className="text-lg md:text-xl text-zinc-400 max-w-3xl mx-auto mb-8">
            L'excellence sonore au service de vos projets. Enregistrement, mixage, mastering et accompagnement artistique haut de gamme par CÔTIÈRE MEDIA GROUP.
          </p>
          <div className="flex justify-center gap-4">
            <Link 
              href="#booking" 
              className="px-8 py-4 bg-white text-zinc-950 font-bold rounded-full hover:bg-zinc-200 transition-all shadow-lg shadow-white/10"
            >
              Réserver une session
            </Link>
            <Link 
              href="#services" 
              className="px-8 py-4 bg-transparent border border-zinc-700 text-white font-bold rounded-full hover:bg-zinc-800 transition-all"
            >
              Nos prestations
            </Link>
          </div>
        </div>
      </section>

      {/* Grille des services / Tarifs avec effet Glassmorphism */}
      <section id="services" className="py-24 bg-zinc-900/50 backdrop-blur-3xl">
        <div className="container mx-auto px-6 max-w-7xl">
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-16">
            Nos Services & Tarifs
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Carte 1 */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 hover:border-zinc-700 transition-all duration-300 flex flex-col justify-between h-full">
              <div>
                <h3 className="text-2xl font-bold mb-4">Enregistrement Studio</h3>
                <p className="text-zinc-400 mb-6">
                  Session d'enregistrement voix et instruments avec ingénieur du son dédié. Matériel professionnel et confort premium.
                </p>
                <div className="text-4xl font-black mb-6 text-cyan-400">Sur devis</div>
              </div>
              <Link href="#booking" className="w-full py-4 bg-zinc-800 hover:bg-zinc-700 font-semibold rounded-2xl text-center transition-all">
                Demander un devis
              </Link>
            </div>

            {/* Carte 2 */}
            <div className="bg-gradient-to-b from-purple-950/20 to-transparent border border-purple-800/50 rounded-3xl p-8 shadow-2xl shadow-purple-950/20 flex flex-col justify-between h-full">
              <div>
                <span className="px-3 py-1 bg-purple-900/40 text-purple-300 text-xs font-bold rounded-full uppercase tracking-wider mb-4 inline-block">
                  Populaire
                </span>
                <h3 className="text-2xl font-bold mb-4">Mixage & Mastering</h3>
                <p className="text-zinc-400 mb-6">
                  Donnez une dimension professionnelle et XXL à vos morceaux. Traitement acoustique et dynamique de pointe.
                </p>
                <div className="text-4xl font-black mb-6 text-purple-400">Sur devis</div>
              </div>
              <Link href="#booking" className="w-full py-4 bg-purple-600 hover:bg-purple-500 font-semibold rounded-2xl text-center transition-all">
                Demander un devis
              </Link>
            </div>

            {/* Carte 3 */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 hover:border-zinc-700 transition-all duration-300 flex flex-col justify-between h-full">
              <div>
                <h3 className="text-2xl font-bold mb-4">Pack Projets & Artistes</h3>
                <p className="text-zinc-400 mb-6">
                  Formules complètes pour albums, EP ou projets institutionnels. Accompagnement de A à Z par nos équipes.
                </p>
                <div className="text-4xl font-black mb-6 text-blue-400">Sur devis</div>
              </div>
              <Link href="#booking" className="w-full py-4 bg-zinc-800 hover:bg-zinc-700 font-semibold rounded-2xl text-center transition-all">
                Demander un devis
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Section Contact / Booking */}
      <section id="booking" className="py-24 border-t border-zinc-800">
        <div className="container mx-auto px-6 max-w-3xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Besoin d'une session ou d'informations ?
          </h2>
          <p className="text-zinc-400 mb-8">
            Contactez directement le secrétariat ou l'équipe technique de CÔTIÈRE MEDIA GROUP pour planifier votre venue.
          </p>
          <div className="inline-flex items-center gap-6 px-8 py-4 bg-zinc-900 border border-zinc-700 rounded-2xl text-xl font-bold tracking-wide">
            📞 <span className="text-cyan-400">07 47 72 29 31</span>
          </div>
        </div>
      </section>
    </div>
  );
}