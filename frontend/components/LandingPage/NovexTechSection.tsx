"use client"
import { motion } from 'framer-motion'
import { BrainCircuit, Blocks, Wallet, Cpu, BarChart3, ArrowLeftRight, Database, Code } from 'lucide-react'
import Link from 'next/link'




export const NovextechSection = () => {
    const techStack = [
      { name: "React.js", category: "Frontend", color: "from-blue-500 to-cyan-500", icon: <Code /> },
      { name: "TensorFlow", category: "AI Engine", color: "from-orange-500 to-red-500", icon: <BrainCircuit /> },
      { name: "Solana Web3.js", category: "Blockchain", color: "from-purple-500 to-pink-500", icon: <Blocks /> },
      { name: "Ethers.js", category: "Blockchain", color: "from-blue-500 to-indigo-500", icon: <Blocks /> },
      { name: "OKX DEX API", category: "Trading", color: "from-green-500 to-emerald-500", icon: <BarChart3 /> },
      { name: "Galess Swap", category: "Trading", color: "from-yellow-500 to-orange-500", icon: <ArrowLeftRight /> },
      { name: "Pyth Network", category: "Data Oracle", color: "from-purple-500 to-blue-500", icon: <Database /> },
      { name: "ERC-4337", category: "Wallet", color: "from-pink-500 to-red-500", icon: <Wallet /> }
    ]
  
    return (
      <section id="tech" className="py-32 bg-gradient-to-b from-transparent to-purple-900/20 dark:to-gray-900/20">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Technical Architecture
            </h2>
            <p className="text-xl text-gray-400 dark:text-gray-300 max-w-3xl mx-auto">
              Built on cutting-edge technologies for speed, security, and scalability
            </p>
          </motion.div>
  
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {techStack.map((tech, index) => (
              <motion.div
                key={index}
                className="group relative"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.05, rotateY: 15 }}
              >
                <div className="bg-white/10 dark:bg-gray-800/30 backdrop-blur-sm border border-white/20 dark:border-gray-700 rounded-2xl p-6 text-center group-hover:border-white/40 dark:group-hover:border-gray-600 transition-all duration-300">
                  <motion.div
                    className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${tech.color} flex items-center justify-center`}
                    whileHover={{ rotate: 180 }}
                    transition={{ duration: 0.5 }}
                  >
                    {tech.icon}
                  </motion.div>
                  
                  <h3 className="text-lg font-bold text-white dark:text-gray-100 mb-2">{tech.name}</h3>
                  <p className="text-sm text-gray-400 dark:text-gray-300">{tech.category}</p>
                </div>
              </motion.div>
            ))}
          </div>
  
          <motion.div
            className="mt-20 bg-white/10 dark:bg-gray-800/30 backdrop-blur-sm border border-purple-500/30 dark:border-gray-700 rounded-3xl p-12"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <motion.div
                  className="text-4xl font-bold text-purple-400 mb-2"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ type: "spring", stiffness: 200, delay: 0.5 }}
                >
                  99.9%
                </motion.div>
                <p className="text-gray-300 dark:text-gray-200">Uptime Guarantee</p>
              </div>
              <div>
                <motion.div
                  className="text-4xl font-bold text-blue-400 mb-2"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ type: "spring", stiffness: 200, delay: 0.7 }}
                >
                  &lt;100ms
                </motion.div>
                <p className="text-gray-300 dark:text-gray-200">Response Time</p>
              </div>
              <div>
                <motion.div
                  className="text-4xl font-bold text-cyan-400 mb-2"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ type: "spring", stiffness: 200, delay: 0.9 }}
                >
                  95%
                </motion.div>
                <p className="text-gray-300 dark:text-gray-200">AI Accuracy</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    )
  }