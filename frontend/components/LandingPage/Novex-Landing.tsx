"use client"

import React, { useState, useEffect } from 'react'
import { useWallet } from "@/contexts/WalletContext"
import Link from 'next/link'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { Menu, X, ArrowRight, Zap, Shield, TrendingUp, BarChart3, Cpu, Globe, Sparkles, ChevronDown, Twitter, Github, Play, Users, Award, Target, Eye, Brain } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {NovexFooter} from './NovexFooter'
import { NovextechSection } from './NovexTechSection'
import {NovexTestimonialsSection} from './NovexTestimonialSection'

const NovexLanding = () => {
  const [activeSection, setActiveSection] = useState('hero')
  const { connectWallet,  connected, connecting } = useWallet()

  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { scrollY } = useScroll()

  // Parallax effects
  const heroY = useTransform(scrollY, [0, 500], [0, -150])
  const gradientY = useTransform(scrollY, [0, 1000], [0, -300])

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['hero', 'features', 'tech', 'showcase', 'testimonials']
      const scrollPosition = window.scrollY + 100

      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const { offsetTop, offsetHeight } = element
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section)
            break
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' })
    setIsMenuOpen(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden dark:bg-gradient-to-br dark:from-gray-900 dark:via-purple-950 dark:to-gray-900">
      {/* Navigation */}
      <Navigation 
        activeSection={activeSection} 
        scrollToSection={scrollToSection}
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
      />

      {/* Hero Section */}
      <motion.section 
        id="hero" 
        className="relative min-h-screen flex items-center justify-center"
        style={{ y: heroY }}
      >
        <motion.div 
          className="absolute inset-0 opacity-30"
          style={{ y: gradientY }}
        >
          <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500/30 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl animate-pulse delay-2000" />
        </motion.div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 dark:bg-gray-800/30 backdrop-blur-sm border border-purple-500/30 rounded-full mb-8"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            >
              <Sparkles className="w-4 h-4 text-yellow-400" />
              <span className="text-sm font-medium">Exclusively for Solana</span>
            </motion.div>

            <motion.h1 
              className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              NOVEX
            </motion.h1>

            <motion.p 
              className="text-2xl md:text-3xl font-light mb-4 text-gray-300 dark:text-gray-200"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              AI-Enhanced DeFi Trading Companion
            </motion.p>

            <motion.p 
              className="text-lg md:text-xl mb-12 text-gray-400 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
            >
              Harness the power of AI to navigate Solana and Ethereum DeFi markets with precision, intelligence, and unmatched efficiency.
            </motion.p>

            <motion.div 
              className="flex flex-col sm:flex-row gap-6 justify-center items-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.8 }}
            >
              <Button
                size="lg"
                className="group px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full font-semibold flex items-center gap-3 hover:from-purple-500 hover:to-pink-500 transition-all duration-300"
                onClick={async () => {
                  if (!connected) {
                    await connectWallet()
                  }
                  if (connected) {
                    window.location.href = '/dashboard'
                  }
                }}
                disabled={connecting}
              >
                {connecting ? "Connecting..." : connected ? "Launch Dashboard" : "Connect Wallet"}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="group px-8 py-4 bg-white/10 dark:bg-gray-800/30 backdrop-blur-sm border border-white/20 dark:border-gray-700 rounded-full font-semibold flex items-center gap-3 hover:bg-white/20 dark:hover:bg-gray-700/50 transition-all duration-300"
                onClick={() => scrollToSection('showcase')}
              >
                <Play className="w-5 h-5" />
                Watch Demo
              </Button>
            </motion.div>
          </motion.div>
        </div>

      </motion.section>

      {/* Features Section */}
      <FeaturesSection />

      {/* Technical Architecture */}
      <NovextechSection />

      {/* Showcase Section */}
      <ShowcaseSection />

      {/* Testimonials */}
      <NovexTestimonialsSection />

      {/* Footer */}
      <NovexFooter />
    </div>
  )
}

