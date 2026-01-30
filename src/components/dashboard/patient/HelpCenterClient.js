'use client';

import React, { useState, useMemo } from 'react';
import {
  Search,
  BookOpen,
  MessageCircle,
  FileText,
  ChevronRight,
  HelpCircle,
  Download,
  ExternalLink,
  Stethoscope,
  ShieldCheck,
  Activity,
  Calendar,
} from 'lucide-react';
import { Input, Card, CardContent, Button, Badge } from '@/components/ui';
import { cn } from '@/lib/cn';

const KNOWLEDGE_BASE = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    description: 'Learn the basics of using the CDSS platform.',
    icon: <BookOpen className="h-6 w-6 text-blue-500" />,
    articles: [
      {
        id: 'overview',
        title: 'Patient Dashboard Overview',
        content:
          'Navigate the main dashboard, view your health statistics, and access your medical records.',
        readTime: '3 min read',
      },
      {
        id: 'profile-setup',
        title: 'Setting up your profile',
        content:
          'Manage your personal details, update your contact information, and upload your profile picture.',
        readTime: '5 min read',
      },
      {
        id: 'first-appointment',
        title: 'Booking your first appointment',
        content:
          'Step-by-step guide to scheduling your first appointment with a healthcare provider.',
        readTime: '4 min read',
      },
    ],
  },
  {
    id: 'health-tips',
    title: 'Health Tips',
    description: 'Guides and tips for maintaining a healthy lifestyle.',
    icon: <Activity className="h-6 w-6 text-green-500" />,
    articles: [
      {
        id: 'diet-tips',
        title: 'Healthy Eating Habits',
        content:
          'Learn about balanced diets, meal planning, and tips for maintaining a healthy weight.',
        readTime: '6 min read',
      },
      {
        id: 'exercise',
        title: 'Exercise Routines',
        content:
          'Discover effective exercise routines tailored to your fitness level and goals.',
        readTime: '3 min read',
      },
      {
        id: 'mental-health',
        title: 'Mental Health Awareness',
        content:
          'Understand the importance of mental health and how to manage stress effectively.',
        readTime: '5 min read',
      },
    ],
  },
  {
    id: 'security-compliance',
    title: 'Security & Privacy',
    description: 'Learn how we protect your data and ensure your privacy.',
    icon: <ShieldCheck className="h-6 w-6 text-indigo-500" />,
    articles: [
      {
        id: 'data-privacy',
        title: 'Your Data Privacy',
        content:
          'Overview of how we protect your data with encryption and comply with privacy regulations.',
        readTime: '4 min read',
      },
      {
        id: 'account-security',
        title: 'Account Security Tips',
        content:
          'Best practices for keeping your account secure, including password management and 2FA.',
        readTime: '3 min read',
      },
    ],
  },
];

const FAQS = [
  {
    question: 'How do I book an appointment?',
    answer:
      'Navigate to the Appointments section in your dashboard and select a date and time that works for you.',
  },
  {
    question: 'How is my data protected?',
    answer:
      'We use industry-standard encryption and comply with healthcare data protection regulations.',
  },
  {
    question: 'Can I update my profile information?',
    answer:
      'Yes, you can update your profile information in the Settings section of your dashboard.',
  },
  {
    question: 'What should I do if I forget my password?',
    answer:
      'Click on the "Forgot Password" link on the login page and follow the instructions to reset your password.',
  },
];

