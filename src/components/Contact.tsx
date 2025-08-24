import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
// Simple icon components
const MailIcon = () => <span className="text-lg">✉️</span>;
const PhoneIcon = () => <span className="text-lg">📞</span>;
const MapPinIcon = () => <span className="text-lg">📍</span>;
const LinkedinIcon = () => <span className="text-lg">💼</span>;
const SendIcon = () => <span className="text-lg">📤</span>;
const CheckIcon = () => <span className="text-lg">✅</span>;
const AlertIcon = () => <span className="text-lg">⚠️</span>;
// import emailjs from '@emailjs/browser'; // Removed unused import

const Contact: React.FC = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2
  });

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('sending');

    try {
      // Create mailto link with form data
      const subject = encodeURIComponent(formData.subject);
      const body = encodeURIComponent(
        `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
      );
      const mailtoLink = `mailto:loveoh19@gmail.com?subject=${subject}&body=${body}`;
      
      // Open default email client
      window.location.href = mailtoLink;
      
      setFormStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
      
      setTimeout(() => setFormStatus('idle'), 3000);
    } catch (error) {
      setFormStatus('error');
      setTimeout(() => setFormStatus('idle'), 5000);
    }
  };

  const contactInfo = [
    {
      icon: PhoneIcon,
      title: 'Phone',
      value: '0466 717 580',
      href: 'tel:0466717580',
      color: 'from-green-500 to-green-600'
    },
    {
      icon: MailIcon,
      title: 'Email',
      value: 'loveoh19@gmail.com',
      href: 'mailto:loveoh19@gmail.com',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: LinkedinIcon,
      title: 'LinkedIn',
      value: 'oscar-love-547120275',
      href: 'https://linkedin.com/in/oscar-love-547120275',
      color: 'from-indigo-500 to-indigo-600'
    },
    {
      icon: MapPinIcon,
      title: 'Location',
      value: 'Perth, Western Australia',
      href: '#',
      color: 'from-purple-500 to-purple-600'
    }
  ];

  return (
    <section id="contact" className="py-20 bg-black">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-[#30C55A] mb-4">
            Get In Touch
          </h2>
          <div className="w-20 h-1 bg-[#30C55A] mx-auto mb-8"></div>
          <p className="text-lg text-white max-w-3xl mx-auto">
            I'm always interested in new opportunities, collaborations, and discussions about 
            data science, software development, or any exciting projects you have in mind.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="text-2xl font-bold text-[#30C55A] mb-6">
              Contact Information
            </h3>
            
            <div className="space-y-4 mb-8">
              {contactInfo.map((info, index) => {
                const IconComponent = info.icon;
                return (
                  <motion.div
                    key={info.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                    className="group"
                  >
                    <a
                      href={info.href}
                      className="flex items-center p-4 bg-gray-900/50 border border-[#30C55A]/30 rounded-lg hover:shadow-[0_0_15px_rgba(48,197,90,0.2)] transition-all duration-300 group-hover:scale-105"
                    >
                      <div className="p-3 rounded-lg bg-[#30C55A] text-black mr-4 group-hover:scale-110 transition-transform">
                        <IconComponent />
                      </div>
                      <div>
                        <h4 className="font-semibold text-[#30C55A]">
                          {info.title}
                        </h4>
                        <p className="text-white">
                          {info.value}
                        </p>
                      </div>
                    </a>
                  </motion.div>
                );
              })}
            </div>

            {/* Availability Status */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="bg-gray-900/50 border border-[#30C55A]/50 rounded-lg p-6"
            >
              <div className="flex items-center mb-3">
                <div className="w-3 h-3 bg-[#30C55A] rounded-full mr-3 animate-pulse"></div>
                <h4 className="font-semibold text-[#30C55A]">
                  Available for Opportunities
                </h4>
              </div>
              <p className="text-white text-sm">
                Recently graduated and seeking full-time opportunities, consulting projects, and 
                collaborations in data science, software engineering, and related fields.
              </p>
            </motion.div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <form onSubmit={handleSubmit} className="bg-gray-900/50 border border-[#30C55A]/30 rounded-xl p-6 hover:shadow-[0_0_20px_rgba(48,197,90,0.2)] transition-all duration-300">
              <h3 className="text-2xl font-bold text-[#30C55A] mb-6">
                Send a Message
              </h3>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-[#30C55A] mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-[#30C55A]/30 rounded-lg focus:ring-2 focus:ring-[#30C55A] focus:border-[#30C55A] bg-black text-white transition-colors"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#30C55A] mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-[#30C55A]/30 rounded-lg focus:ring-2 focus:ring-[#30C55A] focus:border-[#30C55A] bg-black text-white transition-colors"
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-[#30C55A] mb-2">
                  Subject *
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-[#30C55A]/30 rounded-lg focus:ring-2 focus:ring-[#30C55A] focus:border-[#30C55A] bg-black text-white transition-colors"
                  placeholder="What's this about?"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-[#30C55A] mb-2">
                  Message *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={5}
                  className="w-full px-4 py-3 border border-[#30C55A]/30 rounded-lg focus:ring-2 focus:ring-[#30C55A] focus:border-[#30C55A] bg-black text-white resize-none transition-colors"
                  placeholder="Tell me about your project, opportunity, or just say hello!"
                />
              </div>

              <motion.button
                type="submit"
                disabled={formStatus === 'sending'}
                whileHover={{ scale: formStatus === 'sending' ? 1 : 1.05 }}
                whileTap={{ scale: formStatus === 'sending' ? 1 : 0.95 }}
                className={`w-full py-3 px-6 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all duration-300 ${
                  formStatus === 'success'
                    ? 'bg-[#30C55A] text-black'
                    : formStatus === 'error'
                    ? 'bg-red-600 text-white'
                    : formStatus === 'sending'
                    ? 'bg-gray-600 text-white cursor-not-allowed'
                    : 'bg-[#30C55A] text-black hover:bg-[#30C55A]/80'
                }`}
              >
                {formStatus === 'sending' && (
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                )}
                {formStatus === 'success' && <CheckIcon />}
                {formStatus === 'error' && <AlertIcon />}
                {formStatus === 'idle' && <SendIcon />}
                
                {formStatus === 'sending' && 'Sending...'}
                {formStatus === 'success' && 'Email Client Opened!'}
                {formStatus === 'error' && 'Failed to Send'}
                {formStatus === 'idle' && 'Send Message'}
              </motion.button>

              {formStatus === 'success' && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-3 text-[#30C55A] text-sm text-center"
                >
                  Your email client should have opened with the message pre-filled. Send when ready!
                </motion.p>
              )}

              {formStatus === 'error' && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-3 text-red-400 text-sm text-center"
                >
                  Sorry, there was an error sending your message. Please try again or contact me directly.
                </motion.p>
              )}
            </form>
          </motion.div>
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-16 pt-8 border-t border-[#30C55A]/30"
        >
          <p className="text-white">
            © 2024 Oscar Love. Built with React, TypeScript, and Tailwind CSS.
          </p>
          <p className="text-[#30C55A]/70 text-sm mt-2">
            Designed to showcase technical skills through the medium itself.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;