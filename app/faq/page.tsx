"use client";

import { useState } from "react";
import Navbar from "@/components/custom/navbar/navbar";

interface FAQItem {
  question: string;
  answer: string;
  category: string;
  icon?: string;
}

const faqData: FAQItem[] = [
  // Platform Questions
  {
    category: "Platform",
    question: "What is SafeCampus?",
    answer: "SafeCampus is a gamified disaster preparedness platform designed specifically for schools. It combines interactive educational games, comprehensive learning modules, and real-time analytics to help students, teachers, and administrators prepare for various natural disasters including earthquakes, floods, tsunamis, volcanoes, and forest fires.",
    icon: "🏫",
  },
  {
    category: "Platform",
    question: "Who can use SafeCampus?",
    answer: "SafeCampus is designed for three types of users: Students who can play games and complete modules to learn about disaster preparedness, Teachers who can track student progress and manage class activities, and Administrators who can oversee the entire system and access detailed analytics.",
    icon: "👥",
  },
  {
    category: "Platform",
    question: "How do I get started?",
    answer: "Simply create an account by clicking the 'Sign Up' button, choose your role (Student, Teacher, or Admin), and complete the registration. Once logged in, you'll have access to your personalized dashboard where you can explore games, modules, and track your progress.",
    icon: "🚀",
  },

  // Earthquake Preparedness
  {
    category: "Earthquake",
    question: "What should I do during an earthquake?",
    answer: "Follow the 'Drop, Cover, and Hold On' procedure: Drop down to your hands and knees, take Cover under a sturdy desk or table, and Hold On to your shelter until the shaking stops. Stay away from windows, outside walls, and anything that could fall. If outdoors, move to an open area away from buildings, trees, and power lines.",
    icon: "🏚️",
  },
  {
    category: "Earthquake",
    question: "How can I prepare for an earthquake at school?",
    answer: "Create an emergency kit with water, non-perishable food, first aid supplies, flashlight, and battery-powered radio. Identify safe spots in each room (under desks, against interior walls). Practice earthquake drills regularly. Secure heavy furniture and equipment. Know your school's evacuation routes and assembly points.",
    icon: "🎒",
  },
  {
    category: "Earthquake",
    question: "What are the aftershocks and why are they dangerous?",
    answer: "Aftershocks are smaller earthquakes that follow the main earthquake. They can occur minutes, hours, days, or even weeks after the initial quake. They're dangerous because they can cause already weakened structures to collapse and can be strong enough to cause additional damage. Always be prepared for aftershocks after an earthquake.",
    icon: "⚠️",
  },

  // Flood Preparedness
  {
    category: "Flood",
    question: "What should I do if there's a flood warning?",
    answer: "Move immediately to higher ground. Never wait for instructions if you're in danger. Avoid walking or driving through flood waters - just 6 inches of moving water can knock you down, and 12 inches can carry away a small car. Follow evacuation orders from authorities and stay informed through emergency broadcasts.",
    icon: "🌊",
  },
  {
    category: "Flood",
    question: "How do I prepare for potential flooding?",
    answer: "Know your area's flood risk and evacuation routes. Keep emergency supplies ready including water, food, medications, and important documents in waterproof containers. Install check valves in building sewer traps to prevent flood water backup. Have sandbags ready if you live in a flood-prone area. Sign up for emergency alerts from local authorities.",
    icon: "🛡️",
  },
  {
    category: "Flood",
    question: "Why is it dangerous to walk or drive through flood water?",
    answer: "Flood water can be deceptively powerful - just 6 inches of fast-moving water can knock over an adult. It often contains debris, sharp objects, and potentially hazardous materials. Roads may be washed out underneath the water. Vehicles can be swept away in as little as 12 inches of moving water. Additionally, flood water can be contaminated with sewage and chemicals.",
    icon: "🚗",
  },

  // Tsunami Preparedness
  {
    category: "Tsunami",
    question: "What are the warning signs of a tsunami?",
    answer: "Natural warning signs include: a strong earthquake lasting 20 seconds or more if you're near the coast, sudden rise or fall of coastal waters, loud roar from the ocean similar to a train or airplane. Official warnings come through emergency broadcast systems, sirens, and alert systems. If you notice any of these signs, move to high ground immediately.",
    icon: "📢",
  },
  {
    category: "Tsunami",
    question: "How should I respond to a tsunami warning?",
    answer: "Move inland or to higher ground immediately - at least 100 feet above sea level or 2 miles inland. Don't wait for official evacuation orders if you see natural warning signs. Stay away from beaches and coastal areas. Never go to the shore to watch a tsunami. If you're in a boat at sea, stay there - tsunamis are less dangerous in deep water.",
    icon: "⛰️",
  },
  {
    category: "Tsunami",
    question: "Can tsunamis occur in any ocean?",
    answer: "While tsunamis can occur in any large body of water, they're most common in the Pacific Ocean's 'Ring of Fire' due to frequent seismic activity. However, they can also occur in the Atlantic, Indian Ocean, and even large lakes. Coastal areas worldwide should have tsunami preparedness plans in place.",
    icon: "🌏",
  },

  // Volcano Preparedness
  {
    category: "Volcano",
    question: "What are the main hazards from volcanic eruptions?",
    answer: "Primary hazards include: lava flows that can destroy everything in their path, ashfall that can collapse buildings and contaminate water, pyroclastic flows (fast-moving clouds of hot gas and rock), lahars (volcanic mudflows), and volcanic gases that can be toxic. Ashfall can also disrupt transportation, damage crops, and cause respiratory problems.",
    icon: "🌋",
  },
  {
    category: "Volcano",
    question: "How do I protect myself during volcanic ashfall?",
    answer: "Stay indoors and close all windows and doors. Use damp towels at door thresholds to prevent ash from entering. Wear long-sleeved shirts and pants. Use goggles and a dust mask or hold a damp cloth over your face when outside. Avoid driving unless absolutely necessary - ash can damage engines. Protect electronics from ash contamination.",
    icon: "😷",
  },
  {
    category: "Volcano",
    question: "What should be in my volcanic emergency kit?",
    answer: "Include goggles and disposable breathing masks for each family member, flashlight and extra batteries, battery-powered radio, first aid kit, emergency food and water (1 gallon per person per day), essential medications, sturdy shoes, emergency cash, and copies of important documents in waterproof containers.",
    icon: "🧰",
  },

  // Forest Fire Preparedness
  {
    category: "Forest Fire",
    question: "How can I prepare my school for wildfire season?",
    answer: "Create a defensible space by clearing dry vegetation around buildings. Ensure emergency exits are clearly marked and unobstructed. Maintain an updated evacuation plan with multiple routes. Keep emergency supplies ready. Install spark arresters on chimneys. Ensure all staff know how to use fire extinguishers. Conduct regular fire drills and keep emergency contact lists updated.",
    icon: "🔥",
  },
  {
    category: "Forest Fire",
    question: "What should I do if a wildfire is approaching?",
    answer: "Follow evacuation orders immediately - don't wait. Close all windows and doors but leave them unlocked. Turn on lights to increase visibility in heavy smoke. Move flammable furniture to center of rooms. Close all interior doors and vents. If trapped, call 911 and give your location. Stay in a cleared area and shelter in a building if possible.",
    icon: "🚨",
  },
  {
    category: "Forest Fire",
    question: "How do I stay informed about wildfire risks?",
    answer: "Sign up for local emergency alerts and warnings. Monitor local news and weather reports, especially during dry seasons. Check air quality indexes regularly. Follow social media accounts of local fire departments and emergency services. Know your area's fire danger rating. Download emergency apps from local authorities.",
    icon: "📱",
  },

  // General Preparedness
  {
    category: "General Preparedness",
    question: "What items should be in a school emergency kit?",
    answer: "Essential items include: water (1 gallon per person per day for 3 days), non-perishable food for 3 days, battery-powered or hand-crank radio, flashlight and extra batteries, first aid kit, whistle to signal for help, dust masks, plastic sheeting and duct tape, moist towelettes and garbage bags, wrench or pliers, local maps, and cell phone with chargers and backup battery.",
    icon: "🎒",
  },
  {
    category: "General Preparedness",
    question: "How often should we practice emergency drills?",
    answer: "Schools should conduct emergency drills at least once per semester for each type of disaster relevant to their location. This typically means 4-6 drills per year. Different types of drills (earthquake, fire, lockdown, evacuation) should be practiced. Regular practice helps ensure everyone knows what to do in a real emergency and identifies any problems with emergency plans.",
    icon: "📅",
  },
  {
    category: "General Preparedness",
    question: "What is an emergency communication plan?",
    answer: "An emergency communication plan establishes how students, staff, and families will communicate during and after a disaster. It includes: designated meeting points, out-of-area contact persons, multiple communication methods (phone, text, email, social media), a plan for family reunification, and procedures for checking in after an emergency. Everyone should have copies of this plan and review it regularly.",
    icon: "📞",
  },

  // Using SafeCampus
  {
    category: "Using SafeCampus",
    question: "How do the educational games work?",
    answer: "Our games are designed to make learning about disaster preparedness engaging and memorable. They include quizzes to test knowledge, puzzle games to solve emergency scenarios, adventure games where you navigate disaster situations, and rhythm-based activities. Each game is themed around specific disasters and awards points for correct responses and smart decisions.",
    icon: "🎮",
  },
  {
    category: "Using SafeCampus",
    question: "How can teachers track student progress?",
    answer: "Teachers have access to a dedicated dashboard showing student performance metrics including games played, average scores, modules completed, and recent activity. This helps identify which students may need additional support and which areas of disaster preparedness need more focus in the classroom.",
    icon: "📊",
  },
  {
    category: "Using SafeCampus",
    question: "Are the learning modules suitable for all ages?",
    answer: "Yes! Our modules are designed to be accessible and educational for students of all ages. Content is presented in an age-appropriate manner with visual aids, interactive elements, and clear explanations. Teachers can guide students through modules at an appropriate pace for their grade level.",
    icon: "📚",
  },
];