export default function HelpCenterClient() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredContent = useMemo(() => {
    if (!searchQuery) {
      if (activeCategory === 'all') return KNOWLEDGE_BASE;
      return KNOWLEDGE_BASE.filter((cat) => cat.id === activeCategory);
    }

    const lowerQuery = searchQuery.toLowerCase();

    return KNOWLEDGE_BASE.map((cat) => ({
      ...cat,
      articles: cat.articles.filter(
        (article) =>
          article.title.toLowerCase().includes(lowerQuery) ||
          article.content.toLowerCase().includes(lowerQuery)
      ),
    })).filter(
      (cat) =>
        cat.title.toLowerCase().includes(lowerQuery) ||
        cat.description.toLowerCase().includes(lowerQuery) ||
        cat.articles.length > 0
    );
  }, [searchQuery, activeCategory]);

  return (
    <div className="space-y-12">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 to-blue-700 p-8 text-center text-white shadow-xl md:p-12">
        <div className="absolute top-0 left-0 h-full w-full bg-[url('/grid-pattern.svg')] opacity-10"></div>
        <div className="relative z-10 mx-auto max-w-3xl space-y-6">
          <h1 className="text-4xl font-black tracking-tight md:text-5xl">
            How can we help you?
          </h1>
          <p className="mx-auto max-w-2xl text-lg font-medium text-indigo-100">
            Find answers, guides, and resources to help you manage your health and wellness.
          </p>
          <div className="group relative mx-auto max-w-xl">
            <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center">
              <Search className="h-5 w-5 text-indigo-300 transition-colors group-focus-within:text-indigo-500" />
            </div>
            <Input
              placeholder="Search for articles, guides, or FAQs..."
              className="text-foreground placeholder:text-muted-foreground h-16 rounded-2xl border-none bg-white/95 pl-12 text-base font-semibold shadow-lg transition-all placeholder:font-medium focus:bg-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
        <div className="hidden space-y-6 lg:col-span-3 lg:block">
          <div className="sticky top-24">
            <h3 className="mb-4 px-2 text-lg font-bold">Categories</h3>
            <div className="space-y-1">
              <Button
                variant={activeCategory === 'all' ? 'secondary' : 'ghost'}
                className="w-full justify-start rounded-xl font-semibold"
                onClick={() => setActiveCategory('all')}
              >
                All Topics
              </Button>
              {KNOWLEDGE_BASE.map((cat) => (
                <Button
                  key={cat.id}
                  variant={activeCategory === cat.id ? 'secondary' : 'ghost'}
                  className="text-muted-foreground hover:text-foreground w-full justify-start rounded-xl font-medium"
                  onClick={() => setActiveCategory(cat.id)}
                >
                  {cat.title}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-10 lg:col-span-9">
          {filteredContent.length > 0 ? (
            filteredContent.map((category) => (
              <div
                key={category.id}
                className="animate-in fade-in slide-in-from-bottom-4 space-y-4 duration-500"
              >
                <div className="mb-2 flex items-center gap-3">
                  <div className="bg-muted rounded-xl p-2">{category.icon}</div>
                  <div>
                    <h2 className="text-xl font-bold">{category.title}</h2>
                    <p className="text-muted-foreground text-sm font-medium">
                      {category.description}
                    </p>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  {category.articles.map((article) => (
                    <Card
                      key={article.id}
                      className="group border-border hover:border-primary/50 cursor-pointer rounded-2xl transition-all hover:shadow-md"
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between gap-4">
                          <h3 className="group-hover:text-primary text-lg leading-tight font-bold transition-colors">
                            {article.title}
                          </h3>
                          <Badge
                            variant="secondary"
                            className="shrink-0 text-[10px] font-bold uppercase"
                          >
                            {article.readTime}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground mt-3 line-clamp-3 text-sm leading-relaxed">
                          {article.content}
                        </p>
                        <div className="text-primary mt-4 flex translate-y-2 transform items-center text-xs font-bold tracking-widest uppercase opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                          Read Article <ChevronRight className="ml-1 h-3 w-3" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center opacity-60">
              <Search className="text-muted-foreground mb-4 h-16 w-16 opacity-50" />
              <h3 className="text-xl font-bold">No results found</h3>
              <p className="text-muted-foreground">Try adjusting your search terms</p>
            </div>
          )}

          {!searchQuery && (
            <div className="border-t pt-8">
              <h2 className="mb-8 text-2xl font-bold">Frequently Asked Questions</h2>
              <div className="grid gap-6 md:grid-cols-2">
                {FAQS.map((faq, i) => (
                  <div
                    key={i}
                    className="bg-card rounded-2xl border p-6 shadow-sm transition-shadow hover:shadow-md"
                  >
                    <h3 className="mb-3 flex items-start gap-3 font-bold">
                      <HelpCircle className="mt-0.5 h-5 w-5 shrink-0 text-indigo-500" />
                      {faq.question}
                    </h3>
                    <p className="text-muted-foreground pl-8 text-sm leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-slate-900 to-slate-800 p-8 text-center text-white shadow-2xl md:p-12">
        <div className="animate-blob absolute top-0 right-0 rounded-full bg-blue-500 p-32 opacity-20 mix-blend-overlay blur-3xl filter"></div>
        <div className="animate-blob animation-delay-2000 absolute bottom-0 left-0 rounded-full bg-purple-500 p-32 opacity-20 mix-blend-overlay blur-3xl filter"></div>

        <div className="relative z-10 flex flex-col items-center">
          <div className="mb-6 rounded-full bg-white/10 p-4 backdrop-blur-sm">
            <MessageCircle className="h-8 w-8 text-white" />
          </div>

          <h2 className="mb-4 text-3xl font-black tracking-tight">Still need support?</h2>
          <p className="mb-8 max-w-lg text-lg font-medium text-slate-300">
            Our support team is available 24/7 to assist you with any issues or questions.
          </p>
          <Button className="h-14 rounded-2xl bg-white px-10 text-lg font-bold text-slate-900 shadow-lg transition-colors hover:bg-indigo-50 hover:shadow-xl">
            Contact Support
          </Button>
        </div>
      </div>
    </div>
  );
}
