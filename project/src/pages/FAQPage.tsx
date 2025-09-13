import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ChevronDown, ChevronUp, ArrowLeft, HelpCircle, MessageCircle, Mail, Bug } from 'lucide-react';

interface FAQItem {
  id: number;
  question: string;
  answer: string;
  category: string;
}

const FAQPage: React.FC = () => {
  const { t } = useTranslation();
  const [openItems, setOpenItems] = useState<number[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const faqData: FAQItem[] = [
    {
      id: 1,
      question: t('faq1q'),
      answer: t('faq1a'),
      category: "general"
    },
    {
      id: 2,
      question: t('faq2q'),
      answer: t('faq2a'),
      category: "general"
    },
    {
      id: 3,
      question: t('faq3q'),
      answer: t('faq3a'),
      category: "technical"
    },
    {
      id: 4,
      question: t('faq4q'),
      answer: t('faq4a'),
      category: "account"
    },
    {
      id: 5,
      question: t('faq5q'),
      answer: t('faq5a'),
      category: "technical"
    },
    {
      id: 6,
      question: t('faq6q'),
      answer: t('faq6a'),
      category: "support"
    },
    {
      id: 7,
      question: t('faq7q'),
      answer: t('faq7a'),
      category: "general"
    },
    {
      id: 8,
      question: t('faq8q'),
      answer: t('faq8a'),
      category: "account"
    }
  ];

  const categories = [
    { id: 'all', name: t('allCategories'), icon: HelpCircle },
    { id: 'general', name: t('general'), icon: MessageCircle },
    { id: 'technical', name: t('technical'), icon: Bug },
    { id: 'account', name: t('account'), icon: Mail },
    { id: 'support', name: t('supportCategory'), icon: HelpCircle }
  ];

  const filteredFAQs = selectedCategory === 'all' 
    ? faqData 
    : faqData.filter(item => item.category === selectedCategory);

  const toggleItem = (id: number) => {
    setOpenItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 pt-24 md:pt-28">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <Link 
            to="/" 
            className="inline-flex items-center text-purple-400 hover:text-purple-300 transition-colors duration-300 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('back')}
          </Link>
          
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
            {t('frequentlyAskedQuestions')}
          </h1>
          <p className="text-gray-400 text-lg">
            {t('faqSubtitle')}
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map(category => {
            const Icon = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center px-4 py-2 rounded-lg transition-all duration-300 ${
                  selectedCategory === category.id
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {category.name}
              </button>
            );
          })}
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {filteredFAQs.map((item) => (
            <div
              key={item.id}
              className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 overflow-hidden"
            >
              <button
                onClick={() => toggleItem(item.id)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-700/50 transition-colors duration-300"
              >
                <span className="text-white font-medium pr-4">{item.question}</span>
                {openItems.includes(item.id) ? (
                  <ChevronUp className="w-5 h-5 text-purple-400 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-purple-400 flex-shrink-0" />
                )}
              </button>
              
              {openItems.includes(item.id) && (
                <div className="px-6 pb-4">
                  <div className="border-t border-gray-700 pt-4">
                    <p className="text-gray-300 leading-relaxed">{item.answer}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact Section */}
        <div className="mt-12 text-center">
          <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-lg p-8 border border-blue-500/30">
            <h3 className="text-xl font-semibold text-white mb-4">
              {t('cantFindAnswer')}
            </h3>
            <p className="text-gray-400 mb-6">
              {t('contactFacebook')}
            </p>
            <a
              href="https://www.facebook.com/phimtocc/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-medium transition-all duration-300"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              {t('contactFacebookButton')}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;
