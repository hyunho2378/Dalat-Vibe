import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

// =============================================================================
// Animation Variants
// =============================================================================

const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }
    }
};

const fadeIn = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { duration: 1.2, ease: 'easeOut' }
    }
};

const stagger = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.15, delayChildren: 0.2 }
    }
};

const slideInLeft = {
    hidden: { opacity: 0, x: -30 },
    visible: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.8, ease: 'easeOut' }
    }
};

// =============================================================================
// Page Component
// =============================================================================

const CityIntro = () => {
    const { t } = useTranslation();

    return (
        <article className="bg-slate-950 text-white min-h-screen">

            {/* ============================================================= */}
            {/* HERO - Full Bleed Image */}
            {/* ============================================================= */}
            <section className="relative h-screen min-h-[800px]">
                <div className="absolute inset-0">
                    <img
                        src="https://images.unsplash.com/photo-1511497584788-876760111969?q=80&w=2000&auto=format&fit=crop"
                        alt="Misty pine forest in the highlands"
                        className="w-full h-full object-cover"
                    />
                    {/* Cool Blue Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-b from-slate-950/40 via-blue-950/50 to-slate-950" />
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-transparent to-slate-900/30 mix-blend-multiply" />
                </div>

                <div className="relative h-full flex items-end pb-32 md:pb-40">
                    <div className="max-w-7xl mx-auto px-8 md:px-16 w-full">
                        <motion.div
                            initial="hidden"
                            animate="visible"
                            variants={stagger}
                            className="text-left"
                        >
                            <motion.p
                                variants={fadeIn}
                                className="font-manrope text-sm font-light text-white/50 uppercase tracking-[0.4em] mb-6"
                            >
                                {t('cityIntro.location')}
                            </motion.p>
                            <motion.h1
                                variants={fadeInUp}
                                className="font-tenor text-6xl md:text-7xl lg:text-8xl tracking-tight leading-none mb-8"
                            >
                                Dalat
                            </motion.h1>
                            <motion.p
                                variants={fadeInUp}
                                className="font-manrope font-light text-xl md:text-2xl text-slate-300 leading-loose max-w-2xl"
                            >
                                {t('cityIntro.heroSubtitle')}
                            </motion.p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ============================================================= */}
            {/* SECTION 1 - Discovery (2-Column: Sticky Title Left / Story Right) */}
            {/* ============================================================= */}
            <section className="py-32 md:py-48">
                <div className="max-w-7xl mx-auto px-8 md:px-16">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">

                        {/* Left Column - Sticky Title */}
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-100px" }}
                            variants={slideInLeft}
                            className="lg:col-span-4 lg:sticky lg:top-32 lg:self-start"
                        >
                            <p className="font-manrope text-xs font-light text-white/40 uppercase tracking-[0.3em] mb-4">
                                {t('cityIntro.discovery')}
                            </p>
                            <p className="font-tenor text-8xl md:text-9xl text-white/10 leading-none">
                                1893
                            </p>
                        </motion.div>

                        {/* Right Column - Content (LEFT ALIGNED) */}
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-100px" }}
                            variants={stagger}
                            className="lg:col-span-8 text-left"
                        >
                            <motion.h2
                                variants={fadeInUp}
                                className="font-tenor text-3xl md:text-4xl lg:text-5xl leading-tight mb-10"
                            >
                                {t('cityIntro.discoveryTitle')}
                            </motion.h2>

                            <motion.div variants={fadeInUp} className="space-y-8 text-left">
                                <p className="font-manrope font-light text-lg text-slate-300 leading-loose">
                                    {t('cityIntro.discoveryP1')}
                                </p>
                                <p className="font-manrope font-light text-lg text-slate-400 leading-loose">
                                    {t('cityIntro.discoveryP2')}
                                </p>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ============================================================= */}
            {/* SECTION 2 - Geography (Zig-Zag: Image Left / Text Right) */}
            {/* ============================================================= */}
            <section className="py-24 md:py-32 bg-slate-900/50">
                <div className="max-w-7xl mx-auto px-8 md:px-16">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                        {/* Left - Image */}
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-100px" }}
                            variants={fadeIn}
                        >
                            <div className="aspect-[4/5] overflow-hidden">
                                <img
                                    src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=1000&fit=crop"
                                    alt="Lang Biang mountain range"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </motion.div>

                        {/* Right - Text (LEFT ALIGNED) */}
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-100px" }}
                            variants={stagger}
                            className="text-left"
                        >
                            <motion.p
                                variants={fadeIn}
                                className="font-manrope text-xs font-light text-white/40 uppercase tracking-[0.3em] mb-6"
                            >
                                {t('cityIntro.plateau')}
                            </motion.p>
                            <motion.h3
                                variants={fadeInUp}
                                className="font-tenor text-3xl md:text-4xl lg:text-5xl leading-tight mb-10"
                            >
                                {t('cityIntro.plateauTitle')}
                            </motion.h3>
                            <motion.p
                                variants={fadeInUp}
                                className="font-manrope font-light text-lg text-slate-300 leading-loose mb-8"
                            >
                                {t('cityIntro.plateauDesc')}
                            </motion.p>

                            {/* Stats */}
                            <motion.div
                                variants={fadeInUp}
                                className="flex gap-16 pt-8 border-t border-white/10"
                            >
                                <div className="text-left">
                                    <p className="font-tenor text-4xl text-white">14–23°C</p>
                                    <p className="font-manrope text-xs font-light text-white/40 uppercase tracking-wider mt-2">
                                        {t('cityIntro.yearRound')}
                                    </p>
                                </div>
                                <div className="text-left">
                                    <p className="font-tenor text-4xl text-white">4,900 ft</p>
                                    <p className="font-manrope text-xs font-light text-white/40 uppercase tracking-wider mt-2">
                                        {t('cityIntro.elevation')}
                                    </p>
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ============================================================= */}
            {/* SECTION 3 - Culture (Zig-Zag Reversed: Text Left / Image Right) */}
            {/* ============================================================= */}
            <section className="py-24 md:py-32">
                <div className="max-w-7xl mx-auto px-8 md:px-16">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                        {/* Left - Text (LEFT ALIGNED) */}
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-100px" }}
                            variants={stagger}
                            className="order-2 lg:order-1 text-left"
                        >
                            <motion.p
                                variants={fadeIn}
                                className="font-manrope text-xs font-light text-white/40 uppercase tracking-[0.3em] mb-6"
                            >
                                {t('cityIntro.heritage')}
                            </motion.p>
                            <motion.h3
                                variants={fadeInUp}
                                className="font-tenor text-3xl md:text-4xl lg:text-5xl leading-tight mb-10"
                            >
                                {t('cityIntro.heritageTitle')}
                            </motion.h3>
                            <motion.p
                                variants={fadeInUp}
                                className="font-manrope font-light text-lg text-slate-300 leading-loose mb-8"
                            >
                                {t('cityIntro.heritageP1')}
                            </motion.p>
                            <motion.p
                                variants={fadeInUp}
                                className="font-manrope font-light text-lg text-slate-400 leading-loose"
                            >
                                {t('cityIntro.heritageP2')}
                            </motion.p>
                        </motion.div>

                        {/* Right - Image */}
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-100px" }}
                            variants={fadeIn}
                            className="order-1 lg:order-2"
                        >
                            <div className="aspect-[4/5] overflow-hidden">
                                <img
                                    src="https://images.unsplash.com/photo-1555921015-5532091f6026?w=800&h=1000&fit=crop"
                                    alt="French colonial villa in Dalat"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ============================================================= */}
            {/* CLOSING - Quote */}
            {/* ============================================================= */}
            <section className="py-40 md:py-56 relative">
                <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900/50 to-slate-950" />
                <div className="relative max-w-5xl mx-auto px-8 md:px-16 text-left">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={fadeInUp}
                    >
                        <p className="font-manrope font-extralight text-2xl md:text-3xl lg:text-4xl text-slate-300 leading-loose mb-12">
                            {t('cityIntro.quote')}
                        </p>
                        <p className="font-manrope text-sm font-light text-white/30 uppercase tracking-[0.2em]">
                            {t('cityIntro.quoteAuthor')}
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* ============================================================= */}
            {/* FOOTER */}
            {/* ============================================================= */}
            <footer className="py-16 border-t border-white/5">
                <div className="max-w-7xl mx-auto px-8 md:px-16 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                    <p className="font-manrope text-xs font-light text-white/30 uppercase tracking-wider">
                        {t('cityIntro.footerText')}
                    </p>
                    <p className="font-tenor text-lg text-white/60">
                        Dalat Vibe
                    </p>
                </div>
            </footer>
        </article>
    );
};

export default CityIntro;