const Navigation = ({ activeSection, scrollToSection, isMenuOpen, setIsMenuOpen }: { activeSection: string; scrollToSection: (id: string) => void; isMenuOpen: boolean; setIsMenuOpen: (open: boolean) => void }) => {
  const { scrollY } = useScroll()
  const navOpacity = useTransform(scrollY, [0, 100], [0, 1])

  const navItems = [
    { id: 'hero', label: 'Home' },
    { id: 'features', label: 'Features' },
    { id: 'tech', label: 'Technology' },
    { id: 'showcase', label: 'Demo' },
    { id: 'testimonials', label: 'Reviews' },
  ]

  return (
    <motion.nav 
      className="fixed top-0 left-0 right-0 z-50 p-4"
      style={{ opacity: navOpacity }}
    >
      <div className="max-w-7xl mx-auto">
        <motion.div 
          className="bg-white/10 dark:bg-gray-800/30 backdrop-blur-md border border-white/20 dark:border-gray-700 rounded-full px-6 py-3"
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
        >
          <div className="flex items-center justify-between">
            <motion.div 
              className="flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">N</span>
              </div>
              <span className="font-bold text-xl">NOVEX</span>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navItems.map((item) => (
                <motion.button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={cn(
                    'px-4 py-2 rounded-full transition-all duration-300',
                    activeSection === item.id 
                      ? 'bg-purple-500/30 text-purple-300' 
                      : 'hover:bg-white/10 dark:hover:bg-gray-700/50 text-gray-300 dark:text-gray-200'
                  )}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {item.label}
                </motion.button>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              className="md:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              whileTap={{ scale: 0.9 }}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </motion.button>
          </div>
        </motion.div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              className="md:hidden mt-4 bg-white/10 dark:bg-gray-800/30 backdrop-blur-md border border-white/20 dark:border-gray-700 rounded-2xl p-6"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {navItems.map((item, index) => (
                <motion.button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="block w-full text-left px-4 py-3 rounded-lg hover:bg-white/10 dark:hover:bg-gray-700/50 transition-colors text-gray-300 dark:text-gray-200"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {item.label}
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  )
}

const FeaturesSection = () => {
  const features = [
    {
      icon: <Brain className="w-8 h-8" />,
      title: "AI-Powered Trading",
      description: "TensorFlow models provide real-time trade signals and market predictions with 95% accuracy.",
      color: "from-purple-500 to-pink-500",
      delay: 0.1
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Cross-Chain Trading",
      description: "Seamlessly trade across Solana and Ethereum with OKX DEX and Galess Swap integration.",
      color: "from-blue-500 to-cyan-500",
      delay: 0.2
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Portfolio Analytics",
      description: "Advanced metrics and visualizations to track performance and optimize your trading strategy.",
      color: "from-green-500 to-emerald-500",
      delay: 0.3
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Gas Optimization",
      description: "AI-driven gas fee optimization reduces transaction costs by up to 60% across networks.",
      color: "from-yellow-500 to-orange-500",
      delay: 0.4
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Market Sentiment",
      description: "NLP analysis of social media and on-chain data provides market sentiment insights.",
      color: "from-red-500 to-pink-500",
      delay: 0.5
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "ERC-4337 Wallets",
      description: "Gasless, programmable smart wallets with advanced security and automation features.",
      color: "from-indigo-500 to-purple-500",
      delay: 0.6
    }
  ]

  return (
    <section id="features" className="py-32 relative">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
            Core Features
          </h2>
          <p className="text-xl text-gray-400 dark:text-gray-300 max-w-3xl mx-auto">
            Discover the powerful tools that make Novex the ultimate DeFi trading companion
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="group relative"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: feature.delay }}
              whileHover={{ scale: 1.05 }}
            >
              <div className="relative bg-white/10 dark:bg-gray-800/30 backdrop-blur-sm border border-white/20 dark:border-gray-700 rounded-3xl p-8 h-full overflow-hidden group-hover:border-white/40 dark:group-hover:border-gray-600 transition-all duration-300">
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                  initial={{ scale: 0, rotate: 180 }}
                  whileHover={{ scale: 1, rotate: 0 }}
                  transition={{ duration: 0.6 }}
                />
                
                <motion.div
                  className={`inline-flex p-3 rounded-2xl bg-gradient-to-r ${feature.color} mb-6`}
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  {feature.icon}
                </motion.div>
                
                <h3 className="text-2xl font-bold mb-4 text-white dark:text-gray-100 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-cyan-400 transition-all duration-300">
                  {feature.title}
                </h3>
                
                <p className="text-gray-400 dark:text-gray-300 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}



const ShowcaseSection = () => {
  return (
    <section id="showcase" className="py-32">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
            See Novex in Action
          </h2>
          <p className="text-xl text-gray-400 dark:text-gray-300 max-w-3xl mx-auto">
            Experience the future of DeFi trading with our interactive demo
          </p>
        </motion.div>

        <motion.div
          className="relative max-w-4xl mx-auto"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="bg-white/10 dark:bg-gray-800/30 backdrop-blur-sm border border-white/20 dark:border-gray-700 rounded-3xl p-8 relative overflow-hidden">
            <motion.div
              className="absolute inset-0"
              animate={{ 
                background: [
                  "linear-gradient(45deg, rgba(147, 51, 234, 0.1), rgba(59, 130, 246, 0.1))",
                  "linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(16, 185, 129, 0.1))",
                  "linear-gradient(225deg, rgba(16, 185, 129, 0.1), rgba(245, 101, 101, 0.1))",
                  "linear-gradient(315deg, rgba(245, 101, 101, 0.1), rgba(147, 51, 234, 0.1))"
                ]
              }}
              transition={{ duration: 4, repeat: Infinity }}
            />
            
            <div className="relative z-10">
              <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 dark:from-gray-900 dark:to-gray-800 rounded-2xl flex items-center justify-center mb-8">
                <motion.div
                  className="flex items-center gap-4 text-2xl font-semibold"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 }}
                >
                  <Play className="w-12 h-12 text-purple-400" />
                  Interactive Demo Coming Soon
                </motion.div>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  { icon: <Target className="w-12 h-12" />, title: "AI Trade Signals", desc: "Real-time recommendations" },
                  { icon: <Eye className="w-12 h-12" />, title: "Portfolio View", desc: "Comprehensive analytics" },
                  { icon: <Zap className="w-12 h-12" />, title: "Instant Execution", desc: "One-click trading" }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    className="text-center p-4"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                  >
                    <div className="w-12 h-12 mx-auto mb-3 text-purple-400">
                      {item.icon}
                    </div>
                    <h4 className="font-semibold text-white dark:text-gray-100 mb-1">{item.title}</h4>
                    <p className="text-gray-400 dark:text-gray-300 text-sm">{item.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}





export default NovexLanding