const categories = [
  { name: "All", icon: "🔍", color: "from-gray-500 to-gray-700" },
  { name: "Platform", icon: "🏫", color: "from-blue-500 to-blue-700" },
  { name: "Earthquake", icon: "🏚️", color: "from-yellow-600 to-orange-600" },
  { name: "Flood", icon: "🌊", color: "from-cyan-500 to-blue-600" },
  { name: "Tsunami", icon: "⛰️", color: "from-teal-500 to-cyan-600" },
  { name: "Volcano", icon: "🌋", color: "from-red-500 to-orange-600" },
  { name: "Forest Fire", icon: "🔥", color: "from-orange-500 to-red-600" },
  { name: "General Preparedness", icon: "🛡️", color: "from-green-500 to-emerald-600" },
  { name: "Using SafeCampus", icon: "🎮", color: "from-purple-500 to-indigo-600" },
];

export default function FAQ() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [openQuestion, setOpenQuestion] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredFAQs = faqData.filter((faq) => {
    const matchesCategory = selectedCategory === "All" || faq.category === selectedCategory;
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleQuestion = (index: number) => {
    setOpenQuestion(openQuestion === index ? null : index);
  };

  const getCategoryColor = (categoryName: string) => {
    const category = categories.find(cat => cat.name === categoryName);
    return category?.color || "from-gray-500 to-gray-700";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950">
      <Navbar />
      
      {/* Hero Header with Animated Background */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white">
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
        </div>
        
        <div className="relative container mx-auto px-4 py-20 md:py-28">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-6 py-2 mb-6 animate-fade-in">
              <span className="text-2xl">💡</span>
              <span className="text-sm font-semibold">Knowledge Base</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in-up">
              Frequently Asked Questions
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed animate-fade-in-up animation-delay-200">
              Everything you need to know about disaster preparedness and SafeCampus
            </p>
            
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 md:gap-8 mt-12 max-w-2xl mx-auto">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 md:p-6 border border-white/20 animate-fade-in-up animation-delay-400">
                <div className="text-3xl md:text-4xl font-bold mb-1">{faqData.length}</div>
                <div className="text-sm md:text-base text-blue-100">Questions</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 md:p-6 border border-white/20 animate-fade-in-up animation-delay-600">
                <div className="text-3xl md:text-4xl font-bold mb-1">{categories.length - 1}</div>
                <div className="text-sm md:text-base text-blue-100">Categories</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 md:p-6 border border-white/20 animate-fade-in-up animation-delay-800">
                <div className="text-3xl md:text-4xl font-bold mb-1">24/7</div>
                <div className="text-sm md:text-base text-blue-100">Available</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 0L60 10C120 20 240 40 360 46.7C480 53 600 47 720 43.3C840 40 960 40 1080 46.7C1200 53 1320 67 1380 73.3L1440 80V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V0Z" fill="currentColor" className="text-slate-50 dark:text-slate-950"/>
          </svg>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-8 pb-20 relative z-10">
        {/* Enhanced Search Bar */}
        <div className="mb-12 animate-fade-in-up">
          <div className="relative max-w-3xl mx-auto">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-2xl blur-xl opacity-30 animate-pulse"></div>
            <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-700 overflow-hidden">
              <div className="flex items-center px-6 py-2">
                <svg
                  className="w-6 h-6 text-gray-400 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  type="text"
                  placeholder="Search for questions about disasters, safety, or the platform..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-4 bg-transparent focus:outline-none text-lg text-gray-800 dark:text-gray-100 placeholder-gray-400"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full transition-colors"
                  >
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Category Filter with Icons */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-center mb-8 text-gray-800 dark:text-gray-100">
            Browse by Category
          </h2>
          <div className="flex flex-wrap gap-4 justify-center max-w-5xl mx-auto">
            {categories.map((category) => (
              <button
                key={category.name}
                onClick={() => setSelectedCategory(category.name)}
                className={`group relative px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                  selectedCategory === category.name
                    ? "shadow-xl scale-105"
                    : "bg-white dark:bg-slate-800 shadow-md hover:shadow-lg"
                }`}
              >
                {selectedCategory === category.name && (
                  <div className={`absolute inset-0 bg-gradient-to-r ${category.color} rounded-xl`}></div>
                )}
                <div className={`relative flex items-center gap-2 ${
                  selectedCategory === category.name ? "text-white" : "text-gray-700 dark:text-gray-200"
                }`}>
                  <span className="text-xl">{category.icon}</span>
                  <span>{category.name}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        {searchQuery && (
          <div className="text-center mb-6 text-gray-600 dark:text-gray-400">
            Found <span className="font-bold text-blue-600 dark:text-blue-400">{filteredFAQs.length}</span> result{filteredFAQs.length !== 1 ? 's' : ''}
          </div>
        )}

        {/* FAQ List with Enhanced Design */}
        <div className="max-w-5xl mx-auto space-y-4">
          {filteredFAQs.length > 0 ? (
            filteredFAQs.map((faq, index) => (
              <div
                key={index}
                className="group bg-white dark:bg-slate-800 border-2 border-gray-200 dark:border-slate-700 rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <button
                  onClick={() => toggleQuestion(index)}
                  className="w-full px-6 md:px-8 py-6 flex items-start gap-4 text-left hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-slate-700 dark:hover:to-slate-700 transition-all duration-300"
                >
                  {/* Icon */}
                  <div className={`flex-shrink-0 w-12 h-12 md:w-14 md:h-14 rounded-xl bg-gradient-to-br ${getCategoryColor(faq.category)} flex items-center justify-center text-2xl md:text-3xl shadow-lg transform group-hover:scale-110 transition-transform duration-300`}>
                    {faq.icon}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <span className={`text-xs font-bold bg-gradient-to-r ${getCategoryColor(faq.category)} text-white px-3 py-1 rounded-full shadow-md`}>
                        {faq.category}
                      </span>
                      {openQuestion === index && (
                        <span className="text-xs font-semibold text-green-600 dark:text-green-400 flex items-center gap-1">
                          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                          Reading
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg md:text-xl font-bold text-gray-800 dark:text-gray-100 pr-4 leading-snug">
                      {faq.question}
                    </h3>
                  </div>
                  
                  {/* Chevron */}
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 dark:bg-slate-700 flex items-center justify-center transition-all duration-300 ${
                    openQuestion === index ? "rotate-180 bg-blue-100 dark:bg-blue-900" : ""
                  }`}>
                    <svg
                      className={`w-5 h-5 transition-colors ${
                        openQuestion === index ? "text-blue-600 dark:text-blue-400" : "text-gray-500 dark:text-gray-400"
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </button>
                
                {/* Answer */}
                <div className={`overflow-hidden transition-all duration-500 ${
                  openQuestion === index ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
                }`}>
                  <div className="px-6 md:px-8 pb-6 pt-2 ml-0 md:ml-16">
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-700 dark:to-slate-700 rounded-xl p-6 border-l-4 border-blue-500">
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-base md:text-lg">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-2xl shadow-xl">
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-slate-600 dark:to-slate-700 rounded-full flex items-center justify-center">
                <svg
                  className="w-12 h-12 text-gray-400 dark:text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">No FAQs Found</h3>
              <p className="text-gray-500 dark:text-gray-400 text-lg mb-6">
                We couldn&apos;t find any questions matching &quot;<span className="font-semibold text-blue-600 dark:text-blue-400">{searchQuery}</span>&quot;
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("All");
                }}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>

        {/* Enhanced Contact Section */}
        <div className="mt-20 max-w-5xl mx-auto">
          <div className="relative bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 rounded-3xl p-1 shadow-2xl">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-10 md:p-12">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-4 shadow-xl">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-100 mb-3">
                  Still have questions?
                </h2>
                <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
                  Can&apos;t find the answer you&apos;re looking for? Our dedicated support team is here to help you 24/7.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <a
                  href="mailto:support@safecampus.edu"
                  className="group flex items-center gap-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-2xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="flex-1 text-left">
                    <div className="text-sm opacity-90">Email us at</div>
                    <div className="text-lg font-bold">support@safecampus.edu</div>
                  </div>
                  <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
                
                <a
                  href="/how-it-works"
                  className="group flex items-center gap-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-2xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="flex-1 text-left">
                    <div className="text-sm opacity-90">Learn more</div>
                    <div className="text-lg font-bold">How It Works</div>
                  </div>
                  <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .animation-delay-200 {
          animation-delay: 0.2s;
        }
        .animation-delay-400 {
          animation-delay: 0.4s;
        }
        .animation-delay-600 {
          animation-delay: 0.6s;
        }
        .animation-delay-800 {
          animation-delay: 0.8s;
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out;
        }
      `}</style>
    </div>
  );
}
