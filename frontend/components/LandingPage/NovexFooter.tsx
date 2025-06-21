"use client"
import { motion } from 'framer-motion'
import { X, Twitter, Github, } from 'lucide-react'
import Link from 'next/link'




export const NovexFooter = () => {
    return (
      <footer className="py-16 bg-gradient-to-b from-transparent to-purple-900/20 dark:to-gray-900/20 border-t border-white/20 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <motion.div
              className="md:col-span-2"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">N</span>
                </div>
                <span className="font-bold text-xl">NOVEX</span>
              </div>
              <p className="text-gray-400 dark:text-gray-300 mb-4 max-w-xs">
                Your AI-driven companion for DeFi trading on Solana and Ethereum, offering unparalleled efficiency and insights.
              </p>
              <div className="flex space-x-4">
                {[
                  { icon: <Twitter className="w-5 h-5" />, href: '#' },
                  { icon: <Github className="w-5 h-5" />, href: '#' },
                  { icon: <X className="w-5 h-5" />, href: '#' }
                ].map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.href}
                    className="text-gray-400 dark:text-gray-300 hover:text-purple-400 dark:hover:text-purple-300 transition-colors"
                    whileHover={{ scale: 1.2 }}
                    transition={{ duration: 0.3 }}
                  >
                    {social.icon}
                  </motion.a>
                ))}
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h3 className="text-sm font-semibold text-white dark:text-gray-100 mb-3">Platform</h3>
              <ul className="space-y-2 text-sm">
                {['Explore', 'Technology', 'Demo', 'Support'].map((item, index) => (
                  <li key={index}>
                    <Link href={`#${item.toLowerCase()}`} className="text-gray-400 dark:text-gray-300 hover:text-purple-400 dark:hover:text-purple-300 transition-colors">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
  

          </div>
  
          <motion.div
            className="mt-10 border-t border-white/20 dark:border-gray-700 pt-6"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-center text-xs text-gray-400 dark:text-gray-300">
              © {new Date().getFullYear()} Novex. All rights reserved. Created for the Jupiter Hackathon 2025.
            </p>
          </motion.div>
        </div>
      </footer>
    )
  }