"use client";
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Users } from 'lucide-react';




export const NovexTestimonialsSection = () => {
    const testimonials = [
      {
        quote: "Novex transformed my DeFi trading with its AI insights. The cross-chain functionality is a game-changer!",
        author: "Sarah K.",
        role: "Crypto Trader",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=128&auto=format",
        color: "from-purple-500 to-pink-500"
      },
      {
        quote: "The portfolio analytics and gas optimization features saved me hours and thousands in fees.",
        author: "Michael R.",
        role: "DeFi Analyst",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=128&auto=format",
        color: "from-blue-500 to-cyan-500"
      },
      {
        quote: "As a beginner, Novex's intuitive interface and smart wallet made DeFi accessible and secure.",
        author: "Emily T.",
        role: "New Investor",
        avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=128&auto=format",
        color: "from-green-500 to-emerald-500"
      }
    ]
  
    return (
      <section id="testimonials" className="py-32 bg-gradient-to-b from-purple-900/20 to-transparent dark:from-gray-900/20 dark:to-transparent">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-yellow-400 to-pink-400 bg-clip-text text-transparent">
              What Our Users Say
            </h2>
            <p className="text-xl text-gray-400 dark:text-gray-300 max-w-3xl mx-auto">
              Hear from traders who have revolutionized their DeFi experience with Novex
            </p>
          </motion.div>
  
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                className="group relative"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="bg-white/10 dark:bg-gray-800/30 backdrop-blur-sm border border-white/20 dark:border-gray-700 rounded-3xl p-8 h-full group-hover:border-white/40 dark:group-hover:border-gray-600 transition-all duration-300">
                  <motion.div
                    className={`absolute inset-0 bg-gradient-to-br ${testimonial.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                    initial={{ scale: 0 }}
                    whileHover={{ scale: 1 }}
                    transition={{ duration: 0.6 }}
                  />
                  
                  <div className="relative">
                    <Users className="w-10 h-10 text-purple-400 mb-4" />
                    <p className="text-gray-300 dark:text-gray-200 mb-6 italic">"{testimonial.quote}"</p>
                    <div className="flex items-center gap-4">
                      <img
                        src={testimonial.avatar}
                        alt={testimonial.author}
                        className="w-12 h-12 rounded-full border-2 border-purple-500/50"
                      />
                      <div>
                        <p className="font-semibold text-white dark:text-gray-100">{testimonial.author}</p>
                        <p className="text-sm text-gray-400 dark:text-gray-300">{testimonial.role}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    )
  